const Discord = require("discord.js");
const { ButtonBuilder, WebhookClient } = require('discord.js');

module.exports = async (client, interaction, guildData) => {

  try {

    if (guildData.buttonRole[interaction.message.id].buttons[interaction.customId]) {

      var buttonRoleMessage = guildData.buttonRole[interaction.message.id];
      var buttonRoleButtonRoleId = guildData.buttonRole[interaction.message.id].buttons[interaction.customId].roleId;

      guildData.buttonRole[interaction.message.id].buttons[interaction.customId].clickAmount += 1;

      if (!interaction.guild.roles.cache.has(buttonRoleButtonRoleId)) {

        if (Object.keys(buttonRoleMessage.buttons).length == 1) {

          delete guildData.buttonRole[interaction.message.id];
          guildData.markModified('buttonRole');
          await guildData.save();

          await interaction.message.edit({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** Button-Role Reset Because Button-Role Role Could Not Be Found!',
                description: `**•** You can use \`/button-role\` command to set it up again.`
              }
            ],
            components: []
          });

          interaction.deferUpdate();

        } else {

          interaction.reply({
            embeds: [
              {
                color: client.settings.embedColors.red,
                title: '**»** You Cannot Use This Button Because The Button-Role Role Is Not Found!',
                description: `**•** Click a different button.  I will delete this button for you.`
              }
            ],
          });

        }

      } else if (interaction.guild.roles.cache.get(buttonRoleButtonRoleId).rawPosition >= interaction.guild.members.me.roles.highest.rawPosition) {

        client.logger.log(`A note is left on the button-role message because I do not have the authority to assign the button-role role... • ${interaction.guild.name} (${interaction.guild.id})`);

        await interaction.message.edit({
          embeds: [
            {
              color: client.settings.embedColors.red,
              title: '**»** I Cannot Cast the Button-Role Role!',
              description: `**•** I must have a role above ${interaction.guild.roles.cache.get(buttonRoleButtonRoleId)}!  After making the necessary adjustments, you can continue the system from where it left off by clicking the button below.`
            }
          ]
        });

        interaction.deferUpdate();

      } else {

        if (interaction.member.roles.cache.has(buttonRoleButtonRoleId)) {

          interaction.member.roles.remove(buttonRoleButtonRoleId);
          interaction.reply({ content: `<@&${buttonRoleButtonRoleId}> I got the role back!`, ephemeral: true });

        } else {

          interaction.member.roles.add(buttonRoleButtonRoleId);
          interaction.reply({ content: `<@&${buttonRoleButtonRoleId}> I gave the role!`, ephemeral: true });

        }

        let amountOfClicks = 0;
        for (let button in buttonRoleMessage.buttons) {
          let buttonData = buttonRoleMessage.buttons[button];
          amountOfClicks += buttonData.clickAmount;
        }
        let totalClicks = amountOfClicks >= 10 ?
          Math.floor(amountOfClicks / 10) * 10 + `+` :
          amountOfClicks;

        if (
          !buttonRoleMessage.lastUpdate?.date ||
          !buttonRoleMessage.lastUpdate.totalClicks ||
          ((Date.now() - buttonRoleMessage.lastUpdate.date > 10000) && (buttonRoleMessage.lastUpdate.totalClicks !== totalClicks))
        ) {

          let embed = {
            color: client.settings.embedColors.default,
            author: {
              name: `${client.user.username} • Button Role (Beta)`,
              icon_url: client.settings.icon,
            },
            /*fields: [
                {
                    name: '**»** Toplam Tıklama',
                    value: `**•** ${guildData.buttonRole[interaction.message.id].buttons[interaction.customId].clickAmount}`,
                    inline: true,
                },
            ],*/
            footer: {
              text: `Clicked a total of ${totalClicks} times.`,
              //icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
          };

          let messageRoles = [];
          let embedComponents = [];

          for (let button in buttonRoleMessage.buttons) {

            let buttonData = buttonRoleMessage.buttons[button];
            let buttonRole = await interaction.guild.roles.cache.get(buttonData.roleId);

            if (!buttonRole) {

              client.logger.error("role not found");

            } else {

              messageRoles.push(buttonRole.toString());

              embedComponents.push(new Discord.ButtonBuilder()
                .setLabel(`${buttonRole.name}`)
                .setCustomId(button.toString())
                .setStyle('Primary'));

            }

          }

          if (!messageRoles.length) {
            client.logger.error("no role in this message");
          }

          embed.description = embedComponents.length == 1 ?
            `**•** Click the button below to get the ${messageRoles[0]} role!` :
             `**•** Click the buttons below to get one of the ${messageRoles.join(', ')} roles!`;

          if (buttonRoleMessage.title) embed.title = `**»** ${buttonRoleMessage.title}`;

          interaction.message.edit({
            content: null,
            embeds: [embed],
            components: [
              {
                type: 1, components: embedComponents
              },
            ]
          });

          guildData.buttonRole[interaction.message.id].lastUpdate = {
            date: Date.now(),
            totalClicks: totalClicks
          };
          guildData.buttonRole[interaction.message.id].lastClicker = interaction.user.id;
          if (!buttonRoleMessage.channelId) guildData.buttonRole[interaction.message.id].channelId = interaction.channel.id;

        }

        guildData.markModified(`buttonRole.${interaction.message.id}`);
        await guildData.save();

      }
    }

  } catch (err) { client.logger.error(err); };
};
