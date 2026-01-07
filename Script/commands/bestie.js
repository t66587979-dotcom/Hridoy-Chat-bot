const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "bestie",
  version: "7.3.2", // updated
  hasPermssion: 0,
  credits: "Priyansh Rajput (Modified by Grok - direct link version)",
  description: "Get Pair/Bestie image from mention (no local file)",
  commandCategory: "png",
  usages: "[@mention]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

async function circle(image) {
  image = await jimp.read(image);
  image.circle();
  return image;
}

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache");
  if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);
  const outputPath = path.join(__root, `bestie_\( {one}_ \){two}.png`);

  try {
    // Background direct link (no download needed in onLoad)
    const backgroundUrl = "https://i.imgur.com/dAxBwKy.jpg";
    const batgiam_img = await jimp.read(backgroundUrl);

    // Download avatars
    const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    const [getAvatarOne, getAvatarTwo] = await Promise.all([
      axios.get(avatarOneUrl, { responseType: "arraybuffer" }),
      axios.get(avatarTwoUrl, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data));
    fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data));

    // Circle crop avatars
    const circleOne = await circle(avatarOnePath);
    const circleTwo = await circle(avatarTwoPath);

    // Composite (positions same as original)
    batgiam_img.composite(circleOne.resize(191, 191), 93, 111);
    batgiam_img.composite(circleTwo.resize(190, 190), 434, 107);

    // Save output
    await batgiam_img.writeAsync(outputPath);

    // Clean temp files
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return outputPath;
  } catch (error) {
    console.error("Bestie image error:", error);
    throw error;
  }
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const mentions = Object.keys(event.mentions);

  if (mentions.length === 0) {
    return api.sendMessage("কাউকে @mention করো তো বেস্টি দেখাই 😅", threadID, messageID);
  }

  const one = senderID;
  const two = mentions[0];

  try {
    const path = await makeImage({ one, two });

    api.sendMessage({
      body: `✧•❁𝐅𝐫𝐢𝐞𝐧𝐝𝐬𝐡𝐢𝐩❁•✧

╔═══❖••° °••❖═══╗

   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠

╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶

       👑𝐘𝐄 𝐋𝐄 𝐌𝐈𝐋 𝐆𝐀𝐈 ❤

𝐓𝐄𝐑𝐈 𝐁𝐄𝐒𝐓𝐈𝐄 🩷

   ✶⊶⊷⊷❍⊶⊷⊷✶`,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  } catch (err) {
    api.sendMessage("ইমেজ তৈরি করতে সমস্যা হয়েছে 😔 Try again!", threadID, messageID);
  }
};