const humanize = require("humanize-duration");

module.exports.removeAFK = async (client, message, userData) => {

  if (userData?.AFK?.time) {
    const { time, reason } = userData.AFK;

    let process = Date.now() - time;

    if (process > 1000) {

      let zaman = humanize(process, { language: "en", round: true, conjunction: ", ", serialComma: false });

      if (message.member.moderatable) message.member.setNickname(message.member.displayName.replace("[AFK]", ""), ["Nraphy AFK System"]);

      message.reply({
        embeds: [
          {
            color: client.settings.embedColors.default,
            author: {
              name: `${message.author.username}, not AFK anymore!`,
              icon_url: message.author.avatarURL(),
            },
            fields: [
              {
                name: '**»** Reason for AFK',
                value: `**•** ${reason}`,
              },
              {
                name: '**»** Time to AFK',
                value: `**•** ${time}`,
              },
            ],
          }
        ]
      });

      userData.AFK = undefined;
      await userData.save();
    }
  }

};

module.exports.userIsAFK = async (client, message, userData) => {

  const { time, reason } = userData.AFK;

  let user = message.mentions.users.first();

  message.reply({
    embeds: [
      {
        color: client.settings.embedColors.red,
        author: {
          name: `${user.username} user is now AFK!`,
          icon_url: user.avatarURL(),
        },
        fields: [
          {
            name: '**»** Reason for AFK',
            value: `**•** ${reason}`,
          },
          {
            name: '**»** Time to AFK',
            value: `**•** ${humanize(Date.now() - time, { language: "en", round: true, conjunction: ", ", serialComma: false })}`,
          },
        ],
      }
    ]
  }).then(msg => setTimeout(() => msg.delete(), 5000));

};
