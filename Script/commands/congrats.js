// congrats.js 😎🔥 — Funny Congratulation Command

module.exports.config = {
  name: "congrats",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy Khan + GPT-5 Upgrade",
  description: "Funny & savage congratulations for your friend 😆",
  commandCategory: "Fun",
  usages: "congrats [@tag or name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const mentionIDs = Object.keys(event.mentions);
  const name = mentionIDs.length > 0
    ? Object.values(event.mentions)[0]
    : args.join(" ") || "তুই";

  const targetID = mentionIDs.length > 0 ? mentionIDs[0] : null;

  // 🛡️ Optional Boss Protection
  const bossIDs = ["100048786044500", "100001162111551"];
  if (bossIDs.includes(targetID)) {
    return api.sendMessage(
      `🛡️ ঐটা আমার Boss ভাই! ওরে congrts দিতে হবে না .সে জন্ম থেকেই Legend🗿`,
      event.threadID,
      event.messageID
    );
  }

  // 🎉 Funny Congratulations Lines
  const congratsLines = [
    `${name}, congrats ভাই! তুই এমন কাজ করছিস, WiFi-ও signal বাড়িয়ে দিছে! 📶🔥`,
    `তোর success দেখে মশারা bite না দিয়ে clap দিচ্ছে 🦟👏`,
    `${name}, congrats! এখন থেকে তোর নাম হবে — “সিরিয়াসলি এইটা করল?!” 🤯🤣`,
    `তোর achievement এত rare যে Pokémon Go-তেও ধরা যায় না 😭😂`,
    `${name}, congrats ভাই! তুই এমন inspiration, আমার ঘুমও হিংসে করছে 😴🔥`,
    `তুই এমন কাজ করছিস, আম্মু বলেছে তোরে জামাই চাই 😭💍`,
    `তোর success দেখে Google বলছে “Are you human?” 🤖❓`,
    `${name}, congrats ভাই! তুই এখন legend, শুধু Wikipedia article বাকি 😎📚`,
    `তোর জন্য এখন NASA ডাটা সংগ্রহ করছে – "How did he do that?" 🚀🧠`,
    `${name}, congrats ভাই! তুই এমন vibe দিচ্ছিস, নোটিফিকেশনরাও jealous 📱😂`,

    `তোর success দেখে আমার calculator বলছে “Math error, impossible!” 🧮😵`,
    `${name}, congrats ভাই! তুই এমন hardworking যে clock-ও overtime নিচ্ছে 🕒💪`,
    `তোর success দেখে ghost রাও বলছে “we’re proud of you bro 👻❤️”`,
    `তুই এমন progress করছিস, আমার বট ভয় পাচ্ছে 😭🔥`,
    `তোর জন্য congrats দিতে গিয়ে আমার phone lag করছে 😩📱`,
    `${name}, congrats ভাই! তুই এত advance যে AI তোকে friend request পাঠাচ্ছে 🤖💌`,
    `তুই এমন success পেয়েছিস, আমার brain বলছে “404 motivation not found” 😭🧠`,
    `তোর success দেখে আমার WiFi বলছে “Connection unstable due to jealousy” 😂📶`,
    `${name}, congrats ভাই! তুই এখন inspiration + headache 😆🔥`,
    `তোর সাফল্যে cloud-ও data save করতে পারছে না ☁️💥`,

    `${name}, congrats ভাই! তুই এমন famous যে meme page তোকে sponsor করছে 😭😂`,
    `তোর নাম শুনলে alarm নিজে থেকে snooze হয়ে যায় 😴🤣`,
    `তুই এমন cool যে fridge-ও তোকে দেখে বলে “Respect, bro!” 🧊😎`,
    `তোর জন্য congrats পোস্ট দিতে গিয়ে keyboard গরম হয়ে গেল 🔥⌨️`,
    `${name}, congrats ভাই! তুই এমন rare species, discovery channel তোকে খুঁজতেছে 🦄📺`,
    `তোর success দেখে mirror বলছে “Bro, তুমি deserve করো না, কিন্তু congrats!” 🤣`,
    `তোর জন্য congrats দিতে গিয়ে আমার motivation balance শেষ 😩💀`,
    `${name}, congrats ভাই! তুই এমন legend যে light-ও তোকে দেখে glow কমিয়ে দেয় 💡😂`,
    `তোর success দেখে Google বলেছে: “Even I didn’t expect this.” 😭😂`,
    `তুই এমন ভাইব দিস, আমি toast বানাতে গিয়ে phone পুড়িয়ে ফেললাম 🍞🔥`,

    `${name}, congrats ভাই! তুই এমন কাজ করছিস, Elon Muskও বলছে “Hire him!” 🚀💼`,
    `তোর success দেখে emoji রাও upgrade চাইছে 😂🔄`,
    `${name}, congrats ভাই! তুই এমন rare যে horoscope বলছে “unavailable sign” ♒😆`,
    `তোর জন্য congrats দিতে গিয়ে আমার autocorrect clap করছে 👏📱`,
    `তুই এমন inspiration যে motivational speaker রা তোর ভয়ে লুকায় 😭🎤`,
    `${name}, congrats ভাই! তোর সাফল্য দেখে আমি এখন পড়াশোনা শুরু করব (মিথ্যা বললাম) 😆📚`,
    `তুই এমন লেভেলের success পেয়েছিস, আমার laptop রিস্টার্ট নিয়ে ফেলেছে 💻🔁`,
    `${name}, congrats ভাই! তুই এমন bright, light bulb তোকে দেখে চশমা পরে 😎💡`,
    `তোর success দেখে Instagram বলছে “filter needed” 📸😂`,
    `তোর achievement এত strong, আমি like দিতে ভয় পাচ্ছি 😭👍`,

    `${name}, congrats ভাই! তুই এমন কাজ করছিস, weather বলছে “Too hot to handle” ☀️🔥`,
    `তোর জন্য congrats দিতে গিয়ে আমার socks হেসে পড়ে গেছে 🧦🤣`,
    `${name}, congrats ভাই! তুই এমন inspiration যে motivational video তোকে remix করছে 🎬😂`,
    `তোর success দেখে আমার মা বলছে “এইরকম ছেলে কই পাই?” 😭💔`,
    `${name}, congrats ভাই! এখন তুই এমন flex করবি যে mirrorও cringe করবে 😆`,
    `তোর জন্য congrats দিতে গিয়ে আমার charger short circuit হয়ে গেল 🔌🔥`,
    `${name}, congrats ভাই! তুই এমন unique, AIও plagiarism খুঁজে পায় না 😎🤖`,
    `তোর success দেখে coffee বলছে “Bro, chill!” ☕😅`,
    `তুই এমন amazing যে আমার sleep schedule ভেঙে গেছে 😴💀`,
    `${name}, congrats ভাই! তোর vibe এত heavy যে gravity বাড়ে 🪐😂`,

    `তোর জন্য congrats দিতে গিয়ে আমার CPU 100% usage দেখাচ্ছে 💻🔥`,
    `${name}, congrats ভাই! তোর success দেখে mosquito bite দিতে queue ধরেছে 🦟😭`,
    `তোর জন্য congrats দিতে গিয়ে আমার AI বলছে “System overheating” 🤯🔥`,
    `${name}, congrats ভাই! তুই এমন inspiration, আমি এখন calculator রে thanks বললাম 🧮🤣`,
    `তোর জন্য congrats দিতে গিয়ে আমার fridge হেসে উঠেছে 😭🧊`,
    `${name}, congrats ভাই! তোর achievement এত loud যে silence mute চাপছে 😆🔇`,
    `তুই এমন cool যে snowman তোকে দেখে ice-cream বানায় 🍦😎`,
    `${name}, congrats ভাই! তুই এমন smart যে smart TV তোকে দেখে channel change করে 😭📺`,
    `তোর জন্য congrats দিতে গিয়ে electricity bill বেড়ে গেছে ⚡😂`,
    `${name}, congrats ভাই! তুই এমন vibe দিস, emoji রাও break নিতে চায় 😵😂`
  ];

  const randomMsg = congratsLines[Math.floor(Math.random() * congratsLines.length)];

  api.sendMessage(
    `🎉 *CONGRATULATIONS!* 🎉\n\n${randomMsg}\n\n🔥 Keep shining, legend!`,
    event.threadID,
    event.messageID
  );
};
