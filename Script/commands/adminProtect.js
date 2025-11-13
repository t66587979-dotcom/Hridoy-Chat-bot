// 🛡️ Global Admin Protection by Hridoy
// Protects all listed Admin IDs from every command or event 🔰

module.exports.config = {
  name: "adminProtect",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "Hridoy",
  description: "Globally protect specific Admin IDs from all commands",
  commandCategory: "system",
  usages: "auto protect",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "✅ Global Admin Protection system activated successfully! 🔰",
    event.threadID,
    event.messageID
  );
};

// ========= 🧱 MAIN GLOBAL PROTECTION ========= //
module.exports.handleEvent = async function ({ api, event }) {
  const adminIDs = [
    "100048786044500", // 🧠 Hridoy
    "100001162111551", // 🛡️ Another admin (replace/add more)
  ];

  // যদি কোনো command বা mention থাকে
  const body = (event.body || "").toLowerCase();

  // 🔍 Check if any Admin ID mentioned or tagged
  const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];
  const containsAdminMention =
    mentionedIDs.some((id) => adminIDs.includes(id)) ||
    adminIDs.some((id) => body.includes(id));

  // যদি mention বা ID detect করে — BLOCK
  if (containsAdminMention) {
    return api.sendMessage(
      `⚠️ এইটা আমার Boss ভাই 😎\nওনার উপর কোনো command কাজ করে না 🛡️`,
      event.threadID,
      event.messageID
    );
  }

  // 🔒 Prevent reactions or handleReply attacks on Admins
  if (event.type === "message_reaction" || event.type === "message_reply") {
    if (adminIDs.includes(event.senderID)) return;
  }

  return;
};

// ========= 🧱 GLOBAL COMMAND PROTECTION ========= //
module.exports.handleCommand = async function ({ api, event, commandName }) {
  const adminIDs = [
    "100048786044500",
    "100001162111551",
  ];

  // যদি target admin হয়, command cancel
  if (
    event.mentions &&
    Object.keys(event.mentions).some((id) => adminIDs.includes(id))
  ) {
    return api.sendMessage(
      `🚫 ${commandName.toUpperCase()} command blocked!\nReason: Target is an Admin 👑`,
      event.threadID,
      event.messageID
    );
  }

  return;
};
