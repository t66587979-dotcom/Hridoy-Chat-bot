const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "yaar",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️", 
  description: "Get Pair From Mention",
  commandCategory: "png",
  usages: "[@mention]",
  cooldowns: 5
};

async function makeImage({ one, two }) {
  const template = await jimp.read("https://i.imgur.com/2bY5bSV.jpg");
  const pathImg = `/tmp/yaar_${one}_${two}.png`;

  const getAvatar = async (uid) => {
    const res = await axios.get(
      `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    );
    const avatar = await jimp.read(res.data);
    avatar.circle();
    return avatar;
  };

  const avatarOne = await getAvatar(one);
  const avatarTwo = await getAvatar(two);

  template
    .composite(avatarOne.resize(191, 191), 93, 111)
    .composite(avatarTwo.resize(190, 190), 434, 107);

  const buffer = await template.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, buffer);

  return pathImg;
}

module.exports.run = async function ({ api, event }) {    
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions || {});
  
  if (!mention[0]) {
    return api.sendMessage("Kisi 1 ko mantion to kr tutiya 😅", threadID, messageID);
  } else {
    const one = senderID, two = mention[0];
    const path = await makeImage({ one, two });

    return api.sendMessage({
      body: "✧•❁𝐘𝐚𝐚𝐫❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n       👑𝐘𝐄 𝐋𝐄 𝐌𝐈𝐋 𝐆𝐘𝐀❤\n\n𝐓𝐄𝐑𝐀 𝐉𝐈𝐆𝐑𝐈 𝐘𝐀𝐑𝐑 🩷\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  }
};
