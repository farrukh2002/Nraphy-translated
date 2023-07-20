const permissions = require("../../utils/Permissions.json");

module.exports = async (client, member, inviteManager, guildData) => {

  try {

    if (!member.guild.channels.cache.has(inviteManager.channel)) {

      client.logger.log(`No invite channel found, resetting the invite system on the server... • ${member.guild.name} (${member.guild.id})`);
      guildData.inviteManager = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(inviteManager.setupChannel)?.send({
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** Invite System Reset Because Invite Channel Could Not Be Found!',
            description: `**•** You can use the command \`/invite-system\` to set it up again.`
          }
        ]
      });

    }

    let clientPerms = [];
    ["ViewChannel", "SendMessages", "EmbedLinks"].forEach((perm) => {
      if (!member.guild.channels.cache.get(inviteManager.channel).permissionsFor(member.guild.members.me).has(perm)) {
        clientPerms.push(permissions[perm]);
      }
    });

    if (clientPerms.length > 0) {

      client.logger.log(`The invite system is reset because I don't have one/several privileges in the invite channel... • ${member.guild.name} (${member.guild.id})`);
      guildData.inviteManager = undefined;
      await guildData.save();

      return member.guild.channels.cache.get(inviteManager.setupChannel)?.send({
        embeds: [{
          color: client.settings.embedColors.red,
          author: {
            name: `I Don't Have the Permissions to Run the Invite System!`,
            icon_url: member.guild.iconURL(),
          },
          description: `**»** I reset the invite system because I didn't have enough privileges on the ${member.guild.channels.cache.get(inviteManager.channel)} channel.`,
          fields: [
            {
              name: '**»** Permissions I Need;',
              value: "**•** " + clientPerms.map((p) => `${p}`).join("\n**•** "),
            },
          ]
        }]
      });

    }

    const cachedInvites = client.guildInvites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();

    const usedInvite = newInvites.find(inv => cachedInvites?.get(inv.code) < inv.uses);
    //console.log("Cached", [...cachedInvites.keys()])
    //console.log("New", [...newInvites.values()].map(inv => inv.code))
    //console.log("Used", usedInvite)
    //console.log(`The code ${usedInvite.code} was just used by ${member.user.username}.`)

    //Davetçinin davet ettiği üyelere bu üyeyi pushlama 
    if (usedInvite && !inviteManager.invites?.[usedInvite.inviter.id]?.includes(member.id)) {

      guildData.inviteManager.invites ||= {};
      guildData.inviteManager.invites[usedInvite.inviter.id] ||= [];

      guildData.inviteManager.invites[usedInvite.inviter.id].push(member.id);
      guildData.markModified('inviteManager');
      await guildData.save();

    }

    newInvites.each(inv => cachedInvites?.set(inv.code, inv.uses));
    client.guildInvites.set(member.guild.id, cachedInvites);

    let joinEmbed = {
      color: client.settings.embedColors.green,
      //title: `${usedInvite.url}`,
      author: {
        name: `${member.user.tag} Joined!`,
        icon_url: member.user.displayAvatarURL(),
      },
      description: (!usedInvite || member.user.bot)
        ? `📩 • The inviter was not found.`
        : `📩 • Invited by **${used Invite.inviter.tag}**.  (There is an invite **${invite Manager.invites?.[usedInvite.inviter.id]?.length || 1}**.)`,
      //.setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
    };

    if (member.user.bot) joinEmbed.author.name += ` (Bot 🤖)`;

    member.guild.channels.cache.get(inviteManager.channel).send({
      embeds: [joinEmbed]
    });

  } catch (err) { client.logger.error(err); };
};
