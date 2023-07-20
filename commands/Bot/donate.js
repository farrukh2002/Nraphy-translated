const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "donate",
    description: "It helps the bot developer to cater to you.",
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

    return interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Good luck brother!  💖',
          description: '**•** Well, there is no need, just think 😇',
        }
      ],
      components: [
        {
          data: { type: 1 }, components: [
            new ButtonBuilder().setLabel('Destek Sunucusu').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
          ]
        },
      ]
    });

  }
};
