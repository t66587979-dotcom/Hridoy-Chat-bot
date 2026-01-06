const fs = require("fs");

// File for player data
const gameFile = __dirname + "/truth_dare_data.json";

// Load & save data
function loadData() {
  if (!fs.existsSync(gameFile)) return { players: [], turn: 0, mode: "truth" };
  return JSON.parse(fs.readFileSync(gameFile));
}
function saveData(data) {
  fs.writeFileSync(gameFile, JSON.stringify(data, null, 2));
}

// Truth & Dare questions
const truths = [
  "তুমি শেষ কবে কারো জন্য কেঁদেছিলে? 😢",
  "তোমার crush কে? 🙈",
  "সবচেয়ে বড় secretটা কী?",
  "কাকে পছন্দ করো কিন্তু বলতে পারো না?",
  "তুমি কি কখনো কারো সাথে প্রতারণা করেছো?",
  "তুমি কোন বন্ধুর প্রেমে পড়েছিলে কখনো? 😏",
  "সবচেয়ে বাজে কাজটা করেছিলে কোনটা?",
  "তুমি কাকে নিয়ে সবচেয়ে বেশি ভাবো?",
  "তুমি যদি একদিনের জন্য অদৃশ্য হতে পারতে, কাকে আগে দেখতে যেতে?",
  "তোমার সবচেয়ে বড় ভয়টা কী?"
];

const dares = [
  "গ্রুপে বলো — ‘আমি একটা হাঁস 🦆’",
  "তোমার crush এর নাম বলো loud করে! 😆",
  "তুমি যে গানটা সবচেয়ে বাজে গাও, সেটা পাঠাও 🎤",
  "নিজের dp তে আজকের তারিখ লিখে দাও 🤭",
  "তোমার ফোনের গ্যালারির প্রথম ছবি পাঠাও 📸",
  "৫টা ইমোজি দিয়ে নিজের মুড বোঝাও 😜",
  "যাকে সবচেয়ে কম পছন্দ করো, তাকে একটা প্রশংসা দাও 😏",
  "গ্রুপে বলো — ‘আমি প্রেমে পইরা গেছি 💘’",
  "একটা জোক বলো — সবাই হাসলে তুমি জিতবে 😂",
  "তোমার পাশে থাকা জিনিসটার নাম বলো — এখনই সেটা তোমার প্রেমিক/প্রেমিকা 😆"
];

module.exports.config = {
  name: "truthordare",
  version: "3.0",
  hasPermssion: 0,
  credits: "Ullash + GPT Upgrade",
  description: "Funny Truth or Dare game with join list, timer, respect & stop system 😎",
  commandCategory: "Games",
  usages: "[join/start/list/stop]",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Users }) {
  const data = loadData();
  const uid = event.senderID;
  const name = await Users.getNameUser(uid);
  const cmd = args[0];

  if (!global.client.truthOrDareTimers) global.client.truthOrDareTimers = [];

  // ✅ STOP COMMAND
  if (cmd === "stop") {
    if (data.players.length === 0)
      return api.sendMessage("😅 গেম তো এখনো শুরুই হয়নি!", event.threadID);

    // সব টাইমার clear করো
    for (const t of global.client.truthOrDareTimers) clearTimeout(t);
    global.client.truthOrDareTimers = [];

    // সব reply রিমুভ করো
    if (global.client.handleReply) {
      global.client.handleReply = global.client.handleReply.filter(h => h.name !== "truthordare");
    }

    // ডাটা রিসেট করো
    data.players = [];
    data.turn = 0;
    saveData(data);

    return api.sendMessage("🛑 গেম সম্পূর্ণ বন্ধ করা হয়েছে এবং সব ডেটা রিসেট হয়েছে ✅", event.threadID);
  }

  // ✅ JOIN SYSTEM
  if (cmd === "join") {
    if (data.players.find(p => p.id === uid))
      return api.sendMessage(`😄 ${name}, তুমি আগেই খেলায় যোগ দিয়েছো!`, event.threadID);
    data.players.push({ id: uid, name });
    saveData(data);
    return api.sendMessage(`✅ ${name} খেলায় যোগ দিয়েছে!`, event.threadID);
  }

  // ✅ LIST SYSTEM
  if (cmd === "list") {
    if (data.players.length === 0)
      return api.sendMessage("কেউ এখনো খেলায় যোগ দেয়নি 😅", event.threadID);
    const list = data.players.map((p, i) => `${i + 1}. ${p.name}`).join("\n");
    return api.sendMessage(`🎮 বর্তমান খেলোয়াড়দের তালিকা:\n${list}`, event.threadID);
  }

  // ✅ START GAME
  if (cmd === "start") {
    if (data.players.length < 2)
      return api.sendMessage("কমপক্ষে ২ জন join করলেই খেলা শুরু হবে 😅", event.threadID);

    data.turn = 0;
    saveData(data);
    startTurn(api, event, data);
    return;
  }

  return api.sendMessage("🔹 ব্যবহার করো:\ntruthordare join\ntruthordare list\ntruthordare start\ntruthordare stop", event.threadID);
};

