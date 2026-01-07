const axios = require("axios");

module.exports.config = {
  name: "ar",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Islamick Chat (Improved by Grok)",
  description: "টেক্সটকে আরবি (Arabic) ভাষায় অনুবাদ করো (রিপ্লাই সাপোর্ট)",
  commandCategory: "মিডিয়া",
  usages: "ar <টেক্সট> বা রিপ্লাই করে ar",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

const GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  let textToTranslate = args.join(" ").trim();

  // রিপ্লাই থেকে টেক্সট নেওয়া
  if (event.type === "message_reply" && event.messageReply.body) {
    textToTranslate = event.messageReply.body.trim();
  }

  if (!textToTranslate) {
    return api.sendMessage(
      "⚠️ অনুবাদ করার জন্য কিছু লিখো বা কোনো মেসেজ রিপ্লাই করো!",
      threadID, messageID
    );
  }

  // লোডিং মেসেজ
  const loading = await api.sendMessage("অনুবাদ হচ্ছে... ⏳", threadID, messageID);

  try {
    const response = await axios.get(GOOGLE_TRANSLATE_URL, {
      params: {
        client: "gtx",
        sl: "auto",           // সোর্স ল্যাঙ্গুয়েজ অটো ডিটেক্ট
        tl: "ar",             // টার্গেট ল্যাঙ্গুয়েজ: আরবি
        dt: "t",              // ট্রান্সলেশন টেক্সট
        q: textToTranslate
      },
      timeout: 10000
    });

    const result = response.data;
    if (!result || !result[0] || !result[0][0]) {
      throw new Error("কোনো অনুবাদ পাওয়া যায়নি");
    }

    // সব অংশ জোড়া লাগানো
    let translated = "";
    result[0].forEach(item => {
      if (item[0]) translated += item[0];
    });

    // সোর্স ল্যাঙ্গুয়েজ (যদি দরকার হয়)
    let sourceLang = result[2] || "অজানা";

    api.unsendMessage(loading.messageID);
    return api.sendMessage(
      `**অনুবাদিত টেক্সট (আরবি):** 🌙\n\n${translated}\n\n` +
      `(অরিজিনাল: ${textToTranslate})\n` +
      `সোর্স ল্যাঙ্গুয়েজ: ${sourceLang}`,
      threadID, messageID
    );

  } catch (error) {
    console.error("Translation error:", error.message);
    api.unsendMessage(loading.messageID);
    return api.sendMessage(
      "⚠️ অনুবাদ করতে সমস্যা হয়েছে 😔\n" +
      "কারণ: " + (error.message.includes("timeout") ? "সময় শেষ" : "সার্ভার সমস্যা") +
      "\nআবার ট্রাই করো!",
      threadID, messageID
    );
  }
};