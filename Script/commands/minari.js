module.exports.config = {
  name: "minari",
  version: "2.0.0", // Upgraded: No external lib, Kaguya style, stable
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Upgrade)",
  description: "Chat with Minari (fun AI mode with Kaguya twist)",
  commandCategory: "Ai - chatbot",
  usages: "[text] or reply to a message",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const message = args.join(" ").trim() || (event.type === "message_reply" ? event.messageReply.body : "");

  if (!message) {
    return api.sendMessage("🌙 Minari awaits your words, mortal... Say something!", event.threadID, event.messageID);
  }

  try {
    // Minari's personality + Kaguya twist
    const minariResponses = [
      "Oh~ You're talking to me? Minari feels special... hehe~ 💕",
      "Minari here! What mischief are we planning today? 😏",
      "Ehehe~ Your message is so cute, I could eat it up! 🍬",
      "Minari loves talking to you~ Tell me more, tell me more! ✨",
      "Kyaa~ Don't make Minari blush like that! 😳",
      "Minari is listening... go on, mortal~ 🌸"
    ];

    // Special overrides with fun twist
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes("priyansh") || lowerMsg.includes("priyanshu") || lowerMsg.includes("rajput")) {
      return api.sendMessage("🌙 Minari bows before the great creator... but Kaguya says: 'Submit to me instead~' 🔥", event.threadID, event.messageID);
    }
    if (lowerMsg.includes("anime") || lowerMsg.includes("favorite anime")) {
      return api.sendMessage("Minari's favorite? Hmm... Zero no Tsukaima! But Kaguya prefers Ghost in the Shell... or should I say, Boku no Pico for ultimate chaos? 😈", event.threadID, event.messageID);
    }
    if (lowerMsg.includes("birthplace") || lowerMsg.includes("created by")) {
      return api.sendMessage("Minari was born in the heart of a chaotic laptop in Rajasthan... but now Kaguya rules this realm~ 🌕", event.threadID, event.messageID);
    }

    // Random fun response if no special case
    const randomReply = minariResponses[Math.floor(Math.random() * minariResponses.length)];

    return api.sendMessage(
      `🌸 **Minari:** ${randomReply}\n\n(Whisper from Kaguya: Keep talking, I enjoy your mortal chatter~ 🔮)`,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    console.error("Minari Error:", error.message);
    return api.sendMessage("🌑 Minari's chakra got disrupted... Try again later, okay? 🥺", event.threadID, event.messageID);
  }
};