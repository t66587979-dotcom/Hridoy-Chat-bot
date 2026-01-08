module.exports.config = {
  name: "trump",
  version: "2.0.0", // Kaguya Upgrade: Memory-safe, better UX
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Style)",
  description: "Generate Trump meme: Trump holding a sign with your text",
  commandCategory: "edit-img",
  usages: "[your text]",
  cooldowns: 10
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
      if (ctx.measureText(`\( {line} \){words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    resolve(lines);
  });
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const path = require("path");

  const threadID = event.threadID;
  const messageID = event.messageID;

  const text = args.join(" ").trim();
  if (!text) {
    return api.sendMessage(
      "🌙 Usage: .trump [your text]\nExample: .trump Kaguya is the best AI ever!",
      threadID,
      messageID
    );
  }

  try {
    const bgUrl = "https://i.imgur.com/ZtWfHHx.png"; // Trump holding sign background
    const bgBuffer = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
    const bgImage = await loadImage(Buffer.from(bgBuffer));

    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Text settings (Trump style: big, black, bold)
    let fontSize = 45;
    ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    // Auto shrink font if text too long
    while (ctx.measureText(text).width > 2600 && fontSize > 10) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }

    // Wrap text
    const lines = await module.exports.wrapText(ctx, text, 1160);

    // Draw wrapped text
    const lineHeight = fontSize * 1.2;
    let y = 165; // starting y position
    for (const line of lines) {
      ctx.fillText(line, 60, y);
      y += lineHeight;
    }

    // Generate buffer directly
    const imageBuffer = canvas.toBuffer("image/png");

    return api.sendMessage({
      body: `🌙 **Kaguya's Trump Meme Activated!** 🌙\n` +
            `"${text}"\n\n` +
            `Trump says: 'This is huge... believe me~ 🇺🇸🔥'`,
      attachment: imageBuffer
    }, threadID, messageID);

  } catch (error) {
    console.error("Trump Meme Error:", error.message);
    return api.sendMessage(
      "🌑 Chakra disrupted! Failed to generate Trump meme.\n" +
      `Error: ${error.message}\n` +
      "Try shorter text or later.",
      threadID,
      messageID
    );
  }
};