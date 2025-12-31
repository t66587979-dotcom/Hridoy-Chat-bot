module.exports.config = {
    name: "fuck2",
    version: "3.1.1",
    hasPermssion: 2,
    credits: "C B T",
    description: "Get fuck",
    commandCategory: "nsfw",
    usages: "[@mention]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "jimp": ""
    }
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];

    // সরাসরি online image লিঙ্ক ব্যবহার
    let batgiam_img = await jimp.read("https://i.ibb.co/TW9Kbwr/images-2022-08-14-T183542-356.jpg");

    const avatarOne = `/tmp/avt_${one}.png`;
    const avatarTwo = `/tmp/avt_${two}.png`;
    const pathImg = `/tmp/batman${one}_${two}.png`;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));

    batgiam_img.composite(circleOne.resize(100, 100), 20, 300)
               .composite(circleTwo.resize(150, 150), 100, 20);

    const raw = await batgiam_img.getBufferAsync("image/png");
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
    const mention = Object.keys(event.mentions);

    if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
    const one = senderID, two = mention[0];

    const path = await makeImage({ one, two });
    return api.sendMessage({ body: "", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
};
