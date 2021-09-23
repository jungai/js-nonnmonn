import "dotenv/config";
import { Client, Intents, MessageEmbed } from "discord.js";
import {
  getToken,
  getUserFromPattern,
  delay,
  grabPattern,
  dropPattern,
  dailyPattern,
  grabDurationSeconds,
  dropDurationSeconds,
  dailyDurationSeconds,
  oneMinuteDurationSeconds,
} from "./utils.js";

// side effect
const state = {
  prefix: "mon",
  isDisabledDrop: false,
  isDisabledGrab: false,
};

function getPrefix() {
  return state.prefix;
}

function getIsDisabledDrop() {
  return state.isDisabledDrop;
}

function getIsDisabledGrab() {
  return state.isDisabledGrab;
}

function checkPrefix(val) {
  return getPrefix() === val;
}

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const getStatusEmbed = () =>
  new MessageEmbed()
    .setTitle("Status")
    .setColor("#2ecc71")
    .addFields(
      { name: "Drop", value: state.isDisabledDrop ? "off" : "on" },
      { name: "Grab", value: state.isDisabledGrab ? "off" : "on" }
    )
    .setTimestamp();

// When the client is ready, run this code (only once)
client.once("ready", async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setStatus("online");
  client.user.setActivity("KODHIT | mon help", { type: "WATCHING" });
});

client.on("messageCreate", async (message) => {
  // TODO: make code better
  // karuta
  if (grabPattern.test(message.content) && !getIsDisabledGrab()) {
    // grab
    await delay(grabDurationSeconds);
    message.channel.send(
      `${getUserFromPattern(message.content)} **Grab** currently available 😉`
    );
  }

  if (dropPattern.test(message.content) && !getIsDisabledDrop()) {
    // drop
    await delay(dropDurationSeconds);
    message.channel.send(
      `${getUserFromPattern(message.content)} **Drop** currently available 😗`
    );
  }

  if (dailyPattern.test(message.content)) {
    // daily
    message.channel.send(`see ya for next daily is available 🥳`);
    await delay(dailyDurationSeconds);
    message.channel.send(
      `${message.content.split(",")[0]} **Daily** currently available 😉`
    );
  }

  // mon command
  const [prefix, command, value] = message.content.split(" ");
  if (!checkPrefix(prefix)) return;

  if (command === "help") {
    message.channel.send(`
**mon status** -> get currently status(drop, grab)
**mon drop <value>** (value are 'on' or 'off) -> set drop status
**mon grab <value>** (value are 'on' or 'off) -> set grab status
**mon reset** -> reset to default
**mon cd** -> custom drop cool down
**mon count <minute> -> timer (1,2,3,4,5,....)
    `);
  }

  if (command === "drop" && (value === "on" || value === "off")) {
    state.isDisabledDrop = value === "on" ? false : true;
    message.channel.send(`**drop** is ${value}`);
  }

  if (command === "grab" && (value === "on" || value === "off")) {
    state.isDisabledGrab = value === "on" ? false : true;
    message.channel.send(`**grab** is ${value}`);
  }

  if (command === "status") {
    message.channel.send({ embeds: [getStatusEmbed()] });
  }

  if (command === "reset") {
    state.isDisabledDrop = false;
    state.isDisabledGrab = false;
    message.channel.send(`**reset** to default (all on)`);
  }

  if (command === "cd") {
    message.channel.send(`${message.author} see ya in 30min`);
    await delay(dropDurationSeconds);
    message.channel.send(`${message.author} already 30 min 😏`);
  }

  if (command === "count" && !Number.isNaN(parseInt(value, 10))) {
    message.channel.send(`${message.author} see ya in ${value} min`);
    await delay(oneMinuteDurationSeconds * parseInt(value, 10));
    message.channel.send(`${message.author} already ${val} min 😏`);
  }
});

// Login to Discord with your client's token
client.login(getToken());
