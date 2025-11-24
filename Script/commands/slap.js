module.exports.config = {
  name: "slap",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ + Hridoy Edit",
  description: "Slap the friend tag (with admin protection)",
  commandCategory: "general",
  usages: "slap [@tag someone you want to slap]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const request = require("request");
  const fs = require("fs");
  const out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

  if (!args.join("")) return out("Please tag someone to slap!");

  const mentionID = Object.keys(event.mentions)[0];
  const tag = event.mentions[mentionID].replace("@", "");

  // 🛡️ Admin Protection List (add your own IDs)
  const adminIDs = ["100048786044500", "100001162111551"];

  if (adminIDs.includes(mentionID)) {
    return api.sendMessage(
      `⚠️ ওটা আমার Boss ভাই! ওরে slap দিতে চাইলে তুই নিজেই গালে পড়বি 😤😹`,
      event.threadID,
      event.messageID
    );
  }

  try {
    const res = await axios.get("https://api.waifu.pics/sfw/slap");
    const getURL = res.data.url;
    const ext = getURL.substring(getURL.lastIndexOf(".") + 1);

    const callback = () => {
      api.setMessageReaction("👊", event.messageID, () => {}, true);
      api.sendMessage(
        {
          body: `👋 Slapped! ${tag}\n\nবেশি বাড়াবাড়ি করলে গাল লাল করে দিব 😾`,
          mentions: [{ tag: tag, id: mentionID }],
          attachment: fs.createReadStream(__dirname + `/cache/slap.${ext}`),
        },
        event.threadID,
        () => fs.unlinkSync(__dirname + `/cache/slap.${ext}`),
        event.messageID
      );
    };

    request(getURL)
      .pipe(fs.createWriteStream(__dirname + `/cache/slap.${ext}`))
      .on("close", callback);
  } catch (err) {
    api.sendMessage("⚠️ Error! Couldn't generate slap gif.", event.threadID, event.messageID);
    api.setMessageReaction("☹️", event.messageID, () => {}, true);
  }
};
