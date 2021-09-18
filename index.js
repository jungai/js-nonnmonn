import "dotenv/config";
import { Client, Intents } from "discord.js";
import {
  getToken,
  getUserFromPattern,
  delay,
  grabPattern,
  dropPattern,
  grabDurationSeconds,
  dropDurationSeconds,
} from "./utils.js";

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// When the client is ready, run this code (only once)
client.once("ready", async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client.user.setStatus("online");
  client.user.setActivity("KODHIT | mon help", { type: "WATCHING" });
});

client.on("messageCreate", async (message) => {
  if (message.content === "mon help") {
    message.channel.send(`
      ตอนนี้ยังไม่มี 😏
    `);
  }

  if (grabPattern.test(message.content)) {
    await delay(grabDurationSeconds);
    message.channel.send(
      `🚨 ${getUserFromPattern(
        message.content
      )} **Grab** currently available 😉`
    );
  }

  if (dropPattern.test(message.content)) {
    await delay(dropDurationSeconds);
    message.channel.send(
      `🚨 ${getUserFromPattern(
        message.content
      )} **Drop** currently available 😗`
    );
  }
});

// Login to Discord with your client's token
client.login(getToken());
