const { ShardingManager } = require('discord.js');

const config = require("./config.json");
const logger = require("./modules/Logger.js");

if (!config.mongooseToken)
  return logger.error('Value \'mongooseToken\' not found in config.json.  Please fill in the mongooseToken value correctly to avoid errors.');

const manager = new ShardingManager('./client.js', {

  totalShards: "auto",

  respawn: true,

  token: config.token,

  execArgv: ["client.js"],

});

manager.on('shardCreate', (shard) => {
  //logger.shard(`Shard ${shard.id + 1} is starting...`);

  shard.on('death', () => logger.warn(`Shard ${shard.id + 1} sent the death event!`));
  shard.on("disconnect", (event) => logger.error(event));
  //shard.on('ready', () => logger.ready(`Shard ${shard.id + 1} is now up and running!`));
  shard.on('error', (err) => logger.error(`Shard ${shard.id + 1}'There's trouble too, teacher!: \n` + (err.message ? err.message : err)));
});

try {
  logger.client(`Loading Client...`);
  manager.spawn({ timeout: 180000 })
    /*.then(shards => {
      shards.forEach(shard => {
        shard.on('message', message => {
          console.log(message);
        });
      });
    })*/
    .catch(logger.error);
} catch (e) {
  console.log(e);
}
