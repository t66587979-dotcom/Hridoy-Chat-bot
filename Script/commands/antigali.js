let antiGaliSettings = {}; // threadID -> { enabled: boolean, offenses: { userID: { count: number, lastOffenseTime: number } } }

const badWords = [
  "কুত্তার বাচ্চা","মাগী","মাগীচোদ","চোদা","চুদ","চুদা","চুদামারান",
  "চুদির","চুত","চুদি","চুতমারানি","চুদের বাচ্চা","shawya","বালের","বালের ছেলে","বালছাল",
  "বালছাল কথা","মাগীর ছেলে","রান্ডি","রান্দি","রান্দির ছেলে","বেশ্যা","বেশ্যাপনা",
  "Khanki","mgi","তোকে চুদি","তুই চুদ","fuck","f***","fck","mc","bc","xhudas","abal","fucking",
  "motherfucker","guyar","mfer","motherfuer","mthrfckr","putki","abdullak chudi","abdullak xudi","jawra","bot chudi","bastard",
  "bessa","hijra","a*hole","dick","fu***k","cock","prick","pussy","Mariak cudi","cunt","fag","faggot","retard",
  "magi","magir","magirchele","land","randir","randirchele","chuda","chud","chudir","chut","chudi","chutmarani",
  "tor mayer","tor baper","toke chudi","chod","jairi","khankir pola","khanki magi"
];

module.exports.config = {
  name: "antigali",
  version: "1.0.0",
  hasPermssion: 1, // গ্রুপ অ্যাডমিন ওনলি (চেঞ্জ করতে পারো 0 করে সবাই চালাতে)
  credits: "Rx Abdullah (Modified by Grok for Hridoy Bot)",
  description: "Anti-gali system: Warn on bad words, auto-unsend, kick on 3rd offense (checks bot & user admin status)",
  commandCategory: "moderation",
  usages: "!antigali on/off | !antigali status | !antigali reset <@mention>",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
  if (event.body === undefined || event.body === "") return;

  const threadID = event.threadID;
  const userID = event.senderID;
  const botID = api.getCurrentUserID();

  // Initialize per-thread settings if not exist
  if (!antiGaliSettings[threadID]) {
    antiGaliSettings[threadID] = { enabled: false, offenses: {} };
  }

  const settings = antiGaliSettings[threadID];
  if (!settings.enabled) return;

  const message = event.body.toLowerCase();

  // Check if message contains bad word
  if (!badWords.some(word => message.includes(word.toLowerCase()))) return;

  // Initialize user offenses
  if (!settings.offenses[userID]) {
    settings.offenses[userID] = { count: 0, lastOffenseTime: Date.now() };
  }

  const userOffense = settings.offenses[userID];
  const now = Date.now();

  // Optional: Reset count if last offense > 10 minutes ago
  if (now - userOffense.lastOffenseTime > 10 * 60 * 1000) { // 10 min
    userOffense.count = 0;
  }

  userOffense.count += 1;
  userOffense.lastOffenseTime = now;

  const count = userOffense.count;

  let userInfo;
  try {
    userInfo = await api.getUserInfo(userID);
  } catch (e) {
    userInfo = { [userID]: { name: "Unknown User" } };
  }
  const userName = userInfo[userID]?.name || "User";

  const frame = (n, extra = '') => `
╔══════════════════════════════╗
⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚 #${n}
User: ${userName} (UID: ${userID})
Prohibited word detected
Count: ${n}/3
${extra}
╚══════════════════════════════╝`;

  if (count === 1) {
    api.sendMessage(frame(1, '🛑 Unsended immediately please'), threadID, event.messageID);
  } else if (count === 2) {
    api.sendMessage(frame(2, '⚠️ Next will be removal! Unsended now'), threadID, event.messageID);
  }

  // Auto-unsend after 60 seconds
  setTimeout(() => {
    api.unsendMessage(event.messageID).catch(() => {});
  }, 60000);

  if (count >= 3) {
    // Check bot is admin
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (e) {
      threadInfo = { adminIDs: [] };
    }

    const isBotAdmin = threadInfo.adminIDs.some(id => String(id) === String(botID));
    if (!isBotAdmin) {
      userOffense.count = 2; // Reset to allow retry
      return api.sendMessage(`Bot is not group admin! Cannot kick. Promote bot first.`, threadID);
    }

    // Check if user is admin
    const isUserAdmin = threadInfo.adminIDs.some(id => String(id) === String(userID));
    if (isUserAdmin) {
      userOffense.count = 2;
      return api.sendMessage(`Cannot kick admin user: ${userName} (UID: ${userID})`, threadID);
    }

    // Kick
    try {
      await api.removeUserFromGroup(userID, threadID);
      delete settings.offenses[userID]; // Clear after kick
      api.sendMessage(`🚨 Removed ${userName} (UID: ${userID}) for repeated bad words.`, threadID);
    } catch (err) {
      userOffense.count = 2;
      api.sendMessage(`Failed to kick ${userName}. Check bot permissions.`, threadID);
    }
  }
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;

  if (!antiGaliSettings[threadID]) {
    antiGaliSettings[threadID] = { enabled: false, offenses: {} };
  }

  const settings = antiGaliSettings[threadID];

  if (args[0] === "on") {
    settings.enabled = true;
    return api.sendMessage("✅ Anti-Gali is now ON for this group.", event.threadID);
  }

  if (args[0] === "off") {
    settings.enabled = false;
    return api.sendMessage("❌ Anti-Gali is now OFF for this group.", event.threadID);
  }

  if (args[0] === "status") {
    return api.sendMessage(`Anti-Gali status: ${settings.enabled ? "ON" : "OFF"}\nOffenses tracked: ${Object.keys(settings.offenses).length}`, event.threadID);
  }

  if (args[0] === "reset" && event.mentions) {
    const mentionedID = Object.keys(event.mentions)[0];
    if (settings.offenses[mentionedID]) {
      delete settings.offenses[mentionedID];
      return api.sendMessage(`Reset offenses for mentioned user.`, event.threadID);
    } else {
      return api.sendMessage(`No offenses found for that user.`, event.threadID);
    }
  }

  return api.sendMessage("Usage:\n!antigali on\n!antigali off\n!antigali status\n!antigali reset @user", event.threadID);
};