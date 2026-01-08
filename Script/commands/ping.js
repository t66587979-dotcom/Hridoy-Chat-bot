module.exports.config = {
  name: "ping",
  version: "2.0.0", // Kaguya Upgrade: Better error handling + theme
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Style)",
  description: "Tag all members in the group (exclude AFK & bot/self)",
  commandCategory: "system",
  usages: "[text] (optional)",
  cooldowns: 80
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const botID = api.getCurrentUserID();
    const senderID = event.senderID;
    const threadID = event.threadID;
    const messageID = event.messageID;

    // Get AFK list if exists
    const afkList = global.moduleData["afk"]?.afkList || {};
    const afkUserIDs = Object.keys(afkList);

    // All participant IDs except bot and sender
    let userIDs = event.participantIDs.filter(id => id !== botID && id !== senderID);

    // Exclude AFK users
    userIDs = userIDs.filter(id => !afkUserIDs.includes(id));

    if (userIDs.length === 0) {
      return api.sendMessage("🌙 No one to ping! Everyone is AFK or it's just us~", threadID, messageID);
    }

    // Custom text or default
    const customText = args.join(" ").trim();
    let body = customText ? `🌙 ${customText}\n\n` : "🌙 Kaguya summons everyone!\n\n";

    // Mentions array
    const mentions = [];

    // Add invisible characters + mentions
    userIDs.forEach(id => {
      body += "‎"; // invisible char for mention offset
      mentions.push({ id, tag: "‎", fromIndex: body.length - 1 });
    });

    // Add Kaguya flair
    body += "\nKaguya Ōtsutsuki has spoken. Bow before me~ 🔮✨";

    // Send message with mentions
    return api.sendMessage({ body, mentions }, threadID, messageID);

  } catch (error) {
    console.error("Ping Command Error:", error);
    return api.sendMessage(
      "🌑 Chakra disrupted! Failed to ping everyone.\nError: " + error.message + "\nTry again later~",
      event.threadID,
      event.messageID
    );
  }
};