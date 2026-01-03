const axios = require("axios");

module.exports = {
  config: {
    name: "aiphoto",
    aliases: ["aip", "aigen", "fluxphoto"],
    version: "1.1",          // ছোট আপডেট
    author: "Neoaz ゐ | optimized",
    countDown: 20,           // বাড়ানো হয়েছে কারণ Flux জেনারেশন সময় লাগে
    role: 0,
    shortDescription: { en: "Generate AI image with AI Photo (Flux)" },
    longDescription: { en: "Generate high-quality images using Flux-based AI Photo model" },
    category: "image",
    guide: {
      bn: "{pn} <প্রম্পট>\nউদাহরণ: {pn} একটা সুন্দর সূর্যাস্তের সমুদ্র সৈকত",
      en: "{pn} <prompt>\nExample: {pn} A beautiful cyberpunk city at night"
    }
  },

  onStart: async function ({ message, event, args }) {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply("❌ প্রম্পট দাও!\nউদাহরণ: aip A majestic dragon flying over mountains");
    }

    // রিয়্যাকশন — waiting
    await message.reaction("⏳", event.messageID);

    try {
      const res = await axios.get("https://fluxcdibai-1.onrender.com/generate", {
        params: { 
          prompt: prompt,
          model: "ai photo"   // অরিজিনাল রাখা হয়েছে
        },
        timeout: 90000          // ৯০ সেকেন্ড — Render-এর জন্য যথেষ্ট
      });

      const data = res.data;
      const imageUrl = data?.data?.imageResponseVo?.url;

      if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
        throw new Error("No valid image URL returned from API");
      }

      // সাকসেস রিয়্যাকশন
      await message.reaction("✅", event.messageID);

      await message.reply({
        body: `✨ AI Photo (Flux) দিয়ে জেনারেট করা হয়েছে!\n\nপ্রম্পট: ${prompt}`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

    } catch (err) {
      console.error("[aiphoto Error]", err.message || err);

      let errMsg = "ইমেজ জেনারেট করতে সমস্যা হয়েছে 😔";

      if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
        errMsg = "জেনারেশনের সময় শেষ। API স্লো/ডাউন — পরে আবার চেষ্টা করো।";
      } else if (err.response) {
        if (err.response.status === 503 || err.response.status === 429) {
          errMsg = "API সার্ভার ডাউন বা ব্যস্ত (503/Rate limit)। কিছুক্ষণ অপেক্ষা করো।";
        } else if (err.response.status >= 400 && err.response.status < 500) {
          errMsg = "রিকোয়েস্ট ভুল — প্রম্পট চেক করো বা API চেঞ্জ করতে হবে।";
        }
      }

      await message.reaction("❌", event.messageID);
      return message.reply(`❌ ${errMsg}\n\n(টেকনিক্যাল: ${err.message || "Unknown error"})`);
    }
  }
};
