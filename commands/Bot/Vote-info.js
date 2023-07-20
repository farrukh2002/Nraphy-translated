module.exports = {
  interaction: {
    name: "vote-info",
    description: "It gives all the information about voting.",
    options: []
  },
  aliases: ["knowledge"],
  category: "Bot",
  memberPermissions: [],
  botPermissions: ["SendMessages", "EmbedLinks"],
  nsfw: false,
  cooldown: false,
  ownerOnly: false,

  async execute(client, interaction, data) {

    interaction.reply({
      embeds: [
        {
          color: client.settings.embedColors.default,
          title: '**»** Click here to go to the voting page!',
          url: "https://top.gg/bot/700959962452459550/vote",
          author: {
            name: `${client.user.username} • About Voting`,
            icon_url: client.settings.icon,
          },
          fields: [
            {
              name: '**»** How to Vote?',
              value: `**•** You can go to the bot's voting page by typing \`${data.prefix}vote\` or by clicking the blue text above, and you can vote by clicking the "vote" button there.`,
            },
            {
              name: '**»** I Voted But It Still Wants Me To Vote.',
              value: '**•** Votes are processed instantly into the system.  Make sure that the account you vote with is the same account you use the command.',
            },
            {
              name: '**»** Why is Vote Requested?',
              value: '**•** A helpful element for the bot to reach more audiences.',
            },
          ],
          /*timestamp: new Date(),
          footer: {
            text: `${(interaction.type == 2) ? interaction.user.username : interaction.author.username} tarafından istendi.`,
            icon_url: (interaction.type == 2) ? interaction.user.displayAvatarURL() : interaction.author.displayAvatarURL(),
          },*/
        }
      ],
    });

  }
};