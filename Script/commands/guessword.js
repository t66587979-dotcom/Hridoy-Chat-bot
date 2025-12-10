const { addBalance, subtractBalance } = require("./economy");

module.exports.config = {
  name: "guessword",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy + ChatGPT Final Edition",
  description: "Guess the word from a clue",
  commandCategory: "games",
  usages: "",
  cooldowns: 3
};

// ===================================================
// 🔥 100+ WORD → CLUE (FINAL COMBINED FULL LIST)
// ===================================================
const WORDS = [
  { word: "facebook", clue: "নীল রঙের সবচেয়ে বড় সোশ্যাল মিডিয়া প্ল্যাটফর্ম" },
  { word: "google", clue: "বিশ্বের সবচেয়ে বড় সার্চ ইঞ্জিন" },
  { word: "youtube", clue: "ভিডিও দেখার সবচেয়ে জনপ্রিয় সাইট" },
  { word: "instagram", clue: "ছবি ও রিল শেয়ার করার প্ল্যাটফর্ম" },
  { word: "twitter", clue: "এখন X নামে পরিচিত সোশ্যাল অ্যাপ" },
  { word: "whatsapp", clue: "সবচেয়ে বেশি ব্যবহৃত চ্যাটিং অ্যাপ (সবুজ)" },
  { word: "messenger", clue: "ফেসবুকের চ্যাট অ্যাপ" },
  { word: "tiktok", clue: "স্বল্পদৈর্ঘ্য ভিডিওর জনপ্রিয় অ্যাপ" },
  { word: "python", clue: "সাপ নয়, একটি প্রোগ্রামিং ভাষা" },
  { word: "javascript", clue: "ওয়েবসাইটে প্রাণ যোগ করে যেটি" },
  { word: "developer", clue: "সফটওয়্যার তৈরি করে যে" },
  { word: "keyboard", clue: "যন্ত্রে টাইপ করার উপকরণ" },
  { word: "mouse", clue: "কম্পিউটারের নির্দেশক যন্ত্র" },
  { word: "monitor", clue: "কম্পিউটারের স্ক্রিন" },
  { word: "battery", clue: "ফোনের চার্জ রাখে" },
  { word: "charger", clue: "ফোনে বিদ্যুৎ দেয়" },
  { word: "internet", clue: "বিশ্বজুড়ে যোগাযোগের নেটওয়ার্ক" },
  { word: "wifi", clue: "তার ছাড়া ইন্টারনেট" },
  { word: "android", clue: "গুগলের মোবাইল OS" },
  { word: "windows", clue: "মাইক্রোসফটের কম্পিউটার OS" },
  { word: "apple", clue: "iPhone যে কোম্পানি তৈরি করে" },
  { word: "iphone", clue: "সবচেয়ে জনপ্রিয় প্রিমিয়াম স্মার্টফোন" },
  { word: "camera", clue: "যা দিয়ে ছবি তোলা হয়" },
  { word: "football", clue: "১১ জন খেলোয়াড়ের খেলা" },
  { word: "cricket", clue: "ব্যাট-বল দিয়ে খেলা হয়" },
  { word: "ronaldo", clue: "CR7 নামে পরিচিত ফুটবলার" },
  { word: "messi", clue: "GOAT বলা হয় যাকে" },
  { word: "neymar", clue: "ব্রাজিলের তারকা খেলোয়াড়" },
  { word: "mbappe", clue: "ফরাসি দ্রুতগতির স্ট্রাইকার" },
  { word: "barcelona", clue: "মেসির কিংবদন্তি ক্লাব" },
  { word: "liverpool", clue: "রেড জার্সির ইংলিশ ক্লাব" },
  { word: "chelsea", clue: "দ্য ব্লুজ নামে পরিচিত" },
  { word: "arsenal", clue: "দ্য গ্যানার্স নামে পরিচিত" },
  { word: "madrid", clue: "রিয়াল _______" },
  { word: "submarine", clue: "সমুদ্রের নিচে চলে" },
  { word: "helicopter", clue: "উপরের দিকে ঘুরে উড়ে" },
  { word: "airplane", clue: "আকাশে উড়ে যাত্রী নিয়ে" },
  { word: "rocket", clue: "মহাকাশে পাঠায়" },
  { word: "satellite", clue: "পৃথিবীর কক্ষপথে ঘোরে" },
  { word: "calculator", clue: "গণিত সমাধানের যন্ত্র" },
  { word: "diamond", clue: "বিশ্বের সবচেয়ে দামি রত্ন" },
  { word: "gold", clue: "হলুদ রঙের মূল্যবান ধাতু" },
  { word: "silver", clue: "সাদা রঙের ধাতু, সোনা নয়" },
  { word: "oxygen", clue: "মানুষের শ্বাস নেওয়ার উপাদান" },
  { word: "water", clue: "জীবনের জন্য অপরিহার্য" },
  { word: "river", clue: "স্রোতস্বিনী জলধারা" },
  { word: "forest", clue: "গাছপালায় ভরা এলাকা" },
  { word: "mountain", clue: "উঁচু প্রাকৃতিক স্তম্ভ" },
  { word: "school", clue: "শিক্ষা নেওয়ার স্থান" },
  { word: "teacher", clue: "যিনি শেখান" },
  { word: "student", clue: "যিনি শেখে" },
  { word: "hospital", clue: "রোগীরা যেখানে চিকিৎসা পায়" },
  { word: "doctor", clue: "চিকিৎসা করেন যিনি" },
  { word: "medicine", clue: "রোগ ভালো করার বস্তু" },
  { word: "chocolate", clue: "মিষ্টি ব্রাউন খাবার" },
  { word: "banana", clue: "হলুদ রঙের ফল" },
  { word: "mango", clue: "ফলের রাজা" },
  { word: "watermelon", clue: "গরমে খাওয়া শীতল ফল (লাল টুকটুক)" },
  { word: "pizza", clue: "রাউন্ড ইতালিয়ান খাবার" },
  { word: "burger", clue: "পাউরুটির মাঝে মাংস" },
  { word: "noodles", clue: "লম্বা লম্বা খাবার" },
  { word: "rice", clue: "ভাতের ইংরেজি" },
  { word: "milk", clue: "সাদা তরল খাদ্য" },
  { word: "coffee", clue: "নেশাময় কালো পানীয়" },
  { word: "tea", clue: "বাংলার জনপ্রিয় গরম পানীয়" },
  { word: "pencil", clue: "লিখা যায় কিন্তু কালি নেই" },
  { word: "book", clue: "পাতা দিয়ে তৈরি জ্ঞান" },
  { word: "paper", clue: "লিখার জন্য সাদা পাতলা জিনিস" },
  { word: "mirror", clue: "নিজের মুখ দেখা যায়" },
  { word: "window", clue: "বাতাস ঢোকে যেখান দিয়ে" },
  { word: "door", clue: "ঘরে ঢোকার পথ" },
  { word: "chair", clue: "বসার জিনিস" },
  { word: "table", clue: "জিনিস রাখার ফার্নিচার" },
  { word: "bed", clue: "ঘুমানোর জায়গা" },
  { word: "clock", clue: "সময় দেখায়" },
  { word: "watch", clue: "হাতে পরা সময় যন্ত্র" },
  { word: "rain", clue: "আকাশ থেকে পানি পড়ে" },
  { word: "snow", clue: "সাদা বরফ পড়ে আকাশ থেকে" },
  { word: "sun", clue: "দিনে আলো দেয়" },
  { word: "moon", clue: "রাতে আকাশে দেখা যায়" },
  { word: "star", clue: "রাতে জ্বলে হাজারে হাজারে" },
  { word: "planet", clue: "আমাদের পৃথিবীও একটি ___" },
  { word: "galaxy", clue: "মহাবিশ্বের বিশাল নক্ষত্র পরিবার" },
  { word: "universe", clue: "পুরো মহাশূন্য" },
  { word: "music", clue: "কানে শুনে মন ভালো হয়" },
  { word: "guitar", clue: "তার দিয়ে বাজানো বাদ্যযন্ত্র" },
  { word: "piano", clue: "সাদা-কালো কি রয়েছে" },
  { word: "violin", clue: "কাঁধে রেখে বাজানো যন্ত্র" },
  { word: "drums", clue: "তালে তালে বাজে" },
  { word: "movie", clue: "ছবি নয়, ফিল্ম" },
  { word: "actor", clue: "ফিল্মে অভিনয় করে যে" },
  { word: "robot", clue: "মানুষ বানানো যান্ত্রিক সহকারী" },
  { word: "energy", clue: "কাজ করার ক্ষমতা" },
  { word: "gravity", clue: "পৃথিবী যে টানে" },
  { word: "science", clue: "জ্ঞানভিত্তিক বিষয়" },
  { word: "history", clue: "অতীতের গল্প" }
];

