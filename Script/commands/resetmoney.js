const economy = require("./Economy.js");

module.exports.config = {
  name: "resetmoney",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Hridoy Hossen",
  description: "Reset any user's coin balance (Special ID only)",
  commandCategory: "Games",
  usages: "resetmoney @mention / UID",
  cooldowns: 5
};

const SPECIAL_ID = "100048786044500"; // 💎 তোমার স্পেশাল আইডি

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, messageID, senderID, mentions } = event;

  if (senderID !== SPECIAL_ID)
    return api.sendMessage("❌ শুধু Special ID ইউজারই ব্যালান্স রিসেট করতে পারবে!", threadID, messageID);

  let targetID;

  if (mentions && Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else if (args[0]) {
    targetID = args[0];
  } else {
    return api.sendMessage("⚠️ যাকে রিসেট করতে চাও তাকে mention করো বা UID দাও!", threadID, messageID);
  }

  if (!economy.userExists(targetID))
    return api.sendMessage("❌ এই ইউজারের কোনো ব্যালান্স রেকর্ড নেই!", threadID, messageID);

  // Reset balance to 5000 (normal user)
  economy.setBalance(targetID, 5000);

  const nameTarget = global.data.userName.get(targetID) || (await Users.getNameUser(targetID));
  return api.sendMessage(`✅ ${nameTarget}-এর ব্যালান্স সফলভাবে রিসেট করা হয়েছে! (5000 কয়েন)`, threadID, messageID);
};
