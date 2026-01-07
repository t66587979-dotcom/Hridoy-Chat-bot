const axios = require("axios");

module.exports.config = {
  name: "simsimi",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "rX Abdullah (Improved by Grok)",
  description: "সিমসিমি চ্যাট + অ্যানসার দিয়ে প্রশ্ন খোঁজা (Mirai-style)",
  commandCategory: "Fun",
  usages: "simsimi <কথা> বা simsimi <অ্যানসার>",
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

const API_URL = "https://rx-simisimi-api-tllc.onrender.com";

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(" ").trim();

  if (!input) {
    return api.sendMessage("❌ কিছু লিখে পাঠাও! উদাহরণ: simsimi হাই কেমন আছো?", threadID, messageID);
  }

  // লোডিং মেসেজ
  const loading = await api.sendMessage("সিমসিমি চিন্তা করছে... 🤖", threadID, messageID);

  try {
    // Step 1: Answer → Question search
    const questionRes = await axios.post(`${API_URL}/findQuestion`, { answer: input }, { timeout: 10000 });

    if (questionRes.data && questionRes.data.question) {
      api.unsendMessage(loading.messageID);
      return api.sendMessage(
        `✅ তোমার অ্যানসারের জন্য প্রশ্ন পাওয়া গেছে!\n\n` +
        `প্রশ্ন: ${questionRes.data.question}\n` +
        `অ্যানসার: ${input}`,
        threadID, messageID
      );
    } else if (questionRes.data && questionRes.data.message) {
      api.unsendMessage(loading.messageID);
      return api.sendMessage(`❌ ${questionRes.data.message}`, threadID, messageID);
    }

    // Step 2: Normal SimSimi chat (fallback)
    const chatRes = await axios.get(`${API_URL}/simsimi`, { params: { text: input }, timeout: 10000 });
    const reply = chatRes.data.response || "🤖 কিছু বলতে পারছি না এখন 😅";

    api.unsendMessage(loading.messageID);
    return api.sendMessage(reply, threadID, messageID);

  } catch (error) {
    console.error("SimSimi error:", error.message);
    api.unsendMessage(loading.messageID);
    return api.sendMessage(
      "⚠️ সিমসিমির সাথে কথা বলতে সমস্যা হয়েছে 😔\n" +
      "আবার ট্রাই করো বা পরে চেক করো!",
      threadID, messageID
    );
  }
};