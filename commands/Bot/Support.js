const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "support",
    description: "Gives you a link to our support server.",
    options: []
  },
  aliases: [],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    let SupportServerButton = new ButtonBuilder().setLabel('Support Server').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link');

    interaction.reply({
      content: `<https://discord.gg/QvaDHvuYVm>`,
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Click here to reach our support server!',
          url: "https://discord.gg/QvaDHvuYVm",
          author: {
            name: `${client.user.username} • Bot Support Server Connection`,
            icon_url: client.settings.icon,
          },
          timestamp: new Date(),
          footer: {
            text: `Requested by ${(interaction.type == 2) ? interaction.user.username : interaction.author.username}.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },
        }
      ],
      components: [
        {
          data: { type: 1 }, components: [
            destekSunucusuButon
          ]
        },
      ]
    });

  }
};