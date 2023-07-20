const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, autoRole, guildData) => {

  try {

    //---------------Role---------------//

    if (!member.guild.roles.cache.has(autoRole.role)) {

      client.logger.log(`Auto-Role not found, resetting auto-role on server... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole = { role: null, channel: null, setupChannel: null };
      guildData.markModified('autoRole');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Auto-Role Reset Because No Auto-Role Role Found!',
            description: `**•** You can use the \`/set-role\` command to set it up again.`
          }
        ]
      });

    }

    if (member.guild.roles.cache.get(autoRole.role).rawPosition >= member.guild.members.me.roles.highest.rawPosition) {

      client.logger.log(`Auto-role is reset on the server because I don't have permission to assign the auto-role... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole = { role: null, channel: null, setupChannel: null };
      guildData.markModified('autoRole');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Auto-Role Reset Because No Authorization Could Be Found to Grant Auto-Role!',
            description: `**•** You can use the \`/set-role\` command to set it up again.`
          }
        ]
      });

    }

    await member.roles.add(autoRole.role);

    //---------------Role---------------//

    //---------------Channel---------------//

    if (!autoRole.channel) return;

    if (!member.guild.channels.cache.has(autoRole.channel)) {

      client.logger.log(`Auto-role channel not found, resetting auto-role channel on server... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole.channel = null;
      guildData.markModified('autoRole.channel');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Auto-Role Channel Reset Because Auto-Role Channel Could Not Be Found!',
            description: `**•** You can use \`/auto-role Set Channel\` command to set it up again.`
          }
        ]
      });

    }

    let clientPerms = [];
    ["ViewChannel", "SendMessages", "EmbedLinks"].forEach((perm) => {
      if (!member.guild.channels.cache.get(autoRole.channel).permissionsFor(member.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`Auto-Role channel is reset because I don't have one/more privileges on the Auto-Role channel... • ${member.guild.name} (${member.guild.id})`);
      guildData.autoRole.channel = null;
      guildData.markModified('autoRole');
      await guildData.save();

      return member.guild.channels.cache.get(autoRole.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `I Don't Have The Permissions To Post To The Auto-Role Channel!`,
            icon_url: member.guild.iconURL(),
          },
          description: `**»** I reset the autorole channel because I don't have enough privileges on ${member.guild.channels.cache.get(autoRole.channel)}.`,
          fields: [
            {
              name: '**»** Permissions I Need;',
              value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
            },
          ]
        }]
      });

    }

    member.guild.channels.cache.get(autoRole.channel).send({
      embeds: [{
        color: client.settings.embedColors.default,
        author: {
          name: `${member.user.username} has joined the server!`,
          icon_url: member.user.avatarURL(),
        },
        description: `**»** Welcome!  I automatically assigned the <@&${autoRole.role}> role.`,
      }]
    });



    //---------------Channel---------------//

  } catch (err) { client.logger.error(err); };
};
