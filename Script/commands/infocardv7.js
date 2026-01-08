module.exports.config = {
  name: "cardinfo7",
  version: "3.0.0", // Ultimate Memory-Safe Version - Kaguya Style
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Upgrade)",
  description: "Generate stylish user info card (no disk files)",
  commandCategory: "info",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

module.exports.circle = async (buffer) => {
  const Jimp = require("jimp");
  const image = await Jimp.read(buffer);
  image.circle();
  return await image.getBufferAsync(Jimp.MIME_PNG);
};

module.exports.run = async function ({ api, event, args, Users }) {
  const axios = require("axios");
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = require("fs-extra");

  let uid = event.senderID;
  if (event.type === "message_reply") uid = event.messageReply.senderID;

  try {
    // Fetch user info
    const res = await api.getUserInfoV2(uid);
    if (!res || !res[uid]) throw new Error("User info not found");

    const user = res[uid];
    const gender = user.gender === "male" ? "Male" : user.gender === "female" ? "Female" : "Not found";
    const birthday = user.birthday || "Not found";
    const relationship = user.relationship_status || "Not found";
    const follow = user.follow || "Not found";
    const location = user.location?.name || "Not found";
    const hometown = user.hometown?.name || "Not found";
    const profileLink = user.link || `https://facebook.com/${uid}`;

    // Download background & avatar as Buffer
    const bgBuffer = (await axios.get("https://i.imgur.com/rqbC4ES.jpg", { responseType: "arraybuffer" })).data;
    const avaBufferRaw = (await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=1449557605494892|aaf0a865c8bafc314ced5b7f18f3caa6`, { responseType: "arraybuffer" })).data;

    // Circle avatar (memory only)
    const circledAvaBuffer = await module.exports.circle(avaBufferRaw);

    // Load images from buffer
    const bgImg = await loadImage(Buffer.from(bgBuffer));
    const avaImg = await loadImage(circledAvaBuffer);

    const canvas = createCanvas(bgImg.width, bgImg.height);
    const ctx = canvas.getContext("2d");

    // Draw background & avatar
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avaImg, 910, 465, 229, 229);

    // Font loading (direct from URL to buffer)
    const fontUrl = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
    const fontBuffer = (await axios.get(fontUrl, { responseType: "arraybuffer" })).data;
    registerFont(Buffer.from(fontBuffer), { family: "Play-Bold" });

    // Text drawing
    ctx.font = "35px Play-Bold";
    ctx.fillStyle = "#00FFFF";
    ctx.textAlign = "start";

    ctx.fillText(`Name: ${user.name || "Not found"}`, 340, 560);
    ctx.fillText(`Sex: ${gender}`, 1245, 448);
    ctx.fillText(`Follow: ${follow}`, 1245, 505);
    ctx.fillText(`Relationship: ${relationship}`, 1245, 559);
    ctx.fillText(`Birthday: ${birthday}`, 1245, 616);
    ctx.fillText(`Location: ${location}`, 1245, 668);
    ctx.fillText(`Hometown: ${hometown}`, 1245, 723);

    ctx.font = "28px Play-Bold";
    ctx.fillStyle = "#FFCC33";
    ctx.fillText(`UID: ${uid}`, 814, 728);

    ctx.font = "28px Arial";
    ctx.fillStyle = "#00FF00";
    ctx.fillText(`Profile: ${profileLink}`, 32, 727);

    // Generate buffer directly
    const imageBuffer = canvas.toBuffer("image/png");

    return api.sendMessage({
      body: `🌙 **Kaguya's Info Card Manifested!** 🌙\n` +
            `User: ${user.name || "Mortal"}\n` +
            `All secrets unveiled by Byakugan~ 🔮\n` +
            `Enjoy your divine profile card! ✨`,
      attachment: imageBuffer
    }, event.threadID, event.messageID);

  } catch (error) {
    console.error("CardInfo7 Error:", error.message);
    return api.sendMessage(
      `🌑 Chakra flow disrupted! Error: ${error.message}\n` +
      `Possible causes:\n` +
      `• Invalid user ID or privacy settings\n` +
      `• Network/API issue\n` +
      `• Try replying to someone's message or use .cardinfo7 for yourself`,
      event.threadID, event.messageID
    );
  }
};