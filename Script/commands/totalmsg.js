module.exports.config = {
  name: "totalmsg",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy Hossen + GPT Upgrade",
  description: "Shows total message count for all group members",
  commandCategory: "Group",
  usages: "[totalmsg]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.userInfo;

    let result = [];

    for (const user of members) {
      result.push({
        name: user.name || "Unknown User",
        count: user.message_count || 0
      });
    }

    // মেসেজ সংখ্যা অনুযায়ী বড় থেকে ছোট সাজানো
    result.sort((a, b) => b.count - a.count);

    let msg = "📊 *এই গ্রুপে কে কত মেসেজ দিয়েছে*\n━━━━━━━━━━━━━━━\n";

    for (let i = 0; i < result.length; i++) {
      msg += `${i + 1}. ${result[i].name} ➜ ${result[i].count} টি মেসেজ 💬\n`;
    }

    msg += "━━━━━━━━━━━━━━━\n🔥 Active মেম্বাররাই আসল হিরো 💪";

    api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ ডাটা আনতে সমস্যা হচ্ছে! গ্রুপ info নিতে পারিনি 😅", threadID);
  }
};
