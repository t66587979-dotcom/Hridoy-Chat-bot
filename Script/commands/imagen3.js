const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_ENDPOINT = "https://dev.oculux.xyz/api/imagen3";
const CACHE_DIR = path.join(__dirname, "cache");

module.exports = {
  config: {
    name: "imagen3",
    aliases: ["img3", "generate3"],
    version: "1.1",
    credits: "NeoKEX",
    cooldowns: 15,
    hasPermission: 0,
    description: "Generate image using Imagen3 AI",
    commandCategory: "ai",
    usages: "{pn} <english prompt>"
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const prompt = args.join(" ").trim();

    if (!prompt || !/^[\x00-\x7F]*$/.test(prompt)) {
      return api.sendMessage(
        "❌ English prompt dao, bangla / emoji dile kaj korbe na",
        threadID,
        messageID
      );
    }

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let imgPath;
    try {
      const apiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(prompt)}`;

      const res = await axios.get(apiUrl, {
        responseType: "stream",
        timeout: 60000
      });

      imgPath = path.join(CACHE_DIR, `imagen3_${Date.now()}.png`);
      const writer = fs.createWriteStream(imgPath);

      res.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.setMessageReaction("✅", messageID, () => {}, true);

      api.sendMessage(
        {
          body: "✨ Imagen3 image generated",
          attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => fs.unlinkSync(imgPath),
        messageID
      );

    } catch (err) {
      console.error("IMAGEN3 ERROR:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(
        "❌ Image generate korte parlam na, API down / slow hote pare",
        threadID,
        messageID
      );
    }
  }
};
