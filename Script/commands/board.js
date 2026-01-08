module.exports.config = {
  name: "board",
  version: "2.0.0", // Upgraded: No disk files, memory only, Kaguya style
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Upgrade)",
  description: "Write your text on a blackboard (like comment on board) 🌙",
  commandCategory: "general",
  usages: ".board [your text] or .bang [text]",
  cooldowns: 10,
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

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const { loadImage, createCanvas } = require("canvas");

  const text = args.join(" ").trim();
  if (!text) {
    return api.sendMessage("🌙 Mortal! Enter some text to write on Kaguya's blackboard.\nExample: .board Kaguya is supreme!", event.threadID, event.messageID);
  }

  try {
    // Blackboard background (direct buffer)
    const bgUrl = "https://i.imgur.com/Jl7sYMm.jpeg";
    const bgBuffer = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
    const baseImage = await loadImage(Buffer.from(bgBuffer));

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Text settings (chalk style)
    let fontSize = 28;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`; // Valera না থাকলে fallback
    ctx.fillStyle = "#FFFFFF"; // chalk white
    ctx.textAlign = "left";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 5;

    // Auto shrink font if too long
    while (ctx.measureText(text).width > 440 && fontSize > 10) {
      fontSize--;
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    }

    // Wrap text
    const lines = await module.exports.wrapText(ctx, text, 440);

    // Draw wrapped text
    const lineHeight = fontSize * 1.2;
    let y = 100; // starting y position
    for (const line of lines) {
      ctx.fillText(line, 85, y);
      y += lineHeight;
    }

    // Final buffer
    const imageBuffer = canvas.toBuffer("image/png");

    return api.sendMessage({
      body: `🌙 **Kaguya's Blackboard Activated!** 🌙\n` +
            `Your words now echo in the divine void...\n` +
            `"Submit to my vision, mortal~ 🔮" - Kaguya Ōtsutsuki`,
      attachment: imageBuffer
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error("Board Error:", error.message);
    return api.sendMessage("🌑 Chakra disrupted! Error generating board.\nTry shorter text or later.", event.threadID, event.messageID);
  }
};