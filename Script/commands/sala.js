const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "sala",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Modified by rX Abdullah (File-free & optimized by Grok)",
  description: "তুই আমার সালা বানানোর ফান ইমেজ এডিট",
  commandCategory: "Bonding",
  usages: "sala @কেউ",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
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
  const outputPath = path.join(__root, `sala_\( {one}_ \){two}.png`);

  try {
    // তোমার দেওয়া টেমপ্লেট লিঙ্ক (এটাই ব্যাকগ্রাউন্ড)
    const templateUrl = "https://i.postimg.cc/jdp17LNv/IMG-6498.jpg";

    const bg_img = await jimp.read(templateUrl);

    // FB অ্যাভাটার লোড
    const avatarOneUrl = `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const avatarTwoUrl = `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    const [getAvatarOne, getAvatarTwo] = await Promise.all([
      axios.get(avatarOneUrl, { responseType: "arraybuffer", timeout: 15000 }),
      axios.get(avatarTwoUrl, { responseType: "arraybuffer", timeout: 15000 })
    ]);

    fs.writeFileSync(avatarOnePath, Buffer.from(getAvatarOne.data));
    fs.writeFileSync(avatarTwoPath, Buffer.from(getAvatarTwo.data));

    const circleOne = await circle(avatarOnePath);
    const circleTwo = await circle(avatarTwoPath);

    // তোমার টেমপ্লেটের জন্য পজিশন (অ্যাডজাস্ট করা)
    bg_img.resize(500, 300) // তোমার ছবির সাইজ মিলিয়ে
      .composite(circleOne.resize(70, 70), 120, 110)   // বাম অ্যাভাটার
      .composite(circleTwo.resize(70, 70), 310, 110); // ডান অ্যাভাটার

    await bg_img.writeAsync(outputPath);

    // টেম্প ফাইল অটো রিমুভ
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return outputPath;
  } catch (error) {
    console.error("Sala image error:", error.message);
    throw new Error("ইমেজ তৈরি করতে সমস্যা হয়েছে 😔");
  }
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID, mentions } = event;

  const mention = Object.keys(mentions);
  if (mention.length === 0) {
    return api.sendMessage("একজনকে @ট্যাগ কর সালা বানানোর জন্য 😈", threadID, messageID);
  }

  const one = senderID;
  const two = mention[0];

  try {
    const imgPath = await makeImage({ one, two });

    api.sendMessage({
      body: "তুই আমার বন্ধু না, তুই আমার সালা 😏🔥",
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => {
      // ফাইল অটো রিমুভ
      fs.unlinkSync(imgPath);
    }, messageID);
  } catch (err) {
    console.error("Sala error:", err.message);
    api.sendMessage("ইমেজ তৈরি করতে সমস্যা হয়েছে 😔 আবার ট্রাই করো!", threadID, messageID);
  }
};