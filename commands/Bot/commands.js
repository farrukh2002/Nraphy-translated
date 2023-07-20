const Discord = require("discord.js");

module.exports = {
  interaction: {
    name: "commands",
    description: "Lists all commands with their categories.",
    options: [
      {
        name: "command",
        description: "Returns information about the command you specified.",
        type: 3,
        required: false
      },
    ]
  },
  aliases: ['h', 'help', 'y', 'commands', 'cmds'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,

  async execute(client, interaction, data, args) {

    //------------------------------COMMAND INFORMATION------------------------------//

    let commandArgs = interaction.type === 2 ? interaction.options.getString("command") : args.slice(0).join(" ");

    if (commandArgs) {

      let selectedCmd = client.commands.filter(command => command.category && command.category !== "Developer")
        .find(cmd => (cmd.interaction || cmd).name === commandArgs || cmd.aliases.includes(commandArgs));

      if (selectedCmd) {

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.default,
              //title: '**»** Click here to get the bot's invite link!',
              author: {
                name: `${client.user.username} • Command Info`,
                icon_url: client.settings.icon,
              },
              fields: [
                {
                  name: '**»** command',
                  value: `**•** ${client.capitalizeFirstLetter(selectedCmd.interaction ? selectedCmd.interaction.name : selectedCmd.name, "en")}`,
                },
                {
                  name: '**»** Explanation',
                  value: `**•** ${selectedCmd.interaction ? selectedCmd.interaction.description : selectedCmd.description}`,
                },
                {
                  name: '**»** Category',
                  value: `**•** ${selectedCmd.category}`,
                },
              ],
            }
          ],
        });

      } else {

        return interaction.reply({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: "**»** Command Not Found!",
              description: `**•** You can type \`/commands\` to see all commands.`
            }
          ],
        });

      }

    }

    //------------------------------COMMAND INFORMATION------------------------------//

    //------------------------------Back End------------------------------//

    //Authorized Commands - Back End
    let embedModeration = { fields: [] };
    let commandsModeration = [];
    await client.commands.forEach(command => {
      if (command.category == 'Moderation') {
        if (!command.interaction) {
          commandsModeration.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsModeration.push(`**•** \`${command.interaction.name}\` - (APPLICATION)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            let options = [];
            command.interaction.options.forEach(subCommand => {
              options.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\``);
            });
            //embedModeration.fields.push(`**»** ${client.capitalizeFirstLetter(command.interaction.name, "tr")}`, options.join('\n'), true);
            embedModeration.fields.push({
              name:
                `**»** ${command.interaction.name.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
                  return letter.toUpperCase();
                })}`,
              value: options.join('\n'),
              inline: true
            });
          } else {
            commandsModeration.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });
    embedModeration.fields = embedModeration.fields.sort(function (a, b) { return b.value.split(/\r\n|\r|\n/).length - a.value.split(/\r\n|\r|\n/).length; });

    //Eğlence Komutları - Back End
    let commandsFun = [];
    client.commands.forEach(command => {
      if (command.category == 'Fun') {
        if (!command.interaction) {
          commandsFun.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsFun.push(`**•** \`${command.interaction.name}\` - (APPLICATION)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsFun.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsFun.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //General Commands - Back End
    let commandsGeneral = [];
    client.commands.forEach(command => {
      if (command.category == 'General') {
        if (!command.interaction) {
          commandsGeneral.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGeneral.push(`**•** \`${command.interaction.name}\` - (APPLICATION)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsGeneral.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsGeneral.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //Games - Back End
    let embedGames = { fields: [] };
    let commandsGames = [];
    await client.commands.forEach(command => {
      if (command.category == 'Games') {
        if (!command.interaction) {
          commandsGames.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGames.push(`**•** \`${command.interaction.name}\` - (APPLICATION)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            let options = [];
            command.interaction.options.forEach(subCommand => {
              options.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\``);
            });
            //embedGames.fields.push(`**»** ${client.capitalizeFirstLetter(command.interaction.name, "tr")}`, options.join('\n'), true);
            embedGames.fields.push({
              name:
                `**»** ${command.interaction.name.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
                  return letter.toUpperCase();
                })}`,
              value: options.join('\n'),
              inline: true
            });
          } else {
            commandsGames.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });
    /*let commandsGames = [];
    client.commands.forEach(command => {
      if (command.category == 'Games') {
        if (!command.interaction) {
          commandsGames.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsGames.push(`**•** \`${command.interaction.name}\` - (Uygulama)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0]?.type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsGames.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsGames.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });*/

    //Bot Related Commands - Back End
    let commandsBot = [];
    client.commands.forEach(command => {
      if (command.category == 'Bot') {
        if (!command.interaction) {
          commandsBot.push(`**•** \`${data.prefix}${command.name}\` - ${command.description}\n`);
        } else {
          if (command.interaction.type && command.interaction.type == 3) {
            commandsBot.push(`**•** \`${command.interaction.name}\` - (APPLICATION)\n`);
          } else if ((command.interaction.options && command.interaction.options.length > 0) && (command.interaction.options[0].type == 1 || command.interaction.options[0].type == 2)) {
            command.interaction.options.forEach(subCommand => {
              commandsBot.push(`**•** \`/${command.interaction.name + " " + subCommand.name}\` - ${subCommand.description}\n`);
            });
          } else {
            commandsBot.push(`**•** \`/${command.interaction.name}\` - ${command.interaction.description}\n`);
          }
        }
      }
    });

    //------------------------------Back End------------------------------//

    //------------------------------Embeds------------------------------//

    let fieldsLinks = {
      name: '**»** Links',
      value: `**•** [Support Server](https://discord.gg/VppTU9h) • [Invite Link](${client.settings.invite})`,
      inline: false
    };

    //Authorized Commands - Embed
    embedModeration.color = client.settings.embedColors.default;
    embedModeration.author = {
      name: `${client.user.username} • Authorized Commands`,
      icon_url: client.settings.icon,
    };
    embedModeration.title = `You can type \`/commands <Command>\` to get information about a command.`;
    embedModeration.description = commandsModeration.join('');
    embedModeration.fields.push(fieldsLinks);
    embedModeration.fields.unshift({
      name: '**»** Message Filtering Systems',
      value:
        `**•** These commands have been moved to a different page.\n` +
        `**•** \`Connection Block, Caps Block, Spam Protection\``,
      inline: false
    });

    //Message Filtering Systems - Embed
    let embedMessageFilters = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Message Filtering Systems`,
        icon_url: client.settings.icon,
      },
      title: `You can type \`/commands <Command>\` to get information about a command.`,
      //description: "31",
      fields: [
        ...(client.commands.filter(command => command.category === "MessageFilters").map(command => ({
          name: `**»** ${command.interaction.name.replace(/-/g, " ").toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function (letter) {
            return letter.toUpperCase();
          })}`,
          value:
            `**•** ${command.interaction.description}\n` +
            command.interaction.options.map(option => `**•** \`/${command.interaction.name} ${option.name}\``).join('\n'),
          inline: false
        }))),
        fieldsLinks
      ],
    };

    //Fun Commands - Embed
    let embedFun = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Entertainment Commands`,
        icon_url: client.settings.icon,
      },
      title: `You can type \`/commands <Command>\` to get information about a command.`,
      description: commandsFun.join(''),
      fields: [fieldsLinks],
    };

    //General Commands - Embed
    let embedGeneral = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • General Commands`,
        icon_url: client.settings.icon,
      },
      title: `You can type \`/commands <Command>\` to get information about a command.`,
      description: commandsGeneral.join(''),
      fields: [fieldsLinks],
    };

    //Games - Embed
    embedGames.color = client.settings.embedColors.default;
    embedGames.author = {
      name: `${client.user.username} • Games`,
      icon_url: client.settings.icon,
    };
    embedGames.title = `You can type \`/commands <Command>\` to get information about a command.`;
    embedGames.description = commandsGames.join('');
    embedGames.fields.push(fieldsLinks);
    /*let embedGames = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Oyunlar`,
        icon_url: client.settings.icon,
      },
      title: `Bir komut hakkında bilgi almak için \`/komutlar <Komut>\` yazabilirsiniz.`,
      description: commandsGames.join(''),
      fields: [fieldsLinks],
    };*/

    //Music Commands
    let embedMusic = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Music Commands`,
        icon_url: client.settings.icon,
      },
      title: `You can type \`/commands <Command>\` to get information about a command.`,
      /*description: client.commands
        .filter(command => command.category == 'Music')
        .sort((a, b) => {
          console.log(a);
          if (a.interaction.name === "çal" || a.interaction.name === "ara") return -1;
          //if (a < b) return -1;
          //return 0;
        })
        .map(command => `**•** \`/${command.interaction.name}\` - ${command.interaction.description}`
          + (command.interaction.name === "ara" ? '\n' : ''))
        .join('\n'),*/
      fields: [
        {
          name: '**»** Song Start',
          value:
            client.commands
              .filter(command => command.category == 'Music_Player')
              .map(command => `**•** \`/${command.interaction.name}\` - ${command.interaction.description}`)
              .join('\n'),
          inline: false
        },
        {
          name: '**»** Player Functions',
          value:
            [
              {
                interaction: { name: "stop - /execute", description: "Pause/resume playing song.", },
                category: "Music"
              },
              ...Array.from(client.commands.filter(command => command.category == 'Music' && !['stop', 'execute'].includes(command.interaction.name)), ([key, value]) => (value))
            ]
              .map(command => `**•** \`/${command.interaction.name}\` - ${command.interaction.description}`)
              .sort()
              .join('\n'),
          inline: false
        },
        fieldsLinks],
    };

    //Bot Related Commands - Embed
    let embedBot = {
      color: client.settings.embedColors.default,
      author: {
        name: `${client.user.username} • Bot Related Commands`,
        icon_url: client.settings.icon,
      },
      title: `You can type \`/commands <Command>\` to get information about a command.`,
      description: commandsBot.join(''),
      fields: [fieldsLinks],
    };

    //Home - Embed
    const embedMainPage = {
      color: client.settings.embedColors.default,
      title: `You can type \`/commands <Command>\` to get information about a command.`,
      author: {
        name: `${client.user.username} • commands`,
        icon_url: client.settings.icon
      },
      description:
        `You can access the commands of the category you want from the menu below.\n\n` +

        `📚 • Home page\n\n` +

        `📘 • Authorized Commands (**${commandsModeration.length + embedModeration.fields.length - 2}**)\n` +
        `🛡️ Message Filtering Systems (**${embedMessageFilters.fields.length - 1}**)\n` +
        `📙 • Entertainment Commands (**${commandsFun.length}**)\n` +
        `📗 • General Commands (**${commandsGeneral.length}**)\n` +
        `📕 • Games (**${commandsGames.length + embedGames.fields.length - 1}**)\n` +
        `🎵 • Music Commands (**${client.commands.filter(command => command.category?.startsWith('Music')).size}**)\n` +
        `🤖 • Bot Related Commands (**${commandsBot.length}**)\n\n` +

        `For bug reporting or suggestions: \`/notice\`\n` +
        `This bot was created by [Nraphy Open Source Project](https://discord.gg/VppTU9h).`
        /*`${(data.user.readDateOfChanges < client.settings.updateDate) ?
          `✉️ Okunmamış yenilikler mevcut! \`/yenilikler\` yazarak okuyabilirsin!` :
          `Gelişmelerden haberdar olmak için destek sunucumuza katılabilirsiniz!`}`*/,
      fields: [fieldsLinks],
    };

    //Row
    const row = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Here you can select a category')
          .addOptions([
            {
              label: 'Home page',
              emoji: '📚',
              description: 'The page listing the categories of commands.',
              value: 'mainPageOption',
            },
            {
              label: 'Authorized Commands',
              emoji: '📘',
              description: 'Administrative commands related to the server.',
              value: 'moderationOption',
            },
            {
              label: 'Message Filtering Systems',
              //emoji: '📘',
              description: '᲼᲼᲼Link Block, Spam Protection, etc.',
              value: 'messageFiltersOption',
            },
            {
              label: 'Entertainment Commands',
              emoji: '📙',
              description: 'Fun commands like Humor, Love-Meter, Speak, 144p.',
              value: 'funOption',
            },
            {
              label: 'General Commands',
              emoji: '📗',
              description: 'Commands that may be useful to you.',
              value: 'generalOption',
            },
            {
              label: 'Games',
              emoji: '📕',
              description: 'Games like Duel, XOX, Coin Flip, Word Competition.',
              value: 'gamesOption',
            },
            {
              label: 'Music Commands',
              emoji: '🎵',
              //description: 'Müzik çalmanıza yarayan komutlar.',
              value: 'musicOption',
            },
            {
              label: 'Bot Commands',
              emoji: '🤖',
              description: 'Nraphy related commands.',
              value: 'botOption',
            },
          ])
      );

    //------------------------------Embeds------------------------------//

    //------------------------------Sending Embed & Select Menu------------------------------//

    interaction.reply({
      embeds: [embedMainPage],
      components: [row]
    }).then(async msg => {

      const embedMaps = {
        "mainPageOption": embedMainPage,
        "moderationOption": embedModeration,
        "messageFiltersOption": embedMessageFilters,
        "funOption": embedFun,
        "generalOption": embedGeneral,
        "gamesOption": embedGames,
        "botOption": embedBot,
        "musicOption": embedMusic,
      };

      const reply = interaction.type === 2 ? await interaction.fetchReply() : msg;
      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === (interaction.type === 2 ? interaction.user : interaction.author).id;
      };

      var calc = (interaction.type === 2 ? interaction.channel : msg).createMessageComponentCollector({ filter, time: 1800000 });

      calc.on('collect', async int => {

        let collectedOption = row.components[0].options.find(selectMenuOption => selectMenuOption.data.value == int.values.toString());
        row.components[0].setPlaceholder(`${collectedOption.data.emoji?.name || "📘"} ${collectedOption.data.label.replaceAll("᲼", '')}`);

        if (interaction.type === 2) {
          interaction.editReply({ embeds: [embedMaps[int.values.toString()]], components: [row] });
          //.catch(e => { });
        } else {
          msg.edit({ embeds: [embedMaps[int.values.toString()]], components: [row] });
          //.catch(e => { });
        }

      });

    });

  }
};
