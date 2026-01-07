const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "genimage", // "create" এর বদলে এটা ভালো, কনফ্লিক্ট এড়ানোর জন্য
  version: "1.1.0",
  hasPermssion: 0,
  credits: "🔰Rahat🔰 (Improved by Grok)",
  description: "Generate AI image using Pollinations.ai",
  commandCategory: "create-images",
  usages: "genimage <your prompt> (e.g. genimage a beautiful sunset over mountains)",
  cooldowns: 10 // বাড়ানো যাতে rate limit এড়ানো যায়
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage("দয়া করে একটা প্রম্পট দাও!\nউদাহরণ: genimage a cute cat wearing sunglasses", threadID, messageID);
  }

  const loadingMsg = await api.sendMessage("জেনারেট হচ্ছে... দাঁড়াও 🔰Rahat Bot🔰", threadID, messageID);

  try {
    // Prompt encode + URL safe করা
    const encodedPrompt = encodeURIComponent(prompt);
    const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=1024&height=1024&nologo=true`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 60000 });

    if (response.status !== 200) {
      throw new Error("Pollinations API returned non-200 status");
    }

    const tempPath = path.join(__dirname, "cache", `gen_${Date.now()}.png`);

    fs.writeFileSync(tempPath, Buffer.from(response.data));

    await api.sendMessage({
      body: `🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰\n𝐒𝐮𝐜𝐜𝐞𝐬𝐟𝐮𝐥 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐈𝐦𝐚𝐠𝐞!\n\nপ্রম্পট: ${prompt}`,
      attachment: fs.createReadStream(tempPath)
    }, threadID, () => fs.unlinkSync(tempPath), messageID);

    // Loading মেসেজ ডিলিট (যদি চাও)
    api.unsendMessage(loadingMsg.messageID).catch(() => {});

  } catch (error) {
    console.error("Genimage error:", error.message);
    api.sendMessage(`এরর: ${error.message.includes("timeout") ? "জেনারেশন অনেক সময় নিচ্ছে 😔" : "ইমেজ জেনারেট করতে পারিনি। আবার ট্রাই করো!"}`, threadID, messageID);
    api.unsendMessage(loadingMsg.messageID).catch(() => {});
  }
};