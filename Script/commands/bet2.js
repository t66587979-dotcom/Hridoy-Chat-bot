const economy = require("./Economy.js");

module.exports.config = {
  name: "bet2",
  version: "2.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Bet system with Economy sync 💸",
  commandCategory: "Games",
  usages: "[amount]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID } = event;
  const amount = parseInt(args[0]);

  if (isNaN(amount) || amount <= 0)
    return api.sendMessage("⚠️ সঠিক বেটের পরিমাণ লিখুন!", threadID);

  const balance = economy.getBalance(senderID);
  if (balance < amount)
    return api.sendMessage("😢 তোমার কাছে পর্যাপ্ত কয়েন নেই!", threadID);

  const chance = Math.random();

  if (chance < 0.5) {
    economy.subtractBalance(senderID, amount);
    return api.sendMessage(`❌ তুমি ${amount} কয়েন হেরে গেছো!`, threadID);
  } else {
    const win = amount * 2;
    economy.addBalance(senderID, win);
    return api.sendMessage(`🎉 তুমি জিতেছো ${win} কয়েন!`, threadID);
  }
};