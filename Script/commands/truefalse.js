module.exports.config = {
  name: "truefalse",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "rX Abdullah (Improved by Grok)",
  description: "সত্যি না মিথ্যা — র‍্যান্ডম জাজমেন্ট দিয়ে মজা করো",
  commandCategory: "fun",
  usages: "true or false / sotti mitta (গ্রুপে লিখলেই কাজ করবে)",
  cooldowns: 2,
  prefix: false // নো-প্রিফিক্স কমান্ড
};

module.exports.handleEvent = async function ({ api, event }) {
  const content = event.body?.toLowerCase()?.trim();
  if (!content) return;

  // সব সম্ভাব্য ট্রিগার (আরও ফ্লেক্সিবল করা হয়েছে)
  const triggers = [
    "true or false", "!true or false",
    "sotti mitta", "!sotti mitta",
    "sotti naki mitta", "!sotti naki mitta",
    "true naki false", "!true naki false",
    "sotti na mitta", "!sotti na mitta"
  ];

  // যদি কোনো ট্রিগার ম্যাচ করে
  if (triggers.some(trigger => content.includes(trigger))) {
    const trueReplies = [
      "একদম সত্য কথা বললা রে ভাই 😌",
      "সত্যিই তো, তুই তো সত্যবাদী 🤝",
      "এইটা ১০০% সত্য 💯🔥",
      "ভাই সত্যি কথা বললে শান্তি লাগে 😇",
      "সত্যি বলছি, মনের কথা কইলা 🤞",
      "হ্যাঁ রে, এইটা পুরা সত্যি! 🫡",
      "তুই তো সত্যের পাহাড় 😎",
      "সত্যি বলতে কি, এইটা ফ্যাক্ট! ✅"
    ];

    const falseReplies = [
      "মিথ্যা ধরা খাইছোস রে ভাই 😒",
      "তোর কথা শুনে হইল মিথ্যার হিমালয় 😑",
      "এইটা একদম বানোয়াট কথা 🤥",
      "মিথ্যা কথা বলিস কেন রে ভাই? 😂",
      "ভাই, মিথ্যার উপরেও মিথ্যা 🙄",
      "আরে না না, এইটা পুরা ঝুটা! ❌",
      "মিথ্যা বলার লেভেলটা বেশি হয়ে গেছে 😏",
      "ভাই এইটা মিথ্যা না হলে কি? 🤡"
    ];

    const isTrue = Math.random() < 0.5; // ৫০% চান্স

    const reply = isTrue
      ? `${trueReplies[Math.floor(Math.random() * trueReplies.length)]}\n✅ সত্যি!`
      : `${falseReplies[Math.floor(Math.random() * falseReplies.length)]}\n❌ মিথ্যা!`;

    return api.sendMessage(reply, event.threadID, event.messageID);
  }
};

// কমান্ড হিসেবে চালানোর জন্য (যদি কেউ !truefalse লিখে)
module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "এই কমান্ডটা গ্রুপে সরাসরি লিখলেই কাজ করে!\n" +
    "উদাহরণ: true or false\nsotti mitta\nsotti naki mitta",
    event.threadID, event.messageID
  );
};