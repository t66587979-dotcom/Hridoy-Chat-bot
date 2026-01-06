const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU (Upgraded by NeoKEX)",
  description: "Shows all commands category wise",
  commandCategory: "System",
  usages: "[command name / page]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    moduleInfo: `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner: 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
╰━━━━━━━━━━━━━━━━╯`
  }
};

/* ===== HELP IMAGE ===== */
const helpImages = [
  "https://i.imgur.com/0IKTM64.jpeg"
];

function downloadImages(callback) {
  let files = [];
  let done = 0;

  helpImages.forEach((url, i) => {
    const filePath = path.join(__dirname, "cache", `help_${i}.jpg`);
    files.push(filePath);
    request(url)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        done++;
        if (done === helpImages.length) callback(files);
      });
  });
}

/* ===== RUN ===== */
module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  /* ===== SINGLE COMMAND INFO ===== */
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const cmd = commands.get(args[0].toLowerCase());

    const text = getText(
      "moduleInfo",
      cmd.config.name,
      cmd.config.usages || "Not Provided",
      cmd.config.description || "Not Provided",
      cmd.config.hasPermssion || 0,
      cmd.config.credits || "Unknown",
      cmd.config.commandCategory || "Unknown",
      cmd.config.cooldowns || 0,
      prefix,
      global.config.BOTNAME || "Chat Bot"
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

  /* ===== CATEGORY WISE LIST ===== */
  const categories = {};

  for (const [name, cmd] of commands) {
    const cat = cmd.config.commandCategory || "others";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  }

  let msg = `━━━☠️ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐌𝐄𝐍𝐔 ☠️━━━\n`;

  Object.keys(categories)
    .sort()
    .forEach(cat => {
      msg += `\n╭──『 ${cat.toUpperCase()} 』\n`;
      msg += categories[cat]
        .sort()
        .map(cmd => `┃ ✪ ${cmd}`)
        .join("\n");
      msg += `\n╰────────────◊`;
    });

  msg += `\n\n➥ Use: ${prefix}help <command name>\n➥ Total Commands: ${commands.size}`;

  downloadImages(files => {
    api.sendMessage(
      { body: msg, attachment: files.map(f => fs.createReadStream(f)) },
      threadID,
      () => files.forEach(f => fs.unlinkSync(f)),
      messageID
    );
  });
};
