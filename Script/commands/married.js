const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "married",
    version: "3.1.1",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Send a married frame to someone",
    commandCategory: "Love",
    usages: "[@mention]",
    cooldowns: 5
};

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const bgURL = "https://i.imgur.com/txnRTKf.png";
    const bg = await jimp.read(bgURL);

    const pathImg = path.join(cacheDir, `married_${one}_${two}.png`);
    const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);

    const getAvatar = async (uid, filePath) => {
        const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        const data = (await axios.get(url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(filePath, Buffer.from(data));
    };

    await getAvatar(one, avatarOnePath);
    await getAvatar(two, avatarTwoPath);

    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    // Adjust positions and size
    bg.composite(circleOne.resize(170, 170), 1520, 210)
      .composite(circleTwo.resize(170, 170), 980, 300);

    const finalBuffer = await bg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, finalBuffer);

    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return pathImg;
}

module.exports.run = async function ({ event, api }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0];

    if (!mention) return api.sendMessage("Please mention 1 person.", threadID, messageID);

    const one = senderID, two = mention;

    try {
        const path = await makeImage({ one, two });
        return api.sendMessage({
            body: "",
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ ছবিটি তৈরি করতে সমস্যা হয়েছে!", threadID, messageID);
    }
};
