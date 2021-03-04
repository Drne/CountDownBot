const Discord = require('discord.js');
const chrono = require('chrono-node')
const express = require('express');
const app = express();
const port = 3000;

process.env.TZ = 'America/New_York'

countdowns = {}

app.get('/', (req, res) => res.send('I\'m alive, I promise'));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.on('message', (msg) => {
  if (msg.content.startsWith('/countdown')) {
    countdownTime = 'countdown in'
    time = msg.content.slice(10)
    time = chrono.parseDate(time + 'from now', new Date())
    timeDist = timeDistance(time, Date.now())
    msg.reply('Starting Countdown! ').then((replyMessage) => {
      msg.delete()
      baseMessage = '<@' + msg.author.id + '>'
      countdown(baseMessage, replyMessage, new Date(time.getTime()))
    })
  }
})

client.login(process.env.DISCORD_TOKEN);

const timeDistance = (date1, date2) => {
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
};

function countdown(baseMessage, msg, countdownTime) {
  newTime = new Date(countdownTime.getTime())
  if (newTime - Date.now() < 0) {
    msg.edit(baseMessage + ' Timer Ended!')
  } else {
    remainingTime = timeDistance(time, Date.now())
    msg.edit(baseMessage + ' ' + remainingTime).then(() => {
      countdowns[msg.id] = setTimeout(countdown, 1000, baseMessage, msg, newTime)
    })
  }
}