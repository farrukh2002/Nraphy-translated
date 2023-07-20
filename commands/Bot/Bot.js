const { ButtonBuilder } = require('discord.js');
const humanize = require("humanize-duration");
const os = require('os');
const axios = require('axios');
const { getLastDays } = require("../../modules/Functions");

module.exports = {
  interaction: {
    name: "bot",
    description: "Shows information about the bot.",
    options: [],
  },
  interactionOnly: true,
  aliases: ["botstat", "botb", "bot-info", "botinformation", "i", 'info'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: 30000,
  ownerOnly: false,
  voteRequired: true,

  async execute(client, interaction, data) {

    return interaction.reply({ content: "This command is specific to the Nraphy client.  You need to edit it to use it on your own client." });

    await interaction.deferReply();

    var usageStatsPageEmbed = null;
    var lastDays = await getLastDays(14); //14

    try {

      //------------------------------Buttons------------------------------//

      let SupportServerButton = new ButtonBuilder().setLabel('Support Server').setURL("https://discord.gg/VppTU9h").setStyle('Link');
      let InvitationLinkButton = new ButtonBuilder().setLabel('Invite Link').setURL(client.settings.invite).setStyle('Link');
      let sponsorButon = new ButtonBuilder().setLabel('Sponsor (gibir.net.tr)').setURL("https://gibir.net.tr/?utm_source=Nraphy&utm_medium=buttons&utm_id=Nraphy").setStyle('Link');

      let mainPageButton = new ButtonBuilder().setLabel('Home page').setCustomId("mainPageButton").setStyle('Primary');
      let usageStatsPageButton = new ButtonBuilder().setLabel('Usage/System Statistics').setCustomId("usageStatsPageButton").setStyle('Primary');
      let healthCheckPageButton = new ButtonBuilder().setLabel('Status Check').setCustomId("healthCheckPageButton").setStyle('Primary');//.setDisabled(true);

      if (interaction.user.id !== client.settings.owner) usageStatsPageButton.setStyle('Danger');
      if (interaction.user.id !== client.settings.owner) healthCheckPageButton.setStyle('Danger');

      //------------------------------Buttons------------------------------//

      //------------------------------Home page------------------------------//

      //---------------Bot Owner---------------//
      let sahip = (await client.shard.broadcastEval((c, ownerId) => c.users.cache.get(ownerId), { context: client.settings.owner })).find(res => res);

      //---------------Bot Instant Statistics---------------//
      let results = await Promise.all([
        await client.shard.fetchClientValues('guilds.cache.size'),
        await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        await client.shard.broadcastEval(c => c.voice.adapters.size),
        await client.shard.broadcastEval(c => c.distube?.queues.size || 0)
      ]);
      let totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      let totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      let voiceChannels = results[2].reduce((acc, voiceChannelCount) => acc + voiceChannelCount, 0);
      let playerQueues = results[3].reduce((acc, playerQueuesSize) => acc + playerQueuesSize, 0);

      //Codes to get the server difference compared to yesterday 
      let yesterdayData = await client.database.fetchClientData((await getLastDays(2)).pop());
      let yesterdayGuildCountDifference = totalGuilds - yesterdayData.guildCount;

      //---------------Errors---------------//
      let errorCount = (await client.database.fetchClientData()).error;
      let lastnDaysTotalErrors = 0;
      for await (let day of lastDays) {
        let clientDatabyDate = await client.database.fetchClientData(day);
        lastnDaysTotalErrors += clientDatabyDate.error;
      }
      let averageError = (lastnDaysTotalErrors / 14).toFixed();
      let averageErrorDifference = errorCount - averageError;

      //---------------About Commands---------------//
      let clientCommands = client.commands.filter(command => command.category && command.category !== "Developer");
      let commandsInteractionSupport = 0;
      let commandsInteractionOnly = 0;
      let commandsVoteRequired = 0;
      clientCommands.forEach(command => {
        if (command.interaction) commandsInteractionSupport++;
        if (command.interactionOnly) commandsInteractionOnly++;
        if (command.voteRequired) commandsVoteRequired++;
      });

      //Home - Embed
      let mainPageEmbed = {
        color: client.settings.embedColors.default,
        author: {
          name: `${client.user.username} • Bot Information`,
          icon_url: client.settings.icon,
        },
        title: `**»** You can type \`${data.prefix}commands\` to access all commands!`,
        fields: [
          {
            name: '**»** Bot Owner',
            value: `**•** **\`${owner.tag}\`** \`(ID: ${client.settings.owner})\``,
          },
          {
            name: '**»** Bot Instant Statistics',
            value:
              `**•** Servers: \`${totalGuilds} (${(yesterdayGuildCountDifference < 0 ? "" : "+") + yesterdayGuildCountDifference})\`\n` +
               `**•** Users: \`${totalMembers}\``,
          },
          {
            name: '**»** System Statistics',
            value:
              `**•** Uptime: \`${humanize(os.uptime() * 1000, { language: "en", round: true, largest: 2 })}\`\n` +
              //`**•** Available Memory: \`${((os.freemem() * (10 ** -6)) / 1024).toFixed(2)} GB\`\n` +
              //`**•** Memory Usage: \`${((os.totalmem() - os.freemem()) / (1024 ** 3)).toFixed(2)} GB/${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB (%${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100.toFixed())})\`\n`
          },
          {
            name: '**»** Errors (Log)',
            value:
              `**•** Detected Errors: \`${errorCount} (${averageErrorDifference == 0 ?
                "Equivalent to mean"
                : averageErrorDifference > 0 ?
                  `${averageErrorDifference} more than average ⚠️`
                  : `${Math.abs(averageErrorDifference)} less than average✅`
              })\``
            //`**•** Shard Crashes: \`${clientData.crash}\``
          },
          {
            name: '**»** Music System (Instant)',
            value:
              `**•** Available Audio Channels: \`${voiceChannels}\`\n` +
              `**•** Active Music Queues: \`${playerQueues}\``
          },
          {
            name: `**»** About Commands`,
            value:
              `**•** Number of Commands: \`${clientCommands.size}\`\n` +
              `**•** Slash Support Rate: \`%${(commandsInteractionSupport / clientCommands.size * 100).toFixed()}\`\n` +
              `**•** Classic Input Support Rate: \`%${((clientCommands.size - commandsInteractionOnly) / clientCommands.size * 100).toFixed()}\`\n` +
              `**•** Rate to Support Both: \`%${((commandsInteractionSupport - commandsInteractionOnly) / clientCommands.size * 100).toFixed()}\`\n\n` +

              `**•** __Vote (Vote) Required Commands__ \`(%${(commandsVoteRequired / clientCommands.size * 100).toFixed()})\`\n` +
              `**•** \`${clientCommands
                .filter(command => command.voteRequired)
                .map(command => (command.interaction || command).name)
                .map(command => command.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
                  return letter.toUpperCase();
                }))
                .join(', ')
              }\``
          },
          /*{
            name: '**»** Session Duration',
            value: `**•** \`${humanize(Date.now() - clientData.registeredAt, { language: "tr", round: true, largest: 2 })}\``,
          },*/
          {
            name: '**»** Ping & Uptime',
            value: `**•** \`/shard\``,
          },
        ],
      };

      //------------------------------Home page------------------------------//

      interaction.editReply({
        embeds: [mainPageEmbed],
        components: [
          {
            data: { type: 1 },
            components: [
              SupportServerButton,
              InvitationLinkButton,
              sponsorButon
            ]
          },
          {
            data: { type: 1 },
            components: [
              mainPageButton.setDisabled(true),
              usageStatsPageButton.setDisabled(false),
              healthCheckPageButton.setDisabled(false)
            ]
          },
        ]
      });

      const reply = await interaction.fetchReply();
      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === interaction.user.id;
      };

      const collector = reply.createMessageComponentCollector({ filter, time: 900000 });

      collector.on('collect', async btn => {

        switch (btn.customId) {
          case "mainPageButton":
            interaction.editReply({
              embeds: [mainPageEmbed],
              components: [
                {
                  data: { type: 1 },
                  components: [SupportServerButton, InvitationLinkButton, sponsorButon]
                },
                {
                  data: { type: 1 },
                  components: [
                    mainPageButton.setDisabled(true),
                    usageStatsPageButton.setDisabled(false),
                    healthCheckPageButton.setDisabled(false)
                  ]
                },
              ]
            });
            break;

          //------------------------------Usage/System Statistics------------------------------//
          case "usageStatsPageButton":

            //---------------Owner Only---------------//
            if (interaction.user.id !== client.settings.owner)
              return interaction.editReply({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    description: "🔒 This place is special for my brother Rauqq!"
                  }
                ],
                components: [
                  {
                    data: { type: 1 },
                    components: [SupportServerButton, InvitationLinkButton, sponsorButton]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(false),
                      usageStatsPageButton.setDisabled(true),
                      healthCheckPageButton.setDisabled(false)
                    ]
                  },
                ]
              });

            if (usageStatsPageEmbed) return interaction.editReply({
              embeds: [usageStatsPageEmbed],
              components: [
                {
                  data: { type: 1 },
                  components: [SupportServerButton, InvitationLinkButton, sponsorButon]
                },
                {
                  data: { type: 1 },
                  components: [
                    mainPageButton.setDisabled(false),
                    usageStatsPageButton.setDisabled(true),
                    healthCheckPageButton.setDisabled(false)
                  ]
                },
              ]
            }); else {
              await interaction.editReply({
                embeds: [{
                  color: client.settings.embedColors.default,
                  author: {
                    name: `${client.user.username} • Bot Information`,
                    icon_url: client.settings.icon,
                  },
                  title: `**»** Usage/System Statistics!`,
                  description: `**•** Please wait while the page is rendered...`,
                }],
                components: [
                  {
                    data: { type: 1 },
                    components: [SupportServerButton, InvitationLinkButton, sponsorButon]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(true),
                      usageStatsPageButton.setDisabled(true),
                      healthCheckPageButton.setDisabled(true)
                    ]
                  },
                ]
              });
            };

            //---------------System Usage Statistics---------------//
            let userDatas = await client.database.users.find().lean().exec(),
              guildDatas = await client.database.guilds.find().lean().exec();

            let linkBlock_guilds = 0,
              buttonRole_messages = 0,
              inviteManager_guilds = 0,
              gallery_channels = 0,
              tempChannels_guilds = 0,
              logger_guilds = 0,
              campaignNews_guilds = 0,
              autoReply_guilds = 0,
              autoRole_guilds = 0,
              memberCounter_guilds = 0,
              spamProtection_guilds = 0,
              upperCaseBlock_guilds = 0,
              warns_users = 0,
              warns_warns = 0,
              wordGame_guilds = 0,
              countingGame_guilds = 0,
              nameClearing_guilds = 0,
              boostedGuilds = 0,
              mentionSpamBlock_guilds = 0;

            for await (let guildData of guildDatas) {

              //Connection-Block
              if (guildData.linkBlock?.guild) linkBlock_guilds++;

              //Button-Role
              if (guildData.buttonRole && Object.keys(guildData.buttonRole)?.length)
                for await (let message of Object.keys(guildData.buttonRole)) {
                  buttonRole_messages++;
                }

              //Capital Blocking
              if (guildData.upperCaseBlock?.guild) upperCaseBlock_guilds++;

              //Invitation-System
              if (guildData.inviteManager?.channel && guildData.inviteManager.channel !== "false") inviteManager_guilds++;

              //Label Limitation
              if (guildData.mentionSpamBlock?.autoModerationRuleId) mentionSpamBlock_guilds++;

              //Nraphy-Powered Servers
              if (guildData.NraphyBoost?.users?.length) boostedGuilds++;

              //Name-Clear
              if (guildData.nameClearing) nameClearing_guilds++;

              //Counter
              if (guildData.memberCounter?.channel) memberCounter_guilds++;

              //Auto-Answer
              if (guildData.autoReply) autoReply_guilds++;

              //Campaign-News
              if (guildData.campaignNews) campaignNews_guilds++;

              //Gallery
              if (guildData.gallery) gallery_channels++;

              //Temporary Rooms
              if (guildData.tempChannels) tempChannels_guilds++;

              //Log
              if (guildData.logger?.webhook) logger_guilds++;

              //Auto-Role
              if (guildData.autoRole?.channel) autoRole_guilds++;

              //Spam Protection
              if (guildData.spamProtection?.guild) spamProtection_guilds++;

              //Warnings
              if (guildData.warns && Object.keys(guildData.warns)?.length)
                for await (let warnDataId of Object.keys(guildData.warns)) {
                  warns_users++;

                  let warnData = guildData.warns[warnDataId];
                  if (warnData.length) warns_warns += warnData.length;
                }

              //Word game
              if (guildData.wordGame?.channel) wordGame_guilds++;

              //Count-Counter
              if (guildData.countingGame?.channel) countingGame_guilds++;

            }

            await client.wait(1000);

            //sweepstakes
            var availableBetaGiveaways = await client.database.betaGiveaways.find().lean().exec()
              .then(g => g.filter(giveaway => !giveaway.isEnded));

            //---------------Commands Used---------------//
            let commandUses = {};

            for await (let day of lastDays) {
              let clientDatabyDate = await client.database.fetchClientData(day);

              for (var command in clientDatabyDate.commandUses) {

                //sortable.push({ command: command, uses: clientDatabyDate.commandUses[command] });
                commandUses[command] ?
                  commandUses[command] += clientDatabyDate.commandUses[command] :
                  commandUses[command] = clientDatabyDate.commandUses[command];
              }
            }

            let sortable = [];
            for (var command in commandUses) {
              sortable.push([command, commandUses[command]]);
            }

            sortable = sortable.sort(function (a, b) {
              return b[1] - a[1];
            }).slice(0, 20);

            let commandUsesList = await sortable.map(([commandName, uses]) => {
              return `**#${sortable.indexOf(sortable.find(qurve => qurve[0] == commandName)) + 1}** - **${client.capitalizeFirstLetter(commandName, "tr")}** • \`${new Intl.NumberFormat().format(uses >= 10 ? Math.floor(uses / 10) * 10 : uses)}+ Kullanım\``;
            });

            //---------------Other informations---------------//
            let yeniliklerinOkunması = 0,
              premiumUsers = 0;
            for await (let userData of userDatas) {
              if (userData.readDateOfChanges > client.settings.updateDate) yeniliklerinOkunması++;
              if (userData.NraphyPremium && (userData.NraphyPremium > Date.now())) premiumUsers++;
            }

            usageStatsPageEmbed = {
              color: client.settings.embedColors.default,
              author: {
                name: `${client.user.username} • Bot Information`,
                icon_url: client.settings.icon,
              },
              title: `**»** Usage/System Statistics!`,
              fields: [
                {
                  name: '**»** Commands Used (14 days)',
                  value:
                    commandUsesList/*.slice(0, 17)*/.join('\n').substring(0, 950),
                  //`Total Usage: \`${clientData.cmd + clientData.interactionCmd} (${clientData.interactionCmd} Interaction)\`\n` +,
                  inline: true
                },
                {
                  name: '**»** System Usage Statistics (Instant)',
                  value:
                    `**•** Connection Block: \`${linkBlock_guilds} Server\`\n` +
                    `**•** Button Role: \`${button Role messages} Message\`\n` +
                    `**•** Caps Block: \`${upperCaseBlock_guilds} Server\`\n` +
                    `**•** Sweepstakes: \`${availableBetaGiveaways.length} (Ongoing)\`\n` +
                    `**•** Invite System: \`${inviteManager_guilds} Server\`\n` +
                    `**•** Label Limitation: \`${mentionSpamBlock_guilds} Server\`\n` +
                    `**•** Gallery: \`${gallery_channels} Channel\`\n` +
                    `**•** Temporary Rooms: \`${tempChannels_guilds} Server\`\n` +
                    `**•** Name Clearing: \`${nameClearing_guilds} Server\`\n` +
                    `**•** Campaign News: \`${campaignNews_guilds} Server\`\n` +
                    `**•** Log: \`${logger_guilds} Server\`\n` +
                    `**•** Auto-Reply: \`${autoReply_guilds} Server\`\n` +
                    `**•** Auto-Role: \`${autoRole_guilds} Server\`\n` +
                    `**•** Counter: \`${memberCounter_guilds} Server\`\n` +
                    `**•** Spam Protection: \`${spam Protection guilds} Server\`\n` +
                    `**•** Warnings: \`${warns_users} User, ${warns_warns} Warning\`\n` +
                    `**•** Word Game: \`${wordGame_guilds} Server\`\n` +
                    `**•** Count Count: \`${countingGame_guilds} Server\``,
                  inline: true
                },
                {
                  name: '**»** Other informations',
                  value:
                    `**•** Update Published Date: <t:${(client.settings.updateDate / 1000).toFixed(0)}:f> - \`(${humanize(Date.now() - client.settings.updateDate, { language: "tr", round: true, largest: 1 })} before)\`\n` +
                    `**•** Users Reading What's New: \`${ReadingWhatsNew}\`\n` +
                    `**•** Nraphy Premium Users: \`${premiumUsers}\`\n` +
                    `**•** Nraphy-Powered Servers: \`${boostedGuilds}\``,
                },
              ],
            }
            interaction.editReply({
              embeds: [usageStatsPageEmbed],
              components: [
                {
                  data: { type: 1 },
                  components: [SupportServerButton, InvitationLinkButton, sponsorButon]
                },
                {
                  data: { type: 1 },
                  components: [
                    mainPageButton.setDisabled(false),
                    usageStatsPageButton.setDisabled(true),
                    healthCheckPageButton.setDisabled(false)
                  ]
                },
              ]
            });

            break;

          //------------------------------Usage/System Statistics------------------------------//
          case "healthCheckPageButton":

            //---------------Owner Only---------------//
            if (interaction.user.id !== client.settings.owner)
              return interaction.editReply({
                embeds: [
                  {
                    color: client.settings.embedColors.red,
                    description: "🔒 This place is special for my brother Rauqq!”
                  }
                ],
                components: [
                  {
                    data: { type: 1 },
                    components: [SupportServerButton, InvitationLinkButton, sponsorButon]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(false),
                      usageStatsPageButton.setDisabled(false),
                      healthCheckPageButton.setDisabled(true)
                    ]
                  },
                ]
              });

            (async () => {

              //TDK - Health Check
              let api_TDK = false;
              await axios.get(`https://sozluk.gov.tr/gts?ara=Merhaba`)
                .then(result => {
                  if (!result || !result.data || result.data.error) api_TDK = false; else api_TDK = true;
                }).catch(error => { api_TDK = false; });

              //The Cat API - Health Check
              let api_TCA = false;
              await axios.get(`https://api.thecatapi.com/v1/images/search`)
                .then(result => {
                  if (!result || !result.data || !result.data[0]?.url) api_TCA = false; else api_TCA = true;
                }).catch(error => { api_TCA = false; });

              //Status Check - Embed
              let healthCheckPageEmbed = {
                color: client.settings.embedColors.default,
                author: {
                  name: `${client.user.username} •Bot Information`,
                  icon_url: client.settings.icon,
                },
                title: `**»** Status Check!`,
                fields: [
                  {
                    name: '**»** API Status',
                    value:
                      `**•** TDK: ${api_TDK ? "✅" : "❌"}\n` +
                      `**•** The Cat API: ${api_TCA ? "✅" : "❌"}\n` +
                      `**•** Informatics: `
                  },
                  {
                    name: '**»** NekoBot API',
                    value:
                      `**•** 144p: \n` +
                      `**•** Captcha: \n` +
                      `**•** Magik: \n` +
                      `**•** Trump: \n` +
                      `**•** Tweet: \n` +
                      `**•** NSFW:`,
                  },
                  {
                    name: '**»** Database Status',
                    value:
                      `**•** MongoDB Atlas: \n` +
                      `**•** Log (Yerel): `
                  },
                  {
                    name: '**»** modules',
                    value:
                      `**•** songlyrics: \n` +
                      `**•** CBRT-currency: `
                  },
                ],
              };

              interaction.editReply({
                embeds: [healthCheckPageEmbed],
                components: [
                  {
                    data: { type: 1 },
                    components: [SupportServerButton, InvitationLinkButton, sponsorButton]
                  },
                  {
                    data: { type: 1 },
                    components: [
                      mainPageButton.setDisabled(false),
                      usageStatsPageButton.setDisabled(false),
                      healthCheckPageButton.setDisabled(true)
                    ]
                  },
                ]
              });

            })();

            break;

          default:
            client.logger.error("eror ckt on bot command");
        }

      });

    } catch (err) {

      client.logger.error(err);

      await interaction.editReply({
        content: "For reasons beyond my control, I could not retrieve the data :/",
        components: []
      });

    }

  }
};
