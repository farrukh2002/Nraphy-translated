const { WebhookClient, ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "statement",
    description: "It allows you to make notifications (Errors, suggestions, complaints, etc.) about the bot.",
    options: [
      {
        name: "statement",
        description: "Specify the content of your statement.",
        type: 3,
        required: true
      },
      {
        name: "file",
        description: "Attach a file to the manifest (Optional).",
        type: 11,
        required: false
      },
    ]
  },
  interactionOnly: true,
  aliases: ["suggest", 'report', 'bug', 'complaint', 'suggestion'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: 10000,
  ownerOnly: false,

  async execute(client, interaction, data) {

    var suggestion = interaction.options.getString("statement");
    var file = interaction.options.getAttachment("file");

    if (suggestion.length < 1) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** You must specify a Statement (Suggestion, Bug, Complaint, etc.)!',
            description: `**•** Example usage: \`${data.prefix}notify <Message>\``
          }
        ]
      });
    }

    if (suggestion.length > 1000) {
      return interaction.reply({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Your Notice Message Should not Exceed 1000 Characters!',
            description: `**•** Your message contains **${suggestion.length - 1000}** extra characters.`
          }
        ]
      });
    }

    const { buttonConfirmation } = require("../../modules/Functions");
    if (!await buttonConfirmation(interaction, [
      {
        color: client.settings.embedColors.default,
        title: '**»** Do You Approve Submission of Notice to My Support Server?',
        description: `**•** It is transmitted publicly along with your profile and ID.`
      }
    ])) return interaction.editReply({
      embeds: [
        {
          color: client.settings.embedColors.red,
          title: '**»** I Canceled the Post!',
          description: `**•** So I canceled it.  If you weren't going to send it, why did you write it?`
        }
      ],
      components: []
    }).catch(error => { });

    let webhookClient = new WebhookClient({ url: client.config.clientLogsWebhookURL });

    const embed = {
      color: client.settings.embedColors.default,
      author: {
        name: `${interaction.user.tag} Made a Statement!`,
        icon_url: interaction.user.displayAvatarURL(),
      },
      fields: [
        {
          name: '**»** 'Notice',
          value: "```" + suggestion + "```",
        },
      ],
      timestamp: new Date(),
      footer: {
        text: `ID: ${interaction.user.id}`,
        icon_url: client.settings.icon,
      },
    };

    if (file) {
      if (file.name.endsWith(".jpg") || file.name.endsWith(".png"))
        embed.image = {
          url: file.url,
        };
      else embed.fields.push(
        {
          name: '**»** File',
          value: `**•** [${file.name}](${file.url})`,
        }
      );
    }

    webhookClient/*client.guilds.cache.get(guildID).channels.cache.get(channelID)*/.send({ embeds: [embed] });
    //.then(mesaj => { mesaj.react('👍').then(mesaj.react('👎')) });

    if (interaction.guildId == "532991144112554005") {
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Thanks For Reporting!',
            description: `**•** If you want to see our response to the notification, you can check the <#716503010301444197> channel.👻`,
            image: {
              url: "https://media.discordapp.net/attachments/716503010301444197/1039857246705819658/Screenshot_20221109-140109_Twitter.jpg"
            }
          }
        ],
        components: []
      });

    } else {
      return interaction.editReply({
        embeds: [
          {
            color: client.settings.embedColors.green,
            title: '**»** Thanks For Reporting!',
            description: `**•** If you want to see our response to the notification, you can join our [support server](https://discord.gg/VppTU9h).👻`,
            image: {
              url: "https://media.discordapp.net/attachments/716503010301444197/1039857246705819658/Screenshot_20221109-140109_Twitter.jpg"
            }
          }
        ],
        components: [
          {
            data: { type: 1 }, components: [
              new ButtonBuilder().setLabel('Support Server').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Lin
