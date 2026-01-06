module.exports.config = {
  name: "password",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Generate a password-style image with two custom texts",
  commandCategory: "Games",
  usages: "[text 1] | [text 2]",
  cooldowns: 10
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText("W").width > maxWidth) return null;
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
  return lines;
};

module.exports.run = async function ({ api, event, args }) {
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");

  const { threadID, messageID } = event;
  const textInput = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g, "|");
  const text = textInput.split("|");

  const imgPath = __dirname + `/cache/pass.png`;
  const fontPath = __dirname + `/cache/SVN-Arial 2.ttf`;

  // ✅ Background image (unchanged)
  const bgBuffer = (await axios.get("https://i.imgur.com/QkddlpG.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(imgPath, Buffer.from(bgBuffer, "utf-8"));

  // ✅ Font file check/download
  if (!fs.existsSync(fontPath)) {
    const fontData = (await axios.get("https://drive.google.com/u/0/uc?id=11YxymRp0y3Jle5cFBmLzwU89XNqHIZux&export=download", {
      responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(fontPath, Buffer.from(fontData, "utf-8"));
  }

  const baseImg = await loadImage(imgPath);
  const canvas = createCanvas(baseImg.width, baseImg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

  registerFont(fontPath, { family: "SVN-Arial 2" });
  ctx.font = "30px SVN-Arial 2";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";

  const line1 = await this.wrapText(ctx, text[0] || "Text 1", 464);
  const line2 = await this.wrapText(ctx, text[1] || "Text 2", 464);

  ctx.fillText(line1.join("\n"), 320, 129);
  ctx.fillText(line2.join("\n"), 330, 380);

  const buffer = canvas.toBuffer();
  fs.writeFileSync(imgPath, buffer);

  api.sendMessage({ attachment: fs.createReadStream(imgPath) }, threadID, () => fs.unlinkSync(imgPath), messageID);
};