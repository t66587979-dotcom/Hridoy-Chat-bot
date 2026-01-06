const economy = require("./Economy.js");

module.exports.config = {
  name: "bet",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Bet your coins and test your luck!",
  commandCategory: "Games",
  usages: "[amount]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const userID = event.senderID;
  const betAmount = parseInt(args[0]);

  if (isNaN(betAmount) || betAmount <= 0)
    return api.sendMessage("⚠️ সঠিকভাবে কয়েনের এমাউন্ট দিন! উদাহরণ: bet 500", event.threadID, event.messageID);

  const balance = economy.getBalance(userID);

  if (balance < betAmount)
    return api.sendMessage("❌ পর্যাপ্ত কয়েন নেই!", event.threadID, event.messageID);

  const chance = Math.random();
  let result = "";

  if (chance < 0.45) {
    // হারবে
    economy.subtractBalance(userID, betAmount);
    result = `😢 আপনি হেরে গেছেন ${betAmount} কয়েন!`;
  } else if (chance < 0.85) {
    // ডাবল জিতবে
    economy.addBalance(userID, betAmount * 2);
    result = `🎉 আপনি জিতেছেন ${betAmount * 2} কয়েন!`;
  } else {
    // ৫ গুণ জিতবে
    economy.addBalance(userID, betAmount * 5);
    result = `💎 ভাগ্যবান! আপনি জিতেছেন ${betAmount * 5} কয়েন!`;
  }

  const total = economy.getBalance(userID);

  return api.sendMessage(
    `🎯 BET RESULT 🎯\n━━━━━━━━━━━━━━━\n${result}\n💰 আপনার নতুন ব্যালান্স: ${total.toLocaleString()} কয়েন`,
    event.threadID,
    event.messageID
  );
};
