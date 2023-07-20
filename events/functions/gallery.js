module.exports = async (client, message, gallery) => {

  try {

    //If the message owner does not have the authority to manage channels
    if (message.channel.permissionsFor(message.member).has("ManageChannels")) return;

    //If the message does not contain attachments
    if (message.attachments.size) return;

    //If the message does not have a linked attachment
    if (message.content.match(/\bhttps?:\/\/\S+/gi)?.find(url =>
      url.endsWith(".png") ||
      url.endsWith(".jpg") ||
      url.endsWith(".mp4") ||
      url.endsWith(".mp3")
    )) return;

    //let repliedMessage;
    //if (message.reference) await message.channel.messages.fetch(message.reference.messageId).then(repliedMsg => repliedMessage = repliedMsg);

    //There is not quoted or the quoted message has no attachment
    //if (!repliedMessage || repliedMessage.attachments.size == 0) {

    message.delete({ reason: `Nraphy Gallery system.` })
      .catch(e => { });

    //Warning Text
    const userCache = client.userDataCache[message.author.id] || (client.userDataCache[message.author.id] = {});
    if (!userCache?.lastWarn || Date.now() - userCache.lastWarn > 5000) {
      userCache.lastWarn = Date.now();
      message.channel.send({
        content: message.author.toString(),
        embeds: [
          {
            color: client.settings.embedColors.red,
            title: '**»** You Can Only Share **Photo/Video** On This Channel!',
            description: `**•** This channel is set as a gallery channel.`
          }
        ]
      }).then(msg => setTimeout(() => msg.delete().catch(e => { }), 5000));
    }

  } catch (err) { client.logger.error(err); };
};
