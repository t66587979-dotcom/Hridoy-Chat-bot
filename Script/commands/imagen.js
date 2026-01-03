const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const API_ENDPOINT = "https://dev.oculux.xyz/api/imagen3"; // যদি পরে কাজ না করে তাহলে অন্য API-তে চেঞ্জ করতে পারো

module.exports = {
  config: {
    name: "imagen",
    aliases: ["img", "generate", "im"],
    version: "1.2", // ছোট আপডেট
    author: "NeoKEX | optimized by Grok",
    countDown: 20,   // একটু বেশি রাখলাম কারণ জেনারেশন সময় লাগে
    role: 0,
    longDescription: "Generate image using Imagen3 model (English prompt recommended).",
    category: "ai-image",
    guide: {
      bn: "{pn} <প্রম্পট> (ইংরেজিতে ভালো রেজাল্ট দেয়)",
      en: "{pn} <prompt> (best results in English)"
    }
  },

  onStart: async function ({ message, args, event }) {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply("❌ দয়া করে একটা প্রম্পট দাও!\nউদাহরণ: {pn} A beautiful anime girl in cyberpunk city");
    }

    // ASCII চেক রিমুভ করলাম — অনেক API বাংলা/মিক্সড সাপোর্ট করে
    // যদি চাও তাহলে পরে আবার অ্যাড করতে পারো

    message.reaction("⏳", event.messageID);

    let tempFilePath = null;

    try {
      const fullApiUrl = `\( {API_ENDPOINT}?prompt= \){encodeURIComponent(prompt)}`;

      const response = await axios.get(fullApiUrl, {
        responseType: 'stream',
        timeout: 60000 // ৬০ সেকেন্ড — বেশিরভাগ ক্ষেত্রে যথেষ্ট
      });

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      const cacheDir = path.join(__dirname, 'cache');
      await fs.ensureDir(cacheDir); // mkdirp এর পরিবর্তে fs-extra এর ensureDir (আরো সেফ)

      tempFilePath = path.join(cacheDir, `img3_${Date.now()}.png`);

      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', (err) => {
          writer.close();
          reject(err);
        });
      });

      message.reaction("✅", event.messageID);

      await message.reply({
        body: `✨ Imagen3 দিয়ে জেনারেট করা হয়েছে!\n\nপ্রম্পট: \( {prompt}\n\n(জেনারেশন সময়: ~ \){(Date.now() - event.timestamp) / 1000 | 0}s)`,
        attachment: fs.createReadStream(tempFilePath)
      });

    } catch (error) {
      message.reaction("❌", event.messageID);

      let errMsg = "ইমেজ জেনারেট করতে সমস্যা হয়েছে 😔";
      
      if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        errMsg = "জেনারেশনের সময় শেষ হয়ে গেছে। সিম্পল প্রম্পট দিয়ে আবার চেষ্টা করো।";
      } else if (error.response) {
        if (error.response.status === 400) {
          errMsg = "API রিকোয়েস্ট ভুল (bad request) — প্রম্পট চেক করো।";
        } else if (error.response.status === 429) {
          errMsg = "অনেক রিকোয়েস্ট করেছ — কিছুক্ষণ পর আবার চেষ্টা করো (rate limit)।";
        } else {
          errMsg = `API এরর: ${error.response.status}`;
        }
      } else if (error.message) {
        errMsg = error.message;
      }

      console.error("[Imagen3 Error]", error);
      message.reply(`❌ ${errMsg}`);

    } finally {
      // ফাইল ডিলিট — try-catch দিয়ে সেফ করা
      if (tempFilePath && await fs.pathExists(tempFilePath)) {
        try {
          await fs.unlink(tempFilePath);
        } catch (unlinkErr) {
          console.warn("[Imagen3] Cleanup failed:", unlinkErr);
        }
      }
    }
  }
};
