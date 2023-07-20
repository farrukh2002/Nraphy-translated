const { ButtonBuilder } = require('discord.js');

module.exports = {

  buttonConfirmation: async function (interaction, confirmationEmbeds, confirmatoryUserId = null) {

    const confirmButton = new ButtonBuilder().setLabel('Approve').setCustomId("confirmButton").setStyle('Success');
    const denyButton = new ButtonBuilder().setLabel('Cancel').setCustomId("denyButton").setStyle('Danger');

    const reply = await interaction.reply({
      embeds: confirmationEmbeds,
      components: [
        {
          type: 1, components: [
            confirmButton, denyButton
          ]
        }
      ]
    });

    if (interaction.type === 0) {

      const filter = i => {
        return i.message.id === reply.id && i.deferUpdate() && i.user.id === (confirmatoryUserId || interaction.author.id);
      };

      return reply.awaitMessageComponent({ filter, time: 180000 })
        .then(btn => {
          if (btn.customId === "confirmButton") return { reply, status: true };
          else if (btn.customId === "denyButton") return { reply, status: false };
        })
        .catch(err => {

          return { reply, status: false };

          /*interaction.editReply({
              embeds: [
                  {
                      color: client.settings.embedColors.red,
                      description: "**»** Herhangi bir seçim yapılmadığı için işlem iptal edildi."
                  }
              ],
              components: []
          })*/

        });

    } else if (interaction.type === 2) {

      const replyMessage = await interaction.fetchReply();
      const filter = i => {
        return i.message.id === replyMessage.id && i.deferUpdate() && i.user.id === (confirmatoryUserId || interaction.user.id);
      };

      return replyMessage.awaitMessageComponent({ filter, time: 180000 })
        .then(btn => btn.customId === "confirmButton" ? true : btn.customId === "denyButton" && false)
        .catch(err => {

          return false;

          /*interaction.editReply({
              embeds: [
                  {
                      color: client.settings.embedColors.red,
                      description: "**»** Herhangi bir seçim yapılmadığı için işlem iptal edildi."
                  }
              ],
              components: []
          })*/

        });

    }

  },

  getLastDays: async function (days) {

    let dates = [];

    let dateNow = new Date();
    let dateNowString = `${dateNow.getDate()}.${(dateNow.getMonth() + 1)}.${dateNow.getFullYear()}`;

    for (let i = 0; i < days; i++) {
      let dateParts = dateNowString.split(".");
      var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

      let newDate = new Date(dateObject);
      let newDateString = `${newDate.getDate()}.${(newDate.getMonth() + 1)}.${newDate.getFullYear()}`;
      dates.push(newDateString);

      let newUpdateDate = new Date(dateObject.setDate(dateObject.getDate() - 1));
      dateNowString = `${newUpdateDate.getDate()}.${(newUpdateDate.getMonth() + 1)}.${newUpdateDate.getFullYear()}`;

    }

    return dates;

  },

  messageChecker: function (interaction, message = '', example = '') {

    if (!message || message.length < 1) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** You Must Specify a Message!',
            description: `**»** Example usage: \`/${example}\``,
          }
        ]
      });
      return false;
    }

    if (message.length > 180) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** You have Made a Very Long Post!',
            description: `**•** Your message must be shorter than **180** characters.`
          }
        ]
      });
      return false;
    }

    if (message.toLowerCase().includes('discord.gg')) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** You Can not Advertise With This Command!',
            description: `**•** Your message must not contain any Discord server invite links.`
          }
        ]
      });
      return false;
    }

    if (message.includes('@here') || message.includes('@everyone')) {
      interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** You Can not Throw **@everyone and @here** With This Command!',
            description: `**•** Your message should not contain any bulk tags.`
          }
        ]
      });
      return false;
    }

    return true;
  },

  roleChecker: async function (interaction, role) {

    if (!role?.id || !role?.guild) {
      role = await interaction.guild.roles.cache.get(role);
      if (!role?.id || !role?.guild) {
        return interaction.reply({
          embeds: [
            {
              color: interaction.client.settings.embedColors.red,
              title: '**»** Could not Find The Role!',
              description: `**•** You must specify a valid role ID.`
            }
          ]
        });
      }
    }

    if (role.rawPosition >= interaction.guild.members.me.roles.highest.rawPosition)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** I do not have the authority to give the role you specified!',
            description: `**•** I must have a role above this role.`
          }
        ]
      });

    if (role.id == interaction.guild.id)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** @everyone?!',
            description: `**•** What?`
          }
        ]
      });

    if (role.tags?.botId)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»**You Can not Choose This Role!',
            description: `**•** I do not allow.  And I can not give this role.`
          }
        ]
      });

    if (role.tags?.premiumSubscriberRole)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Booster Role?',
            description: `**•** So the button clicker will be the booster?  I can not be.  Huh!`
          }
        ]
      });

    return;
  },

  channelChecker: async function (interaction, channel, permissions, supportsChannelTypeFive = true) {

    const permissionsMap = require("../utils/Permissions.json");

    /*if (!channel)
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** Geçerli Bir Kanal Belirtmelisin!',
            description: `**•** Örnek kullanım: \`${data.prefix}kelime-oyunu #kelime-oyunu\``
          }
        ]
      });*/

    if (!interaction.guild.channels.cache.has(channel.id))
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: '**»** You can not tag a channel that is not on this server!',
            description: `**•** Don't do it.  Don't do that.  I say I don't like these jokes.  Huh.`
          }
        ]
      });

    if (channel.type != 0 && (!supportsChannelTypeFive || channel.type != 5))
      return interaction.reply({
        embeds: [
          {
            color: interaction.client.settings.embedColors.red,
            title: `**»** You Must Specify a Valid Channel!`,
            description: `**•** The channel you specified should not be a room or category.  Text channel only.`,
          }
        ],
      });

    for await (let permission of permissions) {
      if (!channel.permissionsFor(interaction.guild.members.me).has(permission)) {
        return interaction.reply({
          embeds: [
            {
              color: interaction.client.settings.embedColors.red,
              title: `**»** **${permissionsMap[permission]}** I Do not Have Authority on the Channel You Tagged!`,
              description: `**•** Check my permissions and try again.`
            }
          ]
        });
      }
    }

    return false;

  },

};
