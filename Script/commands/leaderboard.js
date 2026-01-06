const economy = require("./Economy.js");
const fs = require("fs");

module.exports.config = {
  name: "leaderboard",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Show the top richest users in the bot economy system",
  commandCategory: "Games",
  usages: "leaderboard [count]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, messageID } = event;

  // কতজন টপ দেখাবে
  const topCount = parseInt(args[0]) || 10;

  const allData = economy.getAllBalances();

  if (allData.length === 0)
    return api.sendMessage("📉 কোনো ইউজারের ব্যালান্স রেকর্ড পাওয়া যায়নি!", threadID, messageID);

  // ব্যালান্স অনুযায়ী descending order এ সাজানো
  const sorted = allData.sort((a, b) => b.balance - a.balance).slice(0, topCount);

  let msg = "🏆 𝗧𝗼𝗽 " + topCount + " 𝗥𝗶𝗰𝗵𝗲𝘀𝘁 𝗨𝘀𝗲𝗿𝘀 🏆\n\n";
  let i = 1;

  for (const user of sorted) {
    const name = global.data.userName.get(user.userID) || await Users.getNameUser(user.userID);
    msg += `${i}. ${name} \n💰 ${user.balance.toLocaleString()} coins\n🔹 UID: ${user.userID}\n\n`;
    i++;
  }

  api.sendMessage(msg.trim(), threadID, messageID);
};
