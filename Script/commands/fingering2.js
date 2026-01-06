module.exports.config = {
    name: "fingering2",
    version: "2.0.1",
    hasPermssion: 0,
    credits: "HRIDOY HOSSEN + GPT Secure Upgrade",
    description: "Funny fingering ship image generator",
    commandCategory: "nsfw",
    usages: "[tag someone]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', I'd inhering2.png');
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/eJziBTM.jpeg", path);
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let bg = await jimp.read(__root + "/fingering 2.png");
    let pathImg = __root + `/fingering_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    bg.resize(1024, 712)
      .composite(circleOne.resize(200, 200), 527, 141)
      .composite(circleTwo.resize(200, 200), 389, 407);

    let raw = await bg.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;

    var mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("⚠️ Please tag one person!", threadID, messageID);

    // 🛡️ Special ID Protection
    const specialIDs = [
        "100048786044500", // 🔹 তোমার Boss এর ID
        "100001162111551"   // 🔹 চাইলে আরও ID যোগ করো
    ];

    // যদি special ID mention করা হয়
    if (mention && specialIDs.includes(mention)) {
        return api.sendMessage(
            "😏 ঐটা আমার Boss এর ID! ওর সাথে এমনটা করা যাবে না 😤💀",
            threadID,
            messageID
        );
    }

    // 🔥 Normal case (image generate)
    let tag = event.mentions[mention].replace("@", "");
    var one = senderID, two = mention;

    return makeImage({ one, two }).then(path => {
        api.sendMessage({
            body: `💞 ${tag} তুমি কিন্তু এখন আমার Boss HRIDOY এর স্পেশাল moment এ চলে গেছো 😏`,
            mentions: [{ tag: tag, id: mention }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    });
};
