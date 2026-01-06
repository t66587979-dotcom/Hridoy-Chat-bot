const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "married3",
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
    const cacheDir = path.join(__dirname, "cache", "canvas");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const bgPath = path.join(cacheDir, "marriedv4.png");
    if (!fs.existsSync(bgPath)) {
        const url = "https://i.ibb.co/9ZZCSzR/ba6abadae46b5bdaa29cf6a64d762874.jpg";
        const data = (await axios.get(url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(bgPath, Buffer.from(data));
    }

    const married_img = await jimp.read(bgPath);
    const pathImg = path.join(cacheDir, `married_${one}_${two}.png`);
    const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);

    const getAvatar = async (uid, filePath) => {
        const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        const data = (await axios.get(url, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(filePath, Buffer.from(data));
    };

    await getAvatar(one, avatarOnePath);
    await getAvatar(two, avatarTwoPath);

    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    married_img
        .composite(circleOne.resize(130, 130), 200, 70)
        .composite(circleTwo.resize(130, 130), 350, 150);

    const finalBuffer = await married_img.getBufferAsync("image/png");
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
    const captions = [
        "💟ღ──💘তোমার ভালোবাসা, আমার জীবনের সবথেকে বড় উপহার।💘──💟",
        "তোমার চোখে তাকালেই আমার যে একটা পৃথিবীর আছে সেটা আমি সবকিছু ভুলে যাই!💚❤️‍🩹💞",
        "তুমি আমার জীবনের সেই গল্প, যেই গল্প আমি কোন দিন শেষ করতে চাই না!🥰😘🌻",
        "I am so lucky person! তোমার মতো একজন ভালোবাসায়ী মানুষ আমার জীবন সঙ্গী হিসাবে পেয়ে!❤️‍🩹💞🌺",
        "I feel complete in my life, যখন ভাবি তোমার মতো একটা লক্ষ্মী মানুষ আমার জীবন সঙ্গী!💝",
        "তোমাতে শুরু তোমাতেই শেষ, তুমি না থাকলে আমাদের গল্প এখানেই শেষ!🌺",
        "আমি ছিলাম, আমি আছি আমি থাকবো, শুধু তোমারই জন্য!💞",
        "❥💙══ღ══❥তোমাকে জড়িয়ে ধরার সুখ এই পৃথিবীর কোনো কিছু দিয়ে কেনা যায় না প্রিয়তমা।══ღ══❥💙❥",
        "🌻•━এতো ভালোবাসি এতো যারে চাই…মনে হয় নাতো সে যে কাছে নাই!🌻•━",
        "🌼══ღ══❥চলার পথে আমার হাতে তোমার হাতটা গুঁজে দিও, হাঁটতে গিয়ে হোঁচট খেলে আমায় তুমি সামলে নিও।🌼══ღ══❥",
        "💠✦💟✦💠আমার মনে হয় আমার মনের মধ্যে একটা নরম জমিটায়, শুধু তোমার বসবাস।💠✦💟✦💠",
        "আমার জীবনে সুখ-শান্তি লাগবে না, আমি শুধু তোমাকে চাই!🌼"
    ];
    const caption = captions[Math.floor(Math.random() * captions.length)];

    try {
        const path = await makeImage({ one, two });
        return api.sendMessage({
            body: caption,
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("ছবি তৈরি করতে সমস্যা হয়েছে।", threadID, messageID);
    }
};
