const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");
const jimp = require("jimp");
const path = require("path");

module.exports.config = {
  name: "family",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "rX (Fixed by Grok for Hridoy Bot)",
  description: "Create a photo of all members in the group (family/group photo)",
  commandCategory: "Create a photo",
  usages: "family <size> [#color code] [title]\nEg: family 200 #ffffff Brothers of one house\nsize=0 → auto size",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "jimp": "",
    "axios": "",
    "fs-extra": ""
  }
};

const FONT_URL = "https://drive.google.com/uc?id=1q0FPVuJ-Lq7-tvOYH0ILgbjrX1boW7KW&export=download"; // VNCORSI.ttf
const BG_URL = "https://i.ibb.co/QvG4LTw/image.png"; // background
const FRAME_URL = "https://i.ibb.co/H41cdDM/1624768781720.png"; // khung for admin

module.exports.onLoad = async () => {
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const fontPath = path.join(cacheDir, "VNCORSI.ttf");
  if (!fs.existsSync(fontPath)) {
    const res = await axios.get(FONT_URL, { responseType: "arraybuffer" });
    fs.writeFileSync(fontPath, Buffer.from(res.data));
  }

  Canvas.registerFont(fontPath, { family: "Dancing Script" });
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (global.client.family) {
    return api.sendMessage("অন্য গ্রুপের রিকোয়েস্ট প্রসেস হচ্ছে, অপেক্ষা করো!", threadID, messageID);
  }

  global.client.family = true;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const participants = threadInfo.participantIDs;
    const admins = threadInfo.adminIDs.map(a => a.id);

    if (participants.length === 0) {
      global.client.family = false;
      return api.sendMessage("গ্রুপে কোনো মেম্বার নেই!", threadID, messageID);
    }

    let size = parseInt(args[0]) || 0;
    let color = args[1] && args[1].startsWith("#") ? args[1] : "#000000";
    let title = args.slice(2).join(" ") || threadInfo.threadName || "Family Group";

    api.sendMessage(`প্রসেস হচ্ছে... মোট মেম্বার: ${participants.length}\nঅপেক্ষা করো (৩০-৬০ সেকেন্ড লাগতে পারে)`, threadID, messageID);

    const background = await Canvas.loadImage(BG_URL);
    const canvas = Canvas.createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    let x = 20;
    let y = 150; // শুরু থেকে উপরে স্পেস
    let row = 0;
    let processed = 0;
    let failed = 0;

    const avatarSize = size > 0 ? size : Math.floor(Math.sqrt((canvas.width * (canvas.height - 150)) / participants.length)) - 10;

    for (const id of participants) {
      try {
        const avatarUrl = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        const avatarRes = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        const avatarImg = await Canvas.loadImage(Buffer.from(avatarRes.data));

        ctx.drawImage(avatarImg, x, y, avatarSize, avatarSize);

        // Admin frame
        if (admins.includes(id)) {
          const frame = await Canvas.loadImage(FRAME_URL);
          ctx.drawImage(frame, x, y, avatarSize, avatarSize);
        }

        x += avatarSize + 10;
        if (x + avatarSize > canvas.width - 20) {
          x = 20;
          y += avatarSize + 10;
          row++;
        }

        processed++;
      } catch (err) {
        failed++;
        console.log(`Failed avatar for ${id}: ${err.message}`);
      }
    }

    // Title text
    ctx.font = "bold 80px Dancing Script";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 100);

    const outputPath = path.join(__dirname, "cache", `family_\( {threadID}_ \){Date.now()}.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputPath, buffer);

    api.sendMessage({
      body: `সাকসেস! মোট অ্যাভাটার: ${processed} (ফেল হয়েছে ${failed})\nসাইজ: ${avatarSize}px\nটাইটেল: ${title}\nপ্রসেস টাইম: ${(Date.now() - Date.now()) / 1000} সেকেন্ড`,
      attachment: fs.createReadStream(outputPath)
    }, threadID, () => fs.unlinkSync(outputPath), messageID);

  } catch (error) {
    console.error("Family error:", error);
    api.sendMessage("কোনো সমস্যা হয়েছে 😔 আবার ট্রাই করো!", threadID, messageID);
  } finally {
    global.client.family = false;
  }
};