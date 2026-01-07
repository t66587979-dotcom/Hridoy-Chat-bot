const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "bestie",
  version: "7.3.3",
  hasPermssion: 0,
  credits: "Priyansh Rajput (Customized by Grok for your template)",
  description: "Bestie/Bestu pair image with your custom background",
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

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
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
    // তোমার কাস্টম ব্যাকগ্রাউন্ড লিঙ্ক এখানে দাও
    const backgroundUrl = "https://i.imgur.com/তোমার-লিঙ্ক.jpg"; // ← এখানে তোমার ছবির লিঙ্ক পেস্ট করো

    const batgiam_img = await jimp.read(backgroundUrl);

    // FB avatars
    const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    const [getAvatarOne, getAvatarTwo] = await Promise.all([
      axios.get(avatarOneUrl, { responseType: "arraybuffer" }),
      axios.get(avatarTwoUrl, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data));
    fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data));

    const circleOne = await circle(avatarOnePath);
    const circleTwo = await circle(avatarTwoPath);

    // তোমার ছবির জন্য পজিশন (এখানে অ্যাডজাস্ট করা হয়েছে)
    batgiam_img.composite(circleOne.resize(220, 220), 180, 180);  // বাম অ্যাভাটার
    batgiam_img.composite(circleTwo.resize(220, 220), 620, 180); // ডান অ্যাভাটার

    await batgiam_img.writeAsync(outputPath);

    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return outputPath;
  } catch (error) {
    console.error("Bestie error:", error.message);
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
    const imgPath = await makeImage({ one, two });

    api.sendMessage({
      body: `✧•❁𝐅𝐫𝐢𝐞𝐧𝐝𝐬𝐡𝐢𝐩❁•✧

╔═══❖••° °••❖═══╗

   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠

╚═══❖••° °••❖═══╝

   ✶⊶⊷⊷❍⊶⊷⊷✶

       👑𝐘𝐄 𝐋𝐄 𝐌𝐈𝐋 𝐆𝐀𝐈 ❤

𝐓𝐄𝐑𝐈 𝐁𝐄𝐒𝐓𝐈𝐄 🩷

   ✶⊶⊷⊷❍⊶⊷⊷✶`,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath), messageID);
  } catch (err) {
    api.sendMessage("ইমেজ তৈরি করতে সমস্যা হয়েছে 😔 আবার ট্রাই করো!", threadID, messageID);
  }
};