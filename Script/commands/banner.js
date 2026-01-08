module.exports.config = {
  name: "banner",
  version: "2.0.0", // Upgraded: No file write, memory only, Kaguya style
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Upgrade)",
  description: "Generate stylish banner with anime characters (no disk files)",
  commandCategory: "game",
  usages: "{number}|{name1}|{name2}|{name3}|{color}   e.g. 21|John|Doe|Team|red",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const input = args.join(" ").trim();
    if (!input) return api.sendMessage("🌙 Usage: .banner number|name1|name2|name3|color\nExample: .banner 21|Naruto|Sasuke|Team 7|red", event.threadID, event.messageID);

    const parts = input.split("|").map(p => p.trim());
    const text1 = parts[0] || "21"; // number for character
    const text2 = parts[1] || "YourName";
    const text3 = parts[2] || "";
    const text4 = parts[3] || "";
    let color = parts[4] || "";

    const axios = require("axios");
    const { loadImage, createCanvas, registerFont } = require("canvas");

    // Character list from mocky (lengthchar)
    const lengthcharRes = await axios.get("https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864");
    const lengthchar = lengthcharRes.data;

    if (!lengthchar || !Array.isArray(lengthchar) || text1 < 1 || text1 > lengthchar.length) {
      return api.sendMessage(`🌑 Invalid number! Choose 1-${lengthchar.length} for anime character.`, event.threadID, event.messageID);
    }

    const char = lengthchar[text1 - 1];
    const avaUrl = char.imgAnime;
    const bgUrl = "https://i.imgur.com/Ch778s2.png"; // background

    // Load images as Buffer
    const [bgBuffer, avaBuffer] = await Promise.all([
      axios.get(bgUrl, { responseType: "arraybuffer" }).then(res => Buffer.from(res.data)),
      axios.get(avaUrl, { responseType: "arraybuffer" }).then(res => Buffer.from(res.data))
    ]);

    const bgImage = await loadImage(bgBuffer);
    const avaImage = await loadImage(avaBuffer);

    // Canvas setup
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Draw anime avatar (adjust position/size as original)
    ctx.drawImage(avaImage, 1500, -400, 1980, 1980);

    // Colors
    const bgColor = color || char.colorBg || "#e6b030";

    // Font 1: PastiOblique
    const pastiFontBuffer = await axios.get("https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf", { responseType: "arraybuffer" })
      .then(res => Buffer.from(res.data));
    registerFont(pastiFontBuffer, { family: "PastiOblique" });

    ctx.fillStyle = bgColor;
    ctx.font = "370px PastiOblique";
    ctx.textAlign = "start";
    ctx.fillText(text2, 500, 750);

    // Font 2: gantellinesignature
    const gantellinBuffer = await axios.get("https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf", { responseType: "arraybuffer" })
      .then(res => Buffer.from(res.data));
    registerFont(gantellinBuffer, { family: "gantellinesignature" });

    ctx.fillStyle = "#fff";
    ctx.font = "350px gantellinesignature";
    ctx.fillText(text3, 500, 680);

    // Font 3: UTM Bebas
    const bebasBuffer = await axios.get("https://github.com/hanakuUwU/font/raw/main/UTM%20Bebas.ttf", { responseType: "arraybuffer" })
      .then(res => Buffer.from(res.data));
    registerFont(bebasBuffer, { family: "Bebas" });

    ctx.textAlign = "end";
    ctx.fillStyle = "#f56236";
    ctx.font = "145px PastiOblique";
    ctx.fillText(text4, 2100, 870);

    // Get buffer
    const imageBuffer = canvas.toBuffer("image/png");

    return api.sendMessage({
      body: `🌙 **Kaguya's Banner Created!** 🌙\n` +
            `Character: ${char.name || text1}\n` +
            `Your vision manifested in divine clarity~ 🔮`,
      attachment: imageBuffer
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error("Banner Error:", error);
    return api.sendMessage(`🌑 Chakra disrupted! Error: ${error.message}\nTry again or check input format.`, event.threadID, event.messageID);
  }
};