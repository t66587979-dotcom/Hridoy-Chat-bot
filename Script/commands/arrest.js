module.exports.config = {
 name: "arrest",
 version: "2.1.0",
 hasPermssion: 0,
 credits: "CYBER ☢️_𖣘 -BOT ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Arrest a friend you mention",
 commandCategory: "tagfun",
 usages: "[mention]",
 cooldowns: 2,
 dependencies: {
 "axios": "",
 "fs-extra": "",
 "path": "",
 "jimp": ""
 }
};

// ❌ onLoad পুরো remove (local image দরকার নাই)

async function makeImage({ one, two }) {
 const fs = global.nodemodule["fs-extra"];
 const path = global.nodemodule["path"];
 const axios = global.nodemodule["axios"];
 const jimp = global.nodemodule["jimp"];

 const cachePath = path.resolve(__dirname, "cache");
 if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

 // ✅ DIRECT IMAGE LINK (no local file)
 let batgiam_img = await jimp.read("https://i.imgur.com/SRuMrVG.jpeg");

 const randomID = Math.floor(Math.random() * 999999);
 let pathImg = `${cachePath}/batgiam_${randomID}.png`;
 let avatarOne = `${cachePath}/avt_${one}_${randomID}.png`;
 let avatarTwo = `${cachePath}/avt_${two}_${randomID}.png`;

 const avatarUrlOne = `https://graph.facebook.com/${one}/picture?width=512&height=512`;
 const avatarUrlTwo = `https://graph.facebook.com/${two}/picture?width=512&height=512`;

 const getAvatarOne = (await axios.get(avatarUrlOne, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, "utf-8"));

 const getAvatarTwo = (await axios.get(avatarUrlTwo, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, "utf-8"));

 let circleOne = await jimp.read(await circle(avatarOne));
 let circleTwo = await jimp.read(await circle(avatarTwo));

 batgiam_img
 .resize(500, 500)
 .composite(circleOne.resize(100, 100), 375, 9)
 .composite(circleTwo.resize(100, 100), 160, 92);

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

 if (!event.mentions || Object.keys(event.mentions).length === 0)
 return api.sendMessage(
 "বলদ 😑 একজনকে ট্যাগ না করলে arrest কাজ করবে নাকি?",
 threadID,
 messageID
 );

 var mention = Object.keys(event.mentions)[0];
 let tag = event.mentions[mention].replace("@", "");
 var one = senderID, two = mention;

 return makeImage({ one, two }).then(path =>
 api.sendMessage({
 body: `হালা মুরগী চোর 🐔🚨  
আজকে তোর পালানোর সব রাস্তা বন্ধ 😹  
=> ${tag}`,
 mentions: [{
 tag: tag,
 id: mention
 }],
 attachment: fs.createReadStream(path)
 }, threadID, () => fs.unlinkSync(path), messageID));
};