const random = arr => arr[Math.floor(Math.random() * arr.length)];
const active = {};

// ===================================================
// RUN
// ===================================================
module.exports.run = ({ api, event }) => {
  const uid = event.senderID;

  if (active[uid]) return api.sendMessage("⛔ আপনার আগের GuessWord গেম এখনো চলছে!", event.threadID);

  const { word, clue } = random(WORDS);

  const msg =
`🧩 *Guess The Word — Clue Game*

🔎 ক্লু: ${clue}
⏳ সময়: 60 সেকেন্ড
💬 পুরো শব্দটি লিখে পাঠান!

✔ সঠিক হলে: +1000 কয়েন  
❌ ভুল হলে: -300 কয়েন`;

  api.sendMessage(msg, event.threadID, (err, info) => {
    const timeoutID = setTimeout(() => {
      if (!active[uid]) return;

      subtractBalance(uid, 300);
      api.sendMessage(`⏳ সময় শেষ! -300 কয়েন কাটা হয়েছে।\nসঠিক শব্দ ছিল: ${word}`, event.threadID);

      delete active[uid];
      global.client.handleReply = global.client.handleReply.filter(e => e.messageID !== info.messageID);
    }, 60000);

    active[uid] = { word, timeoutID };

    global.client.handleReply.push({
      name: module.exports.config.name,
      author: uid,
      messageID: info.messageID
    });
  });
};

// ===================================================
// HANDLE REPLY
// ===================================================
module.exports.handleReply = ({ api, event, handleReply }) => {
  const uid = event.senderID;
  if (!active[uid]) return;

  const text = event.body.trim().toLowerCase();
  const ans = active[uid].word.toLowerCase();

  clearTimeout(active[uid].timeoutID);

  if (text === ans) {
    addBalance(uid, 1000);
    api.sendMessage(`🎉 সঠিক! +1000 কয়েন যোগ হয়েছে।\nউত্তর: ${ans}`, event.threadID);
  } else {
    subtractBalance(uid, 300);
    api.sendMessage(`❌ ভুল! -300 কয়েন কাটা হলো।\nসঠিক শব্দ: ${ans}`, event.threadID);
  }

  delete active[uid];
  global.client.handleReply = global.client.handleReply.filter(e => e.messageID !== handleReply.messageID);
};