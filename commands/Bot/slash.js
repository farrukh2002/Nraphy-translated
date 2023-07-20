const { ButtonBuilder } = require('discord.js');

module.exports = {
  interaction: {
    name: "slash",
    description: "It gives information about why switching to slash commands.",
    options: []
  },
  aliases: ["slash-info", "slashinfo"],
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
          author: {
            name: `${client.user.username} • Slash Commands`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** What is Slash Command?',
              value:
                `**•** Normally you would use it like \`${data.prefix}commands\` when using a command.\n` +
                `**•** However, in slash commands, you need to type \`/commands\` and select the command separately from there.`
            },
            {
              name: '**»** Why Switching to Slash Commands?',
              value:
                `**•** Discord forcing bots to switch to slash commands for optimization.\n` +
                `**•** In addition, all command settings can be performed simply from the server settings.`
            },
            {
              name: '**»** How to Use Slash Commands',
              value:
                `**•** Put \`/\` in any channel and choose the command you want to use.\n` +
                 `**•** Other command options will appear automatically.`
            },
            {
              name: '**»** I am Having Problems Using Slash Command',
              value:
                `**•** You may not be authorized to use slash command on the relevant server.\n` +
                `**•** Or you may not have selected the command you want to use (the most common mistake).`
            },
          ],
          /*timestamp: new Date(),
          footer: {
            text: `${(interaction.type == 2) ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },*/
        }
      ],
      components: [
        {
          data: { type: 1 }, components: [
            new ButtonBuilder().setLabel('Support Server').setURL(`https://discord.gg/QvaDHvuYVm`).setStyle('Link')
          ]
        },
      ]
    });

  }
};
