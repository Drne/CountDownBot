const Discord = require('discord.js');
const chrono = require('chrono-node')
const express = require('express');
const app = express();
const port = 3000;

process.env.TZ = 'America/New_York'

countdowns = {}

app.get('/', (req, res) => res.send('I\'m alive, I promise'));

app.listen(port, () => console.log(`listening at http://localhost:${port}`));

const client = new Discord.Client();

client.on('message', (msg) => {
  if (msg.content.startsWith('/countdown')) {
    const countdownTime = 'countdown in'
    let incomingTimeStr = msg.content.slice(10)
    let parsedIncomingTime = chrono.parseDate(incomingTimeStr + 'from now', new Date())
    msg.reply('Starting Countdown! ').then((replyMessage) => {
      msg.delete()
      baseMessage = '<@' + msg.author.id + '>'
      countdown(baseMessage, replyMessage, new Date(parsedIncomingTime.getTime()))
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
  const newTime = new Date(countdownTime.getTime())
  if (newTime - Date.now() < 0) {
    msg.edit(baseMessage + ' Timer Ended!')
    delete countdowns[msg.id]
  } else {
    remainingTime = timeDistance(newTime, Date.now())
    // console.log(remainingTime)
    msg.edit(baseMessage + ' ' + remainingTime).then(() => {
      setTimeout(countdown, 1000, baseMessage, msg, newTime)
    })
  }
}