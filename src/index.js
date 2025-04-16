// src/index.js
// Main entry point for the WhatsApp Business Idea Roast Bot

require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { roastBusinessIdea } = require("./gemini.js");

// Bot configuration
const BOT_NAME = process.env.BOT_NAME || "RoastBot";
const BOT_TRIGGER = process.env.BOT_TRIGGER || "@RoastBot";

console.log(`Starting ${BOT_NAME}...`);
console.log("Bot will respond to mentions with trigger:", BOT_TRIGGER);

// Initialize WhatsApp client with LocalAuth strategy for session persistence
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/4.0.0.html",
  },
});

// Generate QR code for authentication
client.on("qr", (qr) => {
  console.log("QR Code received. Scan this with your WhatsApp app:");
  qrcode.generate(qr, { small: true });
});

// Handle client ready event
client.on("ready", () => {
  console.log("WhatsApp client is ready!");
  console.log(
    `${BOT_NAME} is now active and listening for business ideas to roast.`
  );
  console.log(
    `Mention the bot with ${BOT_TRIGGER} followed by a business idea.`
  );
});

// Extract business idea from message
const extractBusinessIdea = (message) => {
  // Remove the bot trigger from the message
  const cleanedMessage = message.replace(BOT_TRIGGER, "").trim();
  return cleanedMessage;
};

// Handle incoming messages
client.on("message_create", async (msg) => {
  // Skip processing if message is from the bot itself
  // if (msg.fromMe) return;

  const messageBody = msg.body;

  // Check if the message mentions the bot
  if (messageBody.includes(BOT_TRIGGER)) {
    console.log("Bot mentioned in message:", messageBody);

    // Get the business idea from the message
    const businessIdea = extractBusinessIdea(messageBody);

    if (!businessIdea) {
      await msg.reply(
        `Hey there! I'm ${BOT_NAME}, ready to roast business ideas. Just mention me with a business idea!`
      );
      return;
    }

    // Send a typing indicator
    const chat = await msg.getChat();
    chat.sendStateTyping();

    try {
      console.log("Roasting business idea:", businessIdea);

      // Get the roast from Gemini
      const roast = await roastBusinessIdea(businessIdea);

      // Reply with the roast
      await msg.reply(roast);
    } catch (error) {
      console.error("Error processing message:", error);
      await msg.reply(
        "Sorry, I had trouble roasting that idea. My comedy circuits must be overheating! 🔥"
      );
    } finally {
      // Clear typing indicator
      chat.clearState();
    }
  }
});

// Handle authentication failures
client.on("auth_failure", (error) => {
  console.error("Authentication failed:", error);
  console.log("Please restart the application and try again.");
});

// Handle disconnects
client.on("disconnected", (reason) => {
  console.log("Client was disconnected:", reason);
  console.log("Attempting to reconnect...");
  client.initialize();
});

// Initialize the client
client.initialize();

// Handle process termination
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await client.destroy();
  process.exit(0);
});
