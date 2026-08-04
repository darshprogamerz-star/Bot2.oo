const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'DG_LAND502.aternos.me'
  port: 62974
  username: 'SmartBot'
});

bot.loadPlugin(pathfinder);

bot.on('spawn', () => {
  console.log("Bot server par aa gaya hai!");
  bot.chat('Hello bhai! Main aa gaya hoon.');
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  const target = bot.players[username] ? bot.players[username].entity : null;

  if (message === 'follow') {
    if (!target) return;
    bot.chat("Aa raha hoon peeche!");
    const defaultMove = new Movements(bot);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true);
  } else if (message === 'stop') {
    bot.pathfinder.setGoal(null);
    bot.chat("Theek hai, ruk gaya.");
  }
});

bot.on('end', () => {
  console.log('Bot disconnect ho gaya, dobara reconnect kar raha hoon...');
  setTimeout(() => process.exit(0), 5000);
});

bot.on('error', (err) => console.log('Error:', err));
