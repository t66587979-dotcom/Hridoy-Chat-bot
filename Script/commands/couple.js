module.exports.config = {
    name: "couple",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
    description: "Seo phi",
    commandCategory: "Love",
    usages: "[tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"]; 
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache");

    if (!fs.existsSync(__root)) fs.mkdirSync(__root, { recursive: true });

    // ✅ DIRECT IMAGE LINK
    let batgiam_img = await jimp.read("https://i.imgur.com/hmKmmam.jpg");

    let pathImg = `${__root}/couple_${one}_${two}.png`;
    let avatarOne = `${__root}/avt_${one}.png`;
    let avatarTwo = `${__root}/avt_${two}.png`;
    
    // FB PFP WITH ACCESS TOKEN
    let getAvatarOne = (await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));

    // ❌ position / size same
    batgiam_img
        .resize(1024, 712)
        .composite(circleOne.resize(200, 200), 527, 141)
        .composite(circleTwo.resize(200, 200), 389, 407);
    
    let raw = await batgiam_img.getBufferAsync("image/png");
    
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

module.exports.run = async function ({ event, api }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    var mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);

    let tag = event.mentions[mention].replace("@", "");
    var one = senderID, two = mention;

    return makeImage({ one, two }).then(path =>
        api.sendMessage({
            body: "Ship 💖",
            mentions: [{ tag: tag, id: mention }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID)
    );
};
