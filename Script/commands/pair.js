const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "pair",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "Pair two users with a fun compatibility score",
    commandCategory: "Picture",
    cooldowns: 5,
    dependencies: {}
};

async function makeImage({ one, two }) {
    const template = await jimp.read("https://i.postimg.cc/X7R3CLmb/267378493-3075346446127866-4722502659615516429-n.png");
    const pathImg = `/tmp/pairing_${one}_${two}.png`;

    const getAvatar = async (uid) => {
        const res = await axios.get(
            `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
            { responseType: "arraybuffer" }
        );
        const avatar = await jimp.read(res.data);
        avatar.circle();
        return avatar;
    };

    const avatarOne = await getAvatar(one);
    const avatarTwo = await getAvatar(two);

    template
        .composite(avatarOne.resize(150, 150), 980, 200)
        .composite(avatarTwo.resize(150, 150), 140, 200);

    const buffer = await template.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, buffer);

    return pathImg;
}

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    try {
        const percentages = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', '0%', '48%'];
        const matchRate = percentages[Math.floor(Math.random() * percentages.length)];

        const senderInfo = await api.getUserInfo(senderID);
        const senderName = senderInfo[senderID].name;

        const threadInfo = await api.getThreadInfo(threadID);
        const participants = threadInfo.participantIDs.filter(id => id !== senderID);

        if (participants.length === 0) {
            return api.sendMessage("❌ There's no one else in the chat to pair with!", threadID, messageID);
        }

        const partnerID = participants[Math.floor(Math.random() * participants.length)];
        const partnerInfo = await api.getUserInfo(partnerID);
        const partnerName = partnerInfo[partnerID].name;

        const mentions = [
            { id: senderID, tag: senderName },
            { id: partnerID, tag: partnerName }
        ];

        const path = await makeImage({ one: senderID, two: partnerID });

        return api.sendMessage({
            body: `🥰 Successful Pairing!\n💌 Wishing you two a lifetime of unexpected happiness – even with a ${matchRate} match!\n💕 Compatibility Score: ${matchRate}\nUnlikely but Unstoppable: [${senderName} + ${partnerName}] 💑`,
            mentions,
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to pair users. Please try again later.", threadID, messageID);
    }
};
