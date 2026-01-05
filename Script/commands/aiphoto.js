const axios = require("axios");

module.exports = {
  config: {
    name: "aiphoto",
    aliases: ["aip", "flux", "aigen"],
    version: "1.1",              // ছোট আপডেট
    author: "Neoaz ゐ | optimized",
    countDown: 25,               // বাড়ানো হয়েছে কারণ Render-এ wake-up + gen সময় লাগে
    role: 0,
    shortDescription: { en: "Generate AI image with Flux (AI Photo)" },
    longDescription: { 
      en: "Generate images using Flux-based AI Photo model (may be slow on first use)",
      bn: "Flux মডেল দিয়ে AI ছবি তৈরি করো (প্রথমবার স্লো হতে পারে)"
    },
    category: "image",
    guide: {
      en: "{pn} <prompt>\nExample: {pn} cyberpunk city at night",
      bn: "{pn} <প্রম্পট>\nউদাহরণ: {pn} রাতের সাইবারপাঙ্ক শহর"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage("❌ দয়া করে একটা প্রম্পট দাও!", event.threadID, event.messageID);
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const res = await axios.get("https://fluxcdibai-1.onrender.com/generate", {
        params: { 
          prompt: prompt,
          model: "ai photo"   // অরিজিনাল রাখা হয়েছে
        },
        timeout: 90000          // ৯০ সেকেন্ড — Render wake-up + gen এর জন্য সেফ
      });

      const data = res.data;
      const resultUrl = data?.data?.imageResponseVo?.url;

      if (!resultUrl || !resultUrl.startsWith("http")) {
        throw new Error("Invalid or no image URL returned");
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage({
        body: `✨ AI Photo (Flux) দিয়ে জেনারেট করা হয়েছে!\n\nপ্রম্পট: ${prompt}`,
        attachment: await global.utils.getStreamFromURL(resultUrl)
      }, event.threadID, event.messageID);

    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      let errMsg = "ইমেজ তৈরি করতে সমস্যা হয়েছে 😔";

      if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
        errMsg = "জেনারেশনের সময় শেষ হয়ে গেছে। API স্লো/ডাউন — ১-২ মিনিট পর আবার চেষ্টা করো।";
      } else if (err.response) {
        if (err.response.status === 503 || err.response.status === 429) {
          errMsg = "সার্ভার ব্যস্ত বা ডাউন (503/Rate limit)। পরে আবার ট্রাই করো।";
        } else if (err.response.status >= 400 && err.response.status < 500) {
          errMsg = "প্রম্পট বা রিকোয়েস্টে সমস্যা — অন্য প্রম্পট দিয়ে চেষ্টা করো।";
        }
      }

      console.error("[aiphoto Error]", err.message || err);
      return api.sendMessage(`❌ ${errMsg}`, event.threadID, event.messageID);
    }
  }
};
