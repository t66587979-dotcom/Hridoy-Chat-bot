const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "boobs",
  version: "1.1.0",
  hasPermssion: 2, // Owner only - NSFW এর জন্য সেফ রাখা
  credits: "Kaneki (Improved by Grok)",
  description: "Squeeze the breast of the tagged user (fun GIF)",
  commandCategory: "18+ Command",
  usages: "[tag]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  const mentions = Object.keys(event.mentions);

  if (mentions.length === 0) {
    return api.sendMessage("অন্তত ১ জনকে @tag করো!", threadID, messageID);
  }

  const mentionID = mentions[0];
  const tag = event.mentions[mentionID].replace("@", "");

  const links = [
    "https://i.postimg.cc/tC2BTrmF/3.gif",
    "https://i.postimg.cc/pLrqnDg4/78d07b6be53bea612b6891724c1a23660102a7c4.gif",
    "https://i.postimg.cc/gJFD51nb/detail.gif",
    "https://i.postimg.cc/xjPRxxQB/GiC86RK.gif",
    "https://i.postimg.cc/L8J3smPM/tumblr-myzq44-Hv7-G1rat3p6o1-500.gif"
  ];

  const randomLink = links[Math.floor(Math.random() * links.length)];
  const cachePath = path.join(__dirname, "cache", "bopvu.gif");

  // Cache folder check
  if (!fs.existsSync(path.join(__dirname, "cache"))) {
    fs.mkdirSync(path.join(__dirname, "cache"), { recursive: true });
  }

  try {
    const response = await axios.get(randomLink, { responseType: "stream" });
    const writer = fs.createWriteStream(cachePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    api.sendMessage({
      body: `${tag} 𝗬𝗼𝘂 𝗚𝗲𝘁 𝗬𝗼𝘂𝗿 𝗕𝗿𝗲𝗮𝘀𝘁 𝗦𝗾𝘂𝗲𝗲𝘇𝗲𝗱 😝`,
      mentions: [{ tag: tag, id: mentionID }],
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      fs.unlinkSync(cachePath); // Delete after send
    }, messageID);

  } catch (error) {
    console.error("GIF download error:", error);
    api.sendMessage("GIF লোড করতে সমস্যা হয়েছে 😔 Try again later!", threadID, messageID);
  }
};