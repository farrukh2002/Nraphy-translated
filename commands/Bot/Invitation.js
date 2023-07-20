const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "Invitation",
    description: "It gives a link so you can invite the bot to your server.",
    options: []
  },
  aliases: ['invitelink', 'invite-link', 'invite'],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks", "ReadMessageHistory"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    let InvitationLinkButton = new ButtonBuilder().setLabel('Invite Link').setURL(client.settings.invite).setStyle('Link');

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Click here to get the bot`s invite link!',
          url: client.settings.invite,
          author: {
            name: `${client.user.username} • Bot Invite Link`,
            icon_url: client.settings.icon,
          },
          timestamp: new Date(),
          footer: {
            text: ` requested by ${(interaction.type == 2) ? interaction.user.username : interaction.author.username}. `,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },
        }
      ],
      components: [
        {
          data: { type: 1 }, components: [
            InvitationLinkButton
          ]
        },
      ]
    });

  }
};
