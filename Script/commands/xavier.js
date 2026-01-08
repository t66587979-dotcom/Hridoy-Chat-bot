module.exports.config = {
  name: "xavier",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "",
  commandCategory: "edit-img",
  usages: "[text]",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `\( {temp.slice(-1)} \){words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`\( {line} \){words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const { loadImage, createCanvas } = require("canvas");

  const threadID = event.threadID;
  const messageID = event.messageID;

  const text = args.join(" ").trim();
  if (!text) {
    return api.sendMessage("🌙 Enter the content of the comment on the board", threadID, messageID);
  }

  try {
    // Online background image link (direct from your original)
    const bgUrl = "https://i.imgur.com/21xuPR1.jpg";

    // Download background as Buffer
    const bgBuffer = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
    const baseImage = await loadImage(Buffer.from(bgBuffer));

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Text settings
    let fontSize = 30;
    ctx.font = `320 ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    // Auto shrink font if text too long
    while (ctx.measureText(text).width > 2600 && fontSize > 10) {
      fontSize--;
      ctx.font = `320 ${fontSize}px Arial, sans-serif`;
    }

    // Wrap text
    const lines = await module.exports.wrapText(ctx, text, 1160);

    // Draw wrapped text
    const lineHeight = fontSize * 1.2;
    let y = 270; // starting y position
    for (const line of lines) {
      ctx.fillText(line, 30, y);
      y += lineHeight;
    }

    // Generate buffer directly (no file save)
    const imageBuffer = canvas.toBuffer("image/png");

    return api.sendMessage({
      attachment: imageBuffer
    }, threadID, messageID);

  } catch (error) {
    console.error("Xavier Meme Error:", error.message);
    return api.sendMessage(
      "🌑 Error generating meme! Try shorter text or later.\nError: " + error.message,
      threadID,
      messageID
    );
  }
};