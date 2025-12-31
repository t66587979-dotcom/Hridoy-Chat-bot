const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "hugv3",
  version: "7.3.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️",
  description: "Hug 🥰",
  commandCategory: "img",
  usages: "[@mention]",
  cooldowns: 5
};

async function circle(imagePath) {
  const img = await jimp.read(imagePath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache");
  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  const bg = await jimp.read("https://i.imgur.com/7lPqHjw.jpg");
  const pathImg = path.join(__root, `hugv3_${one}_${two}.png`);
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);

  const getAvatar = async (uid, filePath) => {
    const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const avatarData = (await axios.get(url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(filePath, Buffer.from(avatarData));
  };

  await getAvatar(one, avatarOnePath);
  await getAvatar(two, avatarTwoPath);

  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  bg
    .composite(circleOne.resize(220, 220), 200, 50)
    .composite(circleTwo.resize(220, 220), 490, 200);

  const finalBuffer = await bg.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, finalBuffer);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const mention = Object.keys(mentions);
  if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);

  const one = senderID, two = mention[0];

  try {
    const imagePath = await makeImage({ one, two });
    return api.sendMessage({
      body: "",
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath), messageID);
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ ছবিটি তৈরি করতে সমস্যা হয়েছে!", threadID, messageID);
  }
};
