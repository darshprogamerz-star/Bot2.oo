const express = require('express');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

// --- 1. Railway ke liye 24/7 Web Server ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Smart Minecraft Bot is running 24/7 on Railway!');
});

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

// --- 2. Minecraft Bot ka Code ---
function createBot() {
  const bot = mineflayer.createBot({
    host: 'DG_LAND502.aternos.me', // Yahan apna server IP dalein
    port: 62974,                           // Yahan server port dalein
    username: 'SmartBot',
    version: 1.20.10                         // Version auto-detect
  });

  // Pathfinder plugin load karna
  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log("Bot server par aa gaya hai!");
    bot.chat('Hello! Main aa gaya hoon.');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const target = bot.players[username] ? bot.players[username].entity : null;

    if (message === 'follow') {
      if (!target) {
        bot.chat("Bhai tum kahan ho? Dikh nahi rahe.");
        return;
      }
      bot.chat("Aa raha hoon peeche peeche!");
      const defaultMove = new Movements(bot);
      bot.pathfinder.setMovements(defaultMove);
      bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true);
      
    } else if (message === 'stop') {
      bot.pathfinder.setGoal(null);
      bot.chat("Theek hai, main ruk gaya.");
    }
  });

  // Agar bot kick ho jaye ya server band ho, toh auto-reconnect karega
  bot.on('end', () => {
    console.log('Bot disconnect ho gaya! 5 second mein dobara connect kar raha hoon...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Error aaya hai:', err);
  });
}

// Bot ko start karna
createBot();
