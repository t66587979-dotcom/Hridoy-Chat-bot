module.exports.config = {
  name: "pooh",
  version: "2.0.0", // Kaguya Upgrade: Memory-safe, better handling
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Style)",
  description: "Generate Pooh Bear meme with two texts (text1 | text2)",
  commandCategory: "image",
  usages: "[text1 | text2]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const threadID = event.threadID;
  const messageID = event.messageID;

  const input = args.join(" ").trim();
  if (!input || !input.includes("|")) {
    return api.sendMessage(
      "🌙 Usage: .pooh text1 | text2\nExample: .pooh Kaguya is cute | Submit to me mortal~",
      threadID,
      messageID
    );
  }

  const [text1, text2] = input.split("|").map(t => t.trim());

  if (!text1 || !text2) {
    return api.sendMessage("🌑 Both texts are required! Format: text1 | text2", threadID, messageID);
  }

  try {
    const apiUrl = `https://api.popcat.xyz/pooh?text1=\( {encodeURIComponent(text1)}&text2= \){encodeURIComponent(text2)}`;

    // Stream directly from API (no file save needed, but temp cache for send)
    const tempPath = path.join(__dirname, "cache", "pooh_temp.png");

    const response = await axios.get(apiUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(tempPath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Send the image
    await api.sendMessage({
      body: `🌸 **Minari & Kaguya's Pooh Meme** 🌸\n` +
            `Text1: ${text1}\n` +
            `Text2: ${text2}\n\n` +
            `"Bow before the Rabbit Goddess's wisdom... or face the honey jar~ 🍯"`,
      attachment: fs.createReadStream(tempPath)
    }, threadID, () => fs.unlinkSync(tempPath), messageID);

  } catch (error) {
    console.error("Pooh Meme Error:", error.message);
    return api.sendMessage(
      "🌑 Chakra disrupted! Failed to generate Pooh meme.\n" +
      `Error: ${error.message}\n` +
      "Try again or check the text length.",
      threadID,
      messageID
    );
  }
};