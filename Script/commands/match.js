const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
  name: "match",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "rX Abdullah (Customized by Grok for your template)",
  description: "ট্যাগ বা রিপ্লাই করা ইউজারের সাথে ম্যাচ পার্সেন্টেজ + কাপল ইমেজ",
  commandCategory: "Picture",
  usages: "match @কেউ বা রিপ্লাই করে match",
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
  const outputPath = path.join(__root, `match_\( {one}_ \){two}.png`);

  try {
    // তোমার দেওয়া কাস্টম টেমপ্লেট লিঙ্ক
    const templateUrl = "https://i.imgur.com/ewj3AA6.jpeg";

    const pairing_img = await jimp.read(templateUrl);

    // FB অ্যাভাটার লোড
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

    // তোমার টেমপ্লেটের জন্য অ্যাডজাস্টেড পজিশন
    pairing_img.composite(circleOne.resize(220, 220), 180, 220);  // বাম অ্যাভাটার
    pairing_img.composite(circleTwo.resize(220, 220), 620, 220); // ডান অ্যাভাটার

    await pairing_img.writeAsync(outputPath);

    // টেম্প ফাইল অটো রিমুভ
    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return outputPath;
  } catch (error) {
    console.error("Match image error:", error.message);
    throw new Error("ইমেজ তৈরি করতে পারিনি 😔");
  }
}

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  let partnerID, partnerName;

  // ট্যাগ চেক
  if (mentions && Object.keys(mentions).length > 0) {
    partnerID = Object.keys(mentions)[0];
    partnerName = mentions[partnerID].replace("@", "");
  }
  // রিপ্লাই চেক
  else if (type === "message_reply" && messageReply.senderID) {
    partnerID = messageReply.senderID;
    try {
      const info = await api.getUserInfo(partnerID);
      partnerName = info[partnerID].name;
    } catch (err) {
      partnerName = "ইউজার";
    }
  }
  else {
    return api.sendMessage("⚠️ কাউকে @ট্যাগ করো বা কারো মেসেজ রিপ্লাই করে কমান্ড দাও!", threadID, messageID);
  }

  let senderInfo;
  try {
    senderInfo = await api.getUserInfo(senderID);
  } catch (err) {
    senderInfo = { [senderID]: { name: "তুমি" } };
  }
  const senderName = senderInfo[senderID]?.name || "তুমি";

  const percentages = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', '0%', '48%'];
  const matchRate = percentages[Math.floor(Math.random() * percentages.length)];

  const mentionArr = [
    { id: senderID, tag: senderName },
    { id: partnerID, tag: partnerName }
  ];

  try {
    const imgPath = await makeImage({ one: senderID, two: partnerID });

    api.sendMessage({
      body: `💞 ম্যাচ রেজাল্ট 💞\n\n` +
            `• ${senderName} 🎀\n` +
            `• ${partnerName} 🎀\n` +
            `❤️ লাভ পার্সেন্টেজ: ${matchRate}\n\n` +
            `কাপল হওয়ার চান্স: ${matchRate === '100%' ? '১০০% গ্যারান্টি!' : 'চেষ্টা করো 😏'}`,
      mentions: mentionArr,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => {
      // ফাইল অটো রিমুভ
      fs.unlinkSync(imgPath);
    }, messageID);
  } catch (err) {
    console.error("Match error:", err.message);
    api.sendMessage("ইমেজ বানাতে সমস্যা হয়েছে 😔 আবার ট্রাই করো!", threadID, messageID);
  }
};