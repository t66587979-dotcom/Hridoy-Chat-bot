module.exports.config = {
  name: "typingtest",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "rX Abdullah (Improved by Grok)",
  description: "টাইপিং অ্যানিমেশন টেস্ট (১০ সেকেন্ড ধরে \"typing...\" দেখাবে)",
  commandCategory: "system",
  usages: "!typingtest",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // টাইপিং ইন্ডিকেটর চালু করা
    await api.sendTypingIndicatorV2(true, threadID);

    // ১০ সেকেন্ড অপেক্ষা (typing চলতে থাকবে)
    await new Promise(resolve => setTimeout(resolve, 10000));

    // টাইপিং বন্ধ করা
    await api.sendTypingIndicatorV2(false, threadID);

    // ফাইনাল মেসেজ পাঠানো
    await api.sendMessage(
      "𝐭𝐮𝐦𝐚𝐤𝐞 𝐚𝐦𝐢 𝐫𝐚𝐢𝐭𝐞 𝐯𝐚𝐥𝐨𝐩𝐚𝐬𝐢 ✨\n\n" +
      "টাইপিং অ্যানিমেশন টেস্ট সফল! 😎\n" +
      "(১০ সেকেন্ড ধরে \"typing...\" দেখিয়েছে)",
      threadID, messageID
    );

  } catch (err) {
    console.error("Typing test error:", err.message);

    // যদি typing indicator কাজ না করে তাহলে সাধারণ মেসেজ
    api.sendMessage(
      "❌ টাইপিং ইন্ডিকেটরে সমস্যা হয়েছে 😔\n" +
      "তবে ভালোবাসি তোমাকে রাইতে ✨",
      threadID, messageID
    );
  }
};