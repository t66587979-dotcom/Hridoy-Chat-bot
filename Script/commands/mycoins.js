const economy = require("./Economy.js");

module.exports.config = {
  name: "mycoins",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Check your coin balance",
  commandCategory: "Games",
  usages: "",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const userID = event.senderID;
  const balance = economy.getBalance(userID);

  let message = "";

  if (userID === "100048786044500") {
    message += "👑 Special Account Detected 👑\n";
    message += "━━━━━━━━━━━━━━━━━━━━━\n";
  }

  message += `💳 আপনার মোট কয়েন: ${balance.toLocaleString()} 🪙`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
