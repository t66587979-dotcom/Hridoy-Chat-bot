module.exports.config = {
  name: "typingtest",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "rX Abdullah (Edited by ChatGPT)",
  description: "টাইপিং অ্যানিমেশন টেস্ট (১০ সেকেন্ড typing দেখাবে)",
  commandCategory: "system",
  usages: "!typingtest",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // typing indicator ON
    await api.sendTypingIndicatorV2(true, threadID);

    // wait 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));

    // typing indicator OFF
    await api.sendTypingIndicatorV2(false, threadID);

    // final message (only this)
    await api.sendMessage(
      "𝐭𝐮𝐦𝐚𝐤𝐞 𝐚𝐦𝐢 𝐫𝐚𝐢𝐭𝐞 𝐯𝐚𝐥𝐨𝐩𝐚𝐬𝐢 ✨",
      threadID,
      messageID
    );

  } catch (err) {
    console.error("Typing test error:", err.message);

    api.sendMessage(
      "𝐭𝐮𝐦𝐚𝐤𝐞 𝐚𝐦𝐢 𝐫𝐚𝐢𝐭𝐞 𝐯𝐚𝐥𝐨𝐩𝐚𝐬𝐢 ✨",
      threadID,
      messageID
    );
  }
};
