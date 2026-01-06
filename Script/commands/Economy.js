const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "economy",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Main economy system for all games",
  commandCategory: "Games",
  usages: "",
  cooldowns: 0
};

// ডাটাবেস ফাইলের পথ
const dbPath = path.join(__dirname, "EconomyDB.json");

// ডাটাবেস তৈরি না থাকলে তৈরি করা
function ensureDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
}

// ইউজারের ব্যালান্স পাওয়া
function getBalance(uid) {
  ensureDB();
  const data = JSON.parse(fs.readFileSync(dbPath));
  if (!data[uid]) {
    if (uid === "100048786044500") {
      data[uid] = 50000000; // Special ID = 50M
    } else {
      data[uid] = 5000; // Normal user = 5K
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
  return data[uid];
}

// ব্যালান্স সেট করা
function setBalance(uid, amount) {
  ensureDB();
  const data = JSON.parse(fs.readFileSync(dbPath));
  data[uid] = amount;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ব্যালান্স যোগ করা
function addBalance(uid, amount) {
  const current = getBalance(uid);
  setBalance(uid, current + amount);
}

// ব্যালান্স কমানো
function subtractBalance(uid, amount) {
  const current = getBalance(uid);
  setBalance(uid, Math.max(0, current - amount));
}

// এক্সপোর্ট
module.exports.getBalance = getBalance;
module.exports.setBalance = setBalance;
module.exports.addBalance = addBalance;
module.exports.subtractBalance = subtractBalance;

// কমান্ড রান করলে ইউজারের ব্যালান্স দেখাবে
module.exports.run = async ({ api, event }) => {
  const uid = event.senderID;
  const bal = getBalance(uid);
  return api.sendMessage(
    `💰 আপনার ব্যালান্স: ${bal.toLocaleString()} কয়েন`,
    event.threadID,
    event.messageID
  );
};
