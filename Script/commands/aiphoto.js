const axios = require("axios");

const FAL_API_KEY = "your_fal_ai_key_here"; // এখানে তোমার fal.ai API key পেস্ট করো
const FAL_ENDPOINT = "https://fal.run/fal-ai/flux/schnell"; // ফাস্ট মডেল (schnell), চাইলে dev/pro চেঞ্জ করতে পারো

module.exports = {
  config: {
    name: "aiphoto",
    aliases: ["aip", "flux", "aigen"],
    version: "1.2",
    author: "Neoaz ゐ | updated with fal.ai",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Generate AI image with Flux (fal.ai)" },
    longDescription: { en: "High-quality Flux AI image generation" },
    category: "image",
    guide: {
      bn: "{pn} <প্রম্পট>\nউদাহরণ: {pn} futuristic city at sunset, cyberpunk style",
      en: "{pn} <prompt>\nExample: {pn} A majestic dragon in a fantasy forest"
    }
  },

  onStart: async function ({ message, event, args }) {
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return message.reply("❌ প্রম্পট দাও! উদাহরণ: aip A beautiful anime girl in rainy Tokyo");
    }

    await message.reaction("⏳", event.messageID);

    try {
      const response = await axios.post(
        FAL_ENDPOINT,
        { prompt: prompt },
        {
          headers: {
            Authorization: `Key ${FAL_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 60000
        }
      );

      const imageUrl = response.data.images?.[0]?.url;

      if (!imageUrl) {
        throw new Error("No image URL returned");
      }

      await message.reaction("✅", event.messageID);

      await message.reply({
        body: `✨ Flux AI দিয়ে জেনারেট করা হয়েছে (fal.ai)!\n\nপ্রম্পট: ${prompt}`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

    } catch (err) {
      console.error("[aiphoto fal.ai Error]", err.message || err);

      let errMsg = "ইমেজ জেনারেট করতে সমস্যা 😔";

      if (err.response?.status === 401 || err.response?.status === 403) {
        errMsg = "API কী ভুল বা এক্সপায়ার্ড। fal.ai থেকে নতুন কী নাও।";
      } else if (err.code === 'ETIMEDOUT') {
        errMsg = "জেনারেশন টাইমআউট — পরে আবার চেষ্টা করো।";
      } else if (err.response?.status === 429) {
        errMsg = "ক্রেডিট শেষ বা রেট লিমিট। fal.ai-তে চেক করো।";
      }

      await message.reaction("❌", event.messageID);
      return message.reply(`❌ ${errMsg}\n(ডিটেইল: ${err.message || "Unknown"})`);
    }
  }
};
