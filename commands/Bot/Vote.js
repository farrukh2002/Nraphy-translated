const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "vote-vote",
    description: "It gives you a link to vote on TOP.GG.",
    options: []
  },
  aliases: ['vote', 'vote-voteme-link', 'votelink'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    let voteButon = new ButtonBuilder().setLabel('Vote Link (TOP.GG)').setURL("https://top.gg/bot/700959962452459550/vote").setStyle('Link');

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Click here to vote for Nraphy on TOP.GG!',
          url: "https://top.gg/bot/700959962452459550/vote",
          author: {
            name: `${client.user.username} • Vote (Vote)`,
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
            voteButon
          ]
        },
      ]
    });

  }
};