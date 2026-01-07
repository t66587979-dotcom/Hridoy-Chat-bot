const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "punch",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Kaneki + Fixed by ChatGPT",
  description: "Tag করা বন্ধুকে punch দাও 👊 (GIF)",
  commandCategory: "fun",
  usages: "punch @user",
  cooldowns: 5
};

const punchGifs = [
  "https://i.postimg.cc/SNX8pD8Z/13126.gif",
  "https://i.postimg.cc/TYZb2gJT/1467506881-1016b5fd386cf30488508cf6f0a2bee5.gif",
  "https://i.postimg.cc/fyV3DR33/anime-punch.gif",
  "https://i.postimg.cc/P5sLnhdx/onehit-30-5-2016-3.gif"
];

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, mentions } = event;

  if (!mentions || Object.keys(mentions).length === 0) {
    return api.sendMessage(
      "⚠️ কাউকে @tag করো যাকে punch দিতে চাও!",
      threadID,
      messageID
    );
  }

  const targetID = Object.keys(mentions)[0];
  const targetName = mentions[targetID].replace("@", "");

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const gifLink = punchGifs[Math.floor(Math.random() * punchGifs.length)];
  const gifPath = path.join(cacheDir, `punch_${Date.now()}.gif`);

  try {
    const loading = await api.sendMessage("👊 Punch লোড হচ্ছে...", threadID);

    const res = await axios.get(gifLink, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000
    });

    fs.writeFileSync(gifPath, res.data);

    await api.sendMessage(
      {
        body: `💥 ${targetName} কে জোরে একটা punch মারা হলো! 👊`,
        mentions: [{ tag: targetName, id: targetID }],
        attachment: fs.createReadStream(gifPath)
      },
      threadID,
      () => {
        fs.unlinkSync(gifPath);
        api.unsendMessage(loading.messageID);
      },
      messageID
    );

  } catch (err) {
    console.log("Punch error:", err.message);
    api.sendMessage("❌ GIF পাঠানো যায়নি, আবার চেষ্টা করো।", threadID, messageID);
  }
};
