const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "kiss",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝐌_ ☢️",
    description: "Kiss the person you want",
    commandCategory: "Love",
    usages: "kiss [tag]",
    cooldowns: 5
};

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const cachePath = path.resolve(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

    const bg = await jimp.read("https://i.imgur.com/wDybmlY.jpeg");
    const pathImg = path.join(cachePath, `kiss_${one}_${two}.png`);
    const avatarOnePath = path.join(cachePath, `avt_${one}.png`);
    const avatarTwoPath = path.join(cachePath, `avt_${two}.png`);

    const getAvatar = async (uid, filePath) => {
        const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
        const avatarData = (await axios.get(url, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(filePath, Buffer.from(avatarData));
    };

    await getAvatar(one, avatarOnePath);
    await getAvatar(two, avatarTwoPath);

    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    bg.resize(700, 440)
      .composite(circleOne.resize(150, 150), 390, 23)
      .composite(circleTwo.resize(150, 150), 115, 130);

    const finalBuffer = await bg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, finalBuffer);

    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return pathImg;
}

module.exports.run = async function ({ event, api, Currencies }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0];
    if (!mention) return api.sendMessage("Please tag 1 person", threadID, messageID);

    const one = senderID, two = mention;

    const captions = [
        "কারণে অকারণে প্রতিদিন নিয়ম করে, তোমার মায়াতে জড়িয়ে পড়ছি আমি বারেবার!🌷",
        "তোমাকে কেন ভালোবাসি তার কোন বিশেষ কারণ আমার জানা নাই! কিন্তু তোমার কাছে সারাজীবন থেকে যাওয়ার হাজারটা কারণ আমার কাছে আছে!💚",
        "তোমার সাথে কাটানো সময়গুলোর কথা চিন্তা করলে মনে হয়, এই এক জনম তোমার সাথে অনেক কম সময়!😘",
        "প্রিয় তুমি কি আমার জীবনের সেই গল্প হবে? যেই গল্পের শুরু থাকবে, কিন্তু কোনো শেষ থাকবে না!♥️",
        "তুমি পাশে থাকলে সবকিছু সুন্দর মনে হয়, জীবন যেন একটা মধুর কবিতায় রূপ নেয়!😍",
        "তোমাকে ছাড়া জীবনটা অসম্পূর্ণ, তুমি আমার ভালোবাসার পূর্ণতা!🧡",
        "তুমি আমার স্বপ্ন, তুমি আমার জীবনের প্রতিটি সুন্দর মুহূর্ত!🌻",
        "আমার চোখে তোমার অস্থিত্ব খোঁজতে এসোনা, হারিয়ে যাবে! কেননা আমার পুরোটা-জুরেই তোমারই নির্বাক আনাগোনা!🌺",
        "তোমাতে শুরু তোমাতেই শেষ, তুমি না থাকলে আমাদের গল্প এখানেই শেষ!😘",
        "ভালোবাসা যদি কোনো অনুভূতি হয়, তাহলে তোমার প্রতি আমার অনুভূতি পৃথিবীর সেরা অনুভূতি।🌻ღ🌺"
    ];

    const caption = captions[Math.floor(Math.random() * captions.length)];

    await Currencies.increaseMoney(senderID, Math.floor(Math.random() * 101) * (Math.floor(Math.random() * 100000) + 100000));

    try {
        const imagePath = await makeImage({ one, two });
        return api.sendMessage({
            body: caption,
            attachment: fs.createReadStream(imagePath)
        }, threadID, () => fs.unlinkSync(imagePath), messageID);
    } catch (e) {
        console.error(e);
        return api.sendMessage("❌ ছবিটি তৈরি করতে সমস্যা হয়েছে!", threadID, messageID);
    }
};
