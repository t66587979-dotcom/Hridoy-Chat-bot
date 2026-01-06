module.exports.config = {
  name: "phub",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Create a Pornhub-style comment image ( ͡° ͜ʖ ͡°)",
  commandCategory: "Fun",
  usages: "phub [text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

// ✍️ Text wrapping function
module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText("W").width > maxWidth) return resolve(null);
    const words = text.split(" ");
    const lines = [];
    let line = "";
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth)
        line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = "";
      }
      if (words.length === 0) lines.push(line.trim());
    }
    resolve(lines);
  });
};

// 🧠 Main command run
module.exports.run = async function ({ api, event, args }) {
  const { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");

  const avatarPath = __dirname + "/cache/avt.png";
  const outputPath = __dirname + "/cache/phub.png";
  const text = args.join(" ").trim();

  if (!text) {
    return api.sendMessage("⚠️ Please enter a comment text to post!", threadID, messageID);
  }

  try {
    // 🧾 Get user info
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID].name;
    const avatarUrl = userInfo[senderID].thumbSrc;

    // 🖼️ Download avatar and base template
    const avatarData = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
    const templateData = (await axios.get("https://raw.githubusercontent.com/ProCoderMew/Module-Miraiv2/main/data/phub.png", { responseType: "arraybuffer" })).data;

    fs.writeFileSync(avatarPath, Buffer.from(avatarData, "utf-8"));
    fs.writeFileSync(outputPath, Buffer.from(templateData, "utf-8"));

    // 🧩 Canvas setup
    const baseImage = await loadImage(outputPath);
    const avatar = await loadImage(avatarPath);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    // 🖌️ Draw base and avatar
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 30, 310, 70, 70);

    // 🧠 Add name text
    ctx.font = "700 23px Arial";
    ctx.fillStyle = "#FF9900";
    ctx.textAlign = "start";
    ctx.fillText(userName, 115, 350);

    // 💬 Add comment text
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "start";

    let fontSize = 23;
    while (ctx.measureText(text).width > 1160) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial`;
    }

    const lines = await this.wrapText(ctx, text, 1160);
    ctx.fillText(lines.join("\n"), 30, 430);

    // 🖼️ Save and send
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(outputPath, imageBuffer);
    fs.removeSync(avatar);

    return api.sendMessage(
      { attachment: fs.createReadStream(outputPath) },
      threadID,
      () => fs.unlinkSync(outputPath),
      messageID
    );

  } catch (error) {
    console.error("❌ Error generating image:", error);
    return api.sendMessage("⚠️ Something went wrong while generating your image!", threadID, messageID);
  }
};