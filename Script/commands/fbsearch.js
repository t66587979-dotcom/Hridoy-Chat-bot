module.exports.config = {
  name: "fbsearch",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "rX (Fixed by Grok)",
  description: "Search Facebook users by name (limited due to FB restrictions)",
  commandCategory: "utilities",
  usages: "fbsearch <keyword>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const keyword = args.join(" ");
  if (!keyword) return api.sendMessage("দয়া করে একটা নাম/কীওয়ার্ড দাও!", event.threadID, event.messageID);

  api.sendMessage("সার্চ হচ্ছে... দাঁড়াও 😊", event.threadID, event.messageID);

  try {
    // FCA-এর getUserID ফাংশন (যদি তোমার lib-এ থাকে)
    api.getUserID(keyword, (err, data) => {
      if (err) {
        console.error(err);
        return api.sendMessage("কোনো ইউজার পাওয়া যায়নি বা এরর হয়েছে 😔", event.threadID, event.messageID);
      }

      if (data.length === 0) {
        return api.sendMessage("কোনো ম্যাচিং ইউজার পাওয়া যায়নি!", event.threadID, event.messageID);
      }

      let msg = "পাওয়া গেছে কয়েকটা ইউজার:\n\n";
      data.slice(0, 5).forEach((user, index) => {
        msg += `${index + 1}. ${user.name}\nUID: \( {user.userID}\nপ্রোফাইল: https://www.facebook.com/ \){user.userID}\n\n`;
      });

      api.sendMessage(msg, event.threadID, event.messageID);
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("সার্চ করতে সমস্যা হয়েছে 😔 আবার ট্রাই করো!", event.threadID, event.messageID);
  }
};