// ======================= HANDLE REPLIES =======================
module.exports.handleReply = async function({ api, event, handleReply }) {
  const data = loadData();
  const player = handleReply.player;
  const uid = event.senderID;
  const text = event.body.toLowerCase();

  if (handleReply.type === "choose" && uid === player.id) {
    clearTimeout(handleReply.timer);
    if (text.includes("truth")) {
      const q = truths[Math.floor(Math.random() * truths.length)];
      return api.sendMessage(`💬 Truth: ${q}`, event.threadID, (err, info) => {
        global.client.handleReply.push({
          name: "truthordare",
          messageID: info.messageID,
          type: "answer",
          player
        });
      });
    } else if (text.includes("dare")) {
      const d = dares[Math.floor(Math.random() * dares.length)];
      return api.sendMessage(`🔥 Dare: ${d}\n\nদেয়া কাজ শেষ হলে লিখো "done ✅"`, event.threadID, (err, info) => {
        global.client.handleReply.push({
          name: "truthordare",
          messageID: info.messageID,
          type: "dare",
          player
        });
      });
    } else {
      return api.sendMessage(`❗ শুধু "Truth" বা "Dare" লিখো ${player.name}`, event.threadID);
    }
  }

  // যদি player truth এর উত্তর দেয়
  if (handleReply.type === "answer" && uid === player.id) {
    api.sendMessage(`😄 সুন্দর উত্তর ${player.name}!`, event.threadID);
    return nextTurn(api, event, data);
  }

  // যদি dare শেষ করে
  if (handleReply.type === "dare" && uid === player.id && text.includes("done")) {
    api.sendMessage(`🫡 Respect ${player.name}! তুমি Dare complete করেছো 💥`, event.threadID);
    return nextTurn(api, event, data);
  }
};

// ======================= NEXT TURN =======================
function startTurn(api, event, data) {
  const current = data.players[data.turn];
  api.sendMessage(
    `🎯 এখন ${current.name}-এর পালা!\nতুমি কি Truth না Dare নিতে চাও? (reply করো)`,
    event.threadID,
    (err, info) => {
      const timer = setTimeout(() => {
        api.sendMessage(`⏰ সময় শেষ! ${current.name} উত্তর দেয়নি... skip করা হলো 😅`, event.threadID);
        nextTurn(api, event, data);
      }, 30000);

      global.client.truthOrDareTimers.push(timer);

      global.client.handleReply.push({
        name: "truthordare",
        messageID: info.messageID,
        type: "choose",
        player: current,
        timer
      });
    }
  );
}

function nextTurn(api, event, data) {
  data.turn = (data.turn + 1) % data.players.length;
  saveData(data);
  startTurn(api, event, data);
                             }
