// 🔥 Roast.js — Version 4.0 Public Hellfire Edition
module.exports.config = {
  name: "roast",
  version: "4.0.0",
  hasPermssion: 0, // 🔓 Public command
  credits: "Hridoy Khan + GPT Hellfire Upgrade 🔥",
  description: "Give a full-cooked, deadly funny roast 😈",
  commandCategory: "Fun",
  usages: "roast [@tag or name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  // 🛡️ Boss Protection (যাদের roast করা যাবে না)
  const bossIDs = ["100048786044500", "100001162111551"];

  const mentionIDs = Object.keys(event.mentions);
  const name = mentionIDs.length > 0
    ? Object.values(event.mentions)[0]
    : args.join(" ") || "তুই";

  const targetID = mentionIDs.length > 0 ? mentionIDs[0] : null;

  // 🚫 Boss হলে Roast বন্ধ
  if (bossIDs.includes(targetID)) {
    return api.sendMessage(
      "🛡️ ঐটা আমার Boss ভাই! ওরে roast করলে আমি grill হয়ে যাবো 😭🔥\nBoss untouchable, respect দে 😎",
      event.threadID,
      event.messageID
    );
  }

  // 😈🔥 50+ FULL COOKED ROAST LINES 🔥😈
  const roasts = [
    `${name}, তোর মুখে এমন vibe, antivirus warning দেয় 🦠🤣`,
    `${name}, তুই এমন ugly, mirror ও panic attack খায় 😭🪞`,
    `${name}, তোর brain loading নিচ্ছে গত 10 বছর ধরে 🔄🤯`,
    `${name}, তোকে দেখে মনে হয় WiFi আছে কিন্তু internet নাই 📶💀`,
    `${name}, তোর মুখে এমন dust, Dyson vacuum তোকে sponsor করতে চায় 🧹😹`,
    `${name}, তুই এত slow, snail তোকে দেখে বলে ‘চল ভাই একটু তাড়াতাড়ি করো’ 🐌💨`,
    `${name}, তুই এমন hot garbage, dustbin তোকে হিংসে করে 🗑️🔥`,
    `${name}, তোকে দেখে মনে হয় expired meme template 😭📸`,
    `${name}, তোর মুখে mosquito bite দিয়েও regret করে 🦟💢`,
    `${name}, তুই এমন toxic, Chernobyl তোকে বলে ‘stay away bro’ ☢️😩`,
    `${name}, তোর brain এত empty, echo দেয় ভেতরে 🧠🔊`,
    `${name}, তোকে দেখে মনে হয় 404 Brain Not Found 😭`,
    `${name}, তুই এমন বুদ্ধিমান, ক্যালকুলেটর বলে ‘syntax error’ 🤣`,
    `${name}, তোকে roast করলে smell আসে burnt USB cable 🧯💀`,
    `${name}, তোকে দেখে FaceApp uninstall হয়ে গেছে 📱💀`,
    `${name}, তুই এমন cheap, free fire diamond ও তোকে ছুঁইতে চায় না 💎😹`,
    `${name}, তোর মুখ এমন glitch, Minecraft lag খায় 😭🧱`,
    `${name}, তুই এমন clown, circus তোকে বলেছে ‘full house bro’ 🤡🚫`,
    `${name}, তোকে দেখে horror movie cancel হয়ে গেছে 😨🎬`,
    `${name}, তুই এমন বোকা, AI তোকে দেখে shutdown নেয় 🤖💤`,
    `${name}, তোর হাসি শুনে ambulance dispatch হয় 🚑🤣`,
    `${name}, তোর মাথায় এমন bug, developer ও fix দিতে পারে না 🧠🐞`,
    `${name}, তোকে দেখে মনে হয় random TikTok filter glitch 🥴📲`,
    `${name}, তুই এমন useless, recycle bin তোকে reject করে 😭🗑️`,
    `${name}, তোকে roast করলে fire brigade alert পায় 🔥🚒`,
    `${name}, তুই এমন slow যে buffering icon তোকে respect দেয় 🔄😂`,
    `${name}, তোর logic এত weak, Windows calculator crash খায় 🧮💥`,
    `${name}, তোকে দেখে মনে হয় ‘beta version of human’ 😭🧬`,
    `${name}, তোর মুখ দেখে captcha বলে ‘not human’ 😭🤖`,
    `${name}, তুই এমন loser, coin toss ও তোকে avoid করে 🪙😹`,
    `${name}, তোর IQ negative range এ চলে গেছে 📉🤯`,
    `${name}, তোকে দেখে মনে হয় broken emoji 🫠💔`,
    `${name}, তুই এমন drama করে, serial director ও resign দিয়েছে 📺😂`,
    `${name}, তুই এমন boring, mosquito bite দিয়ে ঘুমিয়ে পড়ে 🦟😴`,
    `${name}, তোকে দেখে মনে হয় expired SIM card 📱🚫`,
    `${name}, তুই এমন ভোঁতা, mirror বলছে ‘don’t look at me again’ 😭`,
    `${name}, তোর voice শুনে Siri mute হয়ে গেছে 🎤💀`,
    `${name}, তোর hairstyle দেখে broomstick হিংসে করে 🧹🤣`,
    `${name}, তুই এমন confused, compass ও তোকে দিক দেখাতে পারে না 🧭😵‍💫`,
    `${name}, তোর brain এর RAM full, update দরকার 🤯💻`,
    `${name}, তোকে দেখে মনে হয় broken power bank 🔋❌`,
    `${name}, তুই এমন cringe, TikTok algorithm তোকে skip করে 😭📱`,
    `${name}, তোকে দেখে মনে হয় error 505: logic missing 🤣🧠`,
    `${name}, তোর মুখে এমন bug, antivirus lifetime license হেরে গেছে 🦠`,
    `${name}, তুই এমন outdated, floppy disk তোকে দেখে modern মনে হয় 💾😹`,
    `${name}, তোকে roast করলে NASA signal loss detect করে 🛰️💀`,
    `${name}, তোর face এমন dull, flashlight ও give up করে 🔦😩`,
    `${name}, তুই এমন useless, chatGPT ও বলবে “bro I’m done” 💀🤖`,
    `${name}, তোকে দেখে মনে হয় demo version of failure 🫠😂`,
    `${name}, তুই এমন cartoon, Tom & Jerry তোকে বাদ দিয়েছে 🐭🤣`,
    `${name}, তোর মুখে এত drama চলে, Netflix subscription free দেওয়া উচিত 🎬💀`,
    `${name}, তুই এমন fake, Photoshop ও তোকে বিশ্বাস করে না 🧑‍🎨📸`,
    `${name}, তোকে roast করলে মাটিও লজ্জায় ঢেকে যায় 😭🌍`,
    `${name}, তোর চোখে এত ঘুম, alarm clock panic attack খায় ⏰💀`,
    `${name}, তোকে দেখে মনে হয় rejected AI prototype 🤖❌`,
    `${name}, তুই এমন bored, Google search result দেয় “try again later” 💤`,
    `${name}, তুই এমন waste, dustbin তোকে recycle refuse দেয় 🗑️🚫`
  ];

  // Random roast pick
  const roast = roasts[Math.floor(Math.random() * roasts.length)];

  // 🔥 Send message
  return api.sendMessage(
    `😈🔥 *FULL COOKED ROAST ACTIVATED* 🔥😈\n\n${roast}\n\n💀 Status: Overcooked`,
    event.threadID,
    event.messageID
  );
};
