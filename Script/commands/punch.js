const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "punch",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Kaneki (Improved by Grok)",
  description: "ট্যাগ করা ফ্রেন্ডকে পাঞ্চ করো 👊 (অ্যানিমেটেড GIF)",
  commandCategory: "game",
  usages: "punch @কেউ",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

const punchGifs = [
  "https://i.postimg.cc/SNX8pD8Z/13126.gif",
  "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
  "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
  "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const mentions = Object.keys(event.mentions);
  if (mentions.length === 0) {
    return api.sendMessage("⚠️ কাউকে @ট্যাগ করো যাকে পাঞ্চ করতে চাও!", threadID, messageID);
  }

  const partnerID = mentions[0];
  let partnerName = event.mentions[partnerID].replace("@", "");

  try {
    // লোডিং মেসেজ
    await api.sendMessage("পাঞ্চ লোড হচ্ছে... 👊💥", threadID, messageID);

    const randomGif = punchGifs[Math.floor(Math.random() * punchGifs.length)];
    const cachePath = path.join(__dirname, "cache", `punch_${Date.now()}.gif`);

    const response = await axios.get(randomGif, { responseType: "arraybuffer", timeout: 10000 });

    fs.writeFileSync(cachePath, Buffer.from(response.data));

    await api.sendMessage({
      body: `${partnerName} got punched by you! 👊💥`,
      mentions: [{ tag: partnerName, id: partnerID }],
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => fs.unlinkSync(cachePath), messageID);

  } catch (error) {
    console.error("Punch GIF error:", error.message);
    api.sendMessage("GIF লোড করতে সমস্যা হয়েছে 😔 আবার ট্রাই করো!", threadID, messageID);
  }
};