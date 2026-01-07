const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let cachedApiUrl = null;

const getBaseApiUrl = async () => {
  if (cachedApiUrl) return cachedApiUrl;

  try {
    const res = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
    cachedApiUrl = res.data.api;
    return cachedApiUrl;
  } catch (error) {
    console.error("Failed to load baseApiUrl:", error.message);
    throw new Error("API endpoint লোড করতে পারিনি। পরে ট্রাই করো!");
  }
};

module.exports.config = {
  name: "gemini",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Dipto (Improved by Grok)",
  description: "Google Gemini AI (text + image support)",
  commandCategory: "google",
  usePrefix: true,
  usages: "gemini <prompt> or reply to image + gemini <prompt>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ").trim();

  // Loading message
  const loading = await api.sendMessage("Gemini চিন্তা করছে... দাঁড়াও 😊", event.threadID, event.messageID);

  try {
    const baseUrl = await getBaseApiUrl();

    if (event.type === "message_reply" && event.messageReply.attachments?.length > 0) {
      // Image + prompt
      const imgUrl = event.messageReply.attachments[0].url;
      if (!prompt) throw new Error("Image reply-এ প্রম্পট দাও (যেমন: describe this image)");

      const res = await axios.get(`\( {baseUrl}/gemini?prompt= \){encodeURIComponent(prompt)}&url=${encodeURIComponent(imgUrl)}`);
      const reply = res.data.dipto || "No response from Gemini";

      api.sendMessage(reply, event.threadID, () => api.unsendMessage(loading.messageID), event.messageID);
    } else {
      // Text only
      if (!prompt) {
        api.unsendMessage(loading.messageID);
        return api.sendMessage("প্রম্পট দাও! উদাহরণ: gemini hello how are you", event.threadID, event.messageID);
      }

      const res = await axios.get(`\( {baseUrl}/gemini?prompt= \){encodeURIComponent(prompt)}`);
      const reply = res.data.dipto || "No response from Gemini";

      api.sendMessage(reply, event.threadID, () => api.unsendMessage(loading.messageID), event.messageID);
    }
  } catch (error) {
    console.error("Gemini error:", error.message);
    api.sendMessage(`দুঃখিত! এরর হয়েছে: ${error.message.includes("404") ? "API endpoint পাওয়া যায়নি" : "Gemini প্রসেস করতে পারেনি"} 😔 আবার ট্রাই করো।`, event.threadID, () => api.unsendMessage(loading.messageID), event.messageID);
  }
};