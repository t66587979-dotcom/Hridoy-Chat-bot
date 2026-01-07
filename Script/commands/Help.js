const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "4.0.0", // Upgraded version
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Theme by Grok-xAI)",
  description: "Kaguya's Forbidden Command Scroll - Category wise & Advanced",
  commandCategory: "System",
  usages: "[page / category / command / search keyword]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    moduleInfo: `🌙 ╭───── Kaguya's Insight ─────╮
┃ 🔮 Command: %1
┃ 📜 Usage: %2
┃ 📖 Description: %3
┃ 🔒 Permission: %4 (0=All, 1=Group, 2=Admin, 3=Owner)
┃ ✍ Credit: %5
┃ 🗂 Category: %6
┃ ⏱ Cooldown: %7s
┃ 🌸 Prefix: %8
┃ 👑 Bot: %9 - Kaguya Ōtsutsuki
╰───── Byakugan Activated ─────🌙`
  }
};

/* ===== Kaguya Themed Help Images (add more for randomness) ===== */
const helpImages = [
  "https://i.imgur.com/0IKTM64.jpeg", // তোমার অরিজিনাল
  "https://i.imgur.com/EXAMPLE_KAGUYA_1.jpg", // Kaguya Otsutsuki fanart যোগ করো (Imgur/FB থেকে)
  "https://i.imgur.com/EXAMPLE_BYAKUGAN.jpg"  // আরো থিমড ইমেজ
];

/* ===== Random Kaguya Quotes ===== */
const kaguyaQuotes = [
  "Bow before the Rabbit Goddess... or face my wrath~ 🌕",
  "Your commands are insignificant... yet amusing. Use them wisely.",
  "Chakra flows... reveal my secrets if you dare.",
  "Mortals and their toys... show me your power.",
  "This world shall be mine... starting with your chat."
];

/* ===== Download Images Function ===== */
function downloadImages(callback) {
  const randomImage = helpImages[Math.floor(Math.random() * helpImages.length)];
  const filePath = path.join(__dirname, "cache", "kaguya_help.jpg");
  
  request(randomImage)
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => callback([filePath]));
}

/* ===== RUN ===== */
module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, senderID } = event;

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const botName = global.config.BOTNAME || "Kaguya Ōtsutsuki";

  const isAdmin = /* তোমার অ্যাডমিন চেক লজিক */ (global.config.ADMINBOT || []).includes(senderID);

  /* ===== SINGLE COMMAND INFO ===== */
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const cmd = commands.get(args[0].toLowerCase());
    const permText = cmd.config.hasPermssion === 0 ? "Everyone" :
                     cmd.config.hasPermssion === 1 ? "Group Admin" :
                     cmd.config.hasPermssion === 2 ? "Bot Admin" : "Owner Only";

    const text = getText(
      "moduleInfo",
      cmd.config.name,
      cmd.config.usages || "N/A",
      cmd.config.description || "No description",
      permText,
      cmd.config.credits || "Unknown",
      cmd.config.commandCategory || "Others",
      cmd.config.cooldowns || 0,
      prefix,
      botName
    );

    return downloadImages(files => {
      api.sendMessage(
        { body: text, attachment: files.map(f => fs.createReadStream(f)) },
        threadID,
        () => files.forEach(f => fs.unlinkSync(f)),
        messageID
      );
    });
  }

  /* ===== ADVANCED HELP LOGIC ===== */
  let msg = `🌙━━━ KAGUYA ŌTSUTSUKI'S FORBIDDEN SCROLL ━━━🌙\n`;
  msg += `     "${kaguyaQuotes[Math.floor(Math.random() * kaguyaQuotes.length)]}"\n\n`;

  const input = args.join(" ").toLowerCase();

  // Page number handling
  let page = 1;
  if (!isNaN(input) && Number(input) > 0) page = Number(input);

  // Category filter
  let showCategory = null;
  if (input && !input.includes("search") && !Number(input)) {
    showCategory = input;
  }

  // Search mode
  let searchResults = [];
  if (input.startsWith("search ")) {
    const keyword = input.replace("search ", "").trim();
    for (const [name, cmd] of commands) {
      if (name.includes(keyword) || (cmd.config.description || "").toLowerCase().includes(keyword)) {
        searchResults.push(name);
      }
    }
  }

  const categories = {};
  for (const [name, cmd] of commands) {
    const cat = (cmd.config.commandCategory || "others").toLowerCase();
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  }

  let allCats = Object.keys(categories).sort();

  if (showCategory && categories[showCategory]) {
    // Specific category
    msg += `╭──『 ${showCategory.toUpperCase()} CATEGORY 』──╮\n`;
    categories[showCategory].sort().forEach(cmd => {
      msg += `┃ ✦ \( {prefix} \){cmd}\n`;
    });
    msg += `╰───────────────🌸\n\n`;
  } else if (searchResults.length > 0) {
    // Search results
    msg += `╭──『 SEARCH RESULTS for "${input.replace("search ", "")}" 』──╮\n`;
    searchResults.forEach(cmd => {
      msg += `┃ ✦ \( {prefix} \){cmd}\n`;
    });
    msg += `╰───────────────🔍\n\n`;
  } else {
    // Paged full menu
    const perPage = 8; // commands per page
    const totalPages = Math.ceil(allCats.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagedCats = allCats.slice(start, end);

    msg += `Page \( {page}/ \){totalPages} • Total Commands: ${commands.size}\n\n`;

    pagedCats.forEach(cat => {
      msg += `╭──『 ${cat.toUpperCase()} 』──╮\n`;
      categories[cat].sort().slice(0, 12).forEach(cmd => { // limit per cat for beauty
        msg += `┃ ✦ ${cmd}\n`;
      });
      if (categories[cat].length > 12) msg += `┃ ... +${categories[cat].length - 12} more\n`;
      msg += `╰────────────◈\n\n`;
    });

    if (page < totalPages) msg += `➤ Next: ${prefix}help ${page + 1}\n`;
  }

  msg += `\nCommands Guide:\n`;
  msg += `✦ ${prefix}help <command> → Details\n`;
  msg += `✦ ${prefix}help <category> → e.g. ${prefix}help games\n`;
  msg += `✦ ${prefix}help search <word> → Find commands\n`;
  msg += `✦ ${prefix}help <page> → More pages\n\n`;

  if (isAdmin) msg += `🔒 Admin Secret: Try hidden jutsus... 🌑\n`;

  msg += `Kaguya Ōtsutsuki v${module.exports.config.version} • Made with chakra by Hridoy`;

  downloadImages(files => {
    api.sendMessage(
      { body: msg, attachment: files.map(f => fs.createReadStream(f)) },
      threadID,
      () => files.forEach(f => fs.unlinkSync(f)),
      messageID
    );
  });
};
