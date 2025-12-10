const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Show Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  
  const info = `
╔═══❖•✨🌙 𝙊𝙒𝙉𝙀𝙍 𝙋𝙍𝙊𝙁𝙄𝙇𝙀 🌙✨•❖═══╗

      👑 𝙊𝙬𝙣𝙚𝙧 : 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍
      🧸 𝙉𝙞𝙘𝙠 : 𝐇𝐑𝐈𝐃𝐎𝐘
      🎂 𝘼𝙜𝙚 : 18+
      ❤️ 𝙍𝙚𝙡𝙖𝙩𝙞𝙤𝙣 : 𝙎𝙞𝙣𝙜𝙡𝙚
      🎓 𝙎𝙩𝙪𝙙𝙚𝙣𝙩 : HSC Level
      🏡 𝘼𝙙𝙙𝙧𝙚𝙨𝙨 : 𝙄𝘽𝙄 (guess korte bolba?)

╠═════════════ ✦ ✦ ✦ ═════════════╣
           🔗 𝘾𝙊𝙉𝙏𝘼𝘾𝙏 𝙇𝙄𝙉𝙆𝙎
╠═════════════ ✦ ✦ ✦ ═════════════╣

📘 𝙁𝙖𝙘𝙚𝙗𝙤𝙤𝙠  
➥ fb.com/100048786044500

💬 𝙈𝙚𝙨𝙨𝙚𝙣𝙜𝙚𝙧  
➥ m.me/100048786044500

📞 𝙒𝙝𝙖𝙩𝙨𝘼𝙥𝙥  
➥ wa.me/0174495****

✈️ 𝙏𝙚𝙡𝙚𝙜𝙧𝙖𝙢  
➥ 𝙄 𝙨𝙖𝙞𝙙 𝙉𝙤 😐✨

╚═══❖•💫 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞 💫•❖═══╝
`;

  const images = [
    "https://i.imgur.com/0IKTM64.jpeg"
  ];

  const randomImg = images[Math.floor(Math.random() * images.length)];

  const callback = () => api.sendMessage(
    {
      body: info,
      attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
    },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/owner.jpg")
  );

  return request(encodeURI(randomImg))
    .pipe(fs.createWriteStream(__dirname + "/cache/owner.jpg"))
    .on("close", () => callback());
};
