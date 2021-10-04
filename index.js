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
  oneHourDurationSeconds,
} from "./utils.js";

// side effect
const state = {
  isDisabledDrop: false,
  isDisabledGrab: false,
  alias: undefined,
};

const prefixes = () => ["mon", state.alias];

function changeAlias(alias) {
  state.alias = alias;
}

function getIsDisabledDrop() {
  return state.isDisabledDrop;
}

function getIsDisabledGrab() {
  return state.isDisabledGrab;
}

function checkPrefixes(val) {
  return prefixes().includes(val);
}

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const helpEmbed = () =>
  new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Help")
    .setThumbnail(
      "https://media3.giphy.com/media/26Ff4P2zcsiIi6fQY/giphy.gif?cid=ecf05e47ocriucm3ha0ikjwwirjxjshcdv4jwajouf0uln4t&rid=giphy.gif&ct=g"
    )
    .addFields(
      { name: "mon status", value: "get currently status(drop, grab, alias)" },
      {
        name: "mon drop <value>",
        value: "set drop status (value are 'on' or 'off)",
      },
      {
        name: "mon grab <value>",
        value: "set grab status (value are 'on' or 'off)",
      },
      { name: "mon cd", value: "count for drop(30min)" },
      { name: "mon vi", value: "count for vi(2hr)" },
      {
        name: "mon count <minute> msg?",
        value: "timer (1,2,3,4,5,....) for minute",
      },
      {
        name: "mon count <number>hr msg?",
        value: "timer (1,2,3,4,5,....) for hour",
      },
      {
        name: "mon alias <alias>",
        value: "change alias",
      }
    )
    .setTimestamp();

const statusEmbed = () =>
  new MessageEmbed()
    .setTitle("Status")
    .setColor("#2ecc71")
    .setThumbnail(
      "https://media0.giphy.com/media/oO9aEGGiTLtwDBe5OI/giphy.gif?cid=790b7611f20c39b756bee66bd03d1c8ca60c642fde23aaf3&rid=giphy.gif&ct=g"
    )
    .addFields(
      { name: "Prefix", value: prefixes()[0] },
      { name: "Alias", value: prefixes()[1] || "not set" },
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

    return;
  }

  if (dropPattern.test(message.content) && !getIsDisabledDrop()) {
    // drop
    await delay(dropDurationSeconds);
    message.channel.send(
      `${getUserFromPattern(message.content)} **Drop** currently available 😗`
    );

    return;
  }

  if (dailyPattern.test(message.content)) {
    // daily
    message.channel.send(`see ya for next daily is available 🥳`);
    await delay(dailyDurationSeconds);
    message.channel.send(
      `${message.content.split(",")[0]} **Daily** currently available 😉`
    );

    return;
  }

  if (message?.embeds[0]?.title === "Purchase Gems") {
    message.suppressEmbeds(true);
    message.channel.send("อย่าเติมเลยค้าบบ 😅");

    return;
  }

  // mon command
  const [prefix, command, value, msg] = message.content.split(" ");
  if (!checkPrefixes(prefix)) return;

  if (command === "help") {
    message.channel.send({ embeds: [helpEmbed()] });
    return;
  }

  if (command === "alias") {
    changeAlias(value);

    message.channel.send(`add alias -> ${value}`);
    return;
  }

  if (command === "drop" && (value === "on" || value === "off")) {
    state.isDisabledDrop = value === "on" ? false : true;
    message.channel.send(`**drop** is ${value}`);
    return;
  }

  if (command === "grab" && (value === "on" || value === "off")) {
    state.isDisabledGrab = value === "on" ? false : true;
    message.channel.send(`**grab** is ${value}`);
    return;
  }

  if (command === "status") {
    message.channel.send({ embeds: [statusEmbed()] });
    return;
  }

  if (command === "cd") {
    message.channel.send(`${message.author} see ya in 30min`);
    await delay(dropDurationSeconds);
    message.channel.send(`${message.author} already 30 min 😏`);
    return;
  }

  if (command === "vi") {
    message.channel.send(`${message.author} see ya in 2 hours`);
    await delay(oneHourDurationSeconds * 2);
    message.channel.send(`${message.author} vi kub`);
    return;
  }

  if (command === "count") {
    const [hours, empty] = value.split("hr");
    if (!Number.isNaN(parseInt(hours, 10)) && empty === "") {
      message.channel.send(`${message.author} see ya in ${hours} hours`);
      await delay(oneHourDurationSeconds * parseInt(hours, 10));
      message.channel.send(
        msg
          ? `${message.author} -> ${msg}`
          : `${message.author} already ${hours} hours 😏`
      );
      return;
    }
  }

  if (!Number.isNaN(parseInt(value, 10))) {
    message.channel.send(`${message.author} see ya in ${value} min`);
    await delay(oneMinuteDurationSeconds * parseInt(value, 10));
    message.channel.send(
      msg
        ? `${message.author} -> ${msg}`
        : `${message.author} already ${value} min 😏`
    );
    return;
  }
});

// Login to Discord with your client's token
client.login(getToken());
