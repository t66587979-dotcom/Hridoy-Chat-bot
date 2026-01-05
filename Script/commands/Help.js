const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "hridoy+ Upgrade by GPT",
  description: "Show commands by category",
  commandCategory: "system",
  usages: "[command/page]",
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
╰━━━━━━━━━━━━━━━━╯`
  }
};

const helpImages = [
  "https://i.imgur.com/0IKTM64.jpeg"
];

function downloadImages(cb) {
  let files = [];
  let done = 0;
  helpImages.forEach((url, i) => {
    const p = path.join(__dirname, "cache", `help_${i}.jpg`);
    files.push(p);
    request(url).pipe(fs.createWriteStream(p)).on("close", () => {
      done++;
      if (done === helpImages.length) cb(files);
    });
  });
}

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  /* 🔹 Single command info */
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const cmd = commands.get(args[0].toLowerCase());
    const text = getText(
      "moduleInfo",
      cmd.config.name,
      cmd.config.usages || "N/A",
      cmd.config.description || "N/A",
      cmd.config.hasPermssion,
      cmd.config.credits || "Unknown",
      cmd.config.commandCategory || "Other",
      cmd.config.cooldowns || 0,
      prefix,
      global.config.BOTNAME || "Bot"
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

  /* 🔹 Group by category */
  const categories = {};
  for (const cmd of commands.values()) {
    const cat = (cmd.config.commandCategory || "Other").toUpperCase();
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(cmd.config.name);
  }

  const categoryKeys = Object.keys(categories).sort();
  const page = Math.max(parseInt(args[0]) || 1, 1);
  const perPage = 4;
  const totalPages = Math.ceil(categoryKeys.length / perPage);

  const showCats = categoryKeys.slice(
    (page - 1) * perPage,
    page * perPage
  );

  let msg = "";
  showCats.forEach(cat => {
    msg += `\n📂 ${cat} (${categories[cat].length})\n`;
    msg += categories[cat]
      .sort()
      .map(c => ` ┣ ${c}`)
      .join("\n");
    msg += "\n";
  });

  const text = `╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘 📜
┣━━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total Cmd: ${commands.size}
┣━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot: ${global.config.BOTNAME || "Bot"}
╰━━━━━━━━━━━━━━━━╯`;

  downloadImages(files => {
    api.sendMessage(
      { body: text, attachment: files.map(f => fs.createReadStream(f)) },
      threadID,
      () => files.forEach(f => fs.unlinkSync(f)),
      messageID
    );
  });
};
