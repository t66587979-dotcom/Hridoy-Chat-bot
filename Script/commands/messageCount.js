const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "cache", "messageCount.json");

module.exports.config = {
  name: "msgcount",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy + GPT",
  description: "Show message count leaderboard of group",
  commandCategory: "Group",
  usages: "msgcount",
  cooldowns: 5,
};

// 🔁 Auto message counter
module.exports.handleEvent = async function ({ event }) {
  if (!event.threadID || !event.senderID) return;

  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}));
  }

  const data = JSON.parse(fs.readFileSync(dataPath));
  const tid = event.threadID;
  const uid = event.senderID;

  if (!data[tid]) data[tid] = {};
  if (!data[tid][uid]) data[tid][uid] = 0;

  data[tid][uid]++;

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// 📊 Show leaderboard
module.exports.run = async function ({ api, event, Users }) {
  if (!fs.existsSync(dataPath)) {
    return api.sendMessage("❌ কোনো ডাটা নেই!", event.threadID);
  }

  const data = JSON.parse(fs.readFileSync(dataPath));
  const tid = event.threadID;

  if (!data[tid]) {
    return api.sendMessage("❌ এই গ্রুপের কোনো ডাটা নেই!", tid);
  }

  const sorted = Object.entries(data[tid])
    .sort((a, b) => b[1] - a[1]);

  let msg = "📊 𝗚𝗥𝗢𝗨𝗣 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗\n\n";

  let i = 1;
  for (const [uid, count] of sorted) {
    const name = await Users.getNameUser(uid);
    msg += `${i}. ${name} ➜ ${count} messages\n`;
    i++;
  }

  api.sendMessage(msg, tid, event.messageID);
};
