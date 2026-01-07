const { join } = require('path');
const { writeFileSync, existsSync, createReadStream, readFileSync } = require('fs-extra');
const moment = require("moment-timezone");
const axios = require('axios');

module.exports.config = {
    name: "dating",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Dũng, Modded: TuấnDzz (Fixed by Grok)",
    description: "Hẹn hò qua messenger? (Couple simulation with pet, house, daily, shop)",
    commandCategory: "game",
    usages: "[shop/info/breakup/daily/top/house/pet/exchange]",
    cooldowns: 5
};

const _1DAY = 1000 * 60 * 60 * 24;

// Thính + House quotes
const thinh = ["Chocolate đắng đầu lưỡi nhưng ngọt ở cuống họng, như tình yêu em dành cho anh.", /* ... তোমার পুরো array ... */];
const TextForHouse = ["Gia đình là điều quan trọng nhất trên thế giới này", /* ... তোমার পুরো array ... */];

// JSON path (একটা পাথ ব্যবহার করো)
const DATA_PATH = join(__dirname, 'cache', 'dating.json');

module.exports.onLoad = function () {
    if (!existsSync(DATA_PATH)) {
        writeFileSync(DATA_PATH, JSON.stringify([], null, 4));
    }

    // Auto update interval (days + pet health)
    setInterval(() => {
        const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
        const today = new Date();

        for (let couple of data) {
            if (!couple.data) continue;

            // Update days
            const startDate = new Date(couple.data.timestamp);
            couple.data.countDays = Math.ceil((today - startDate) / _1DAY);

            // Pet health degrade
            if (couple.data.pet && couple.data.pet.length > 0) {
                if (Date.now() - couple.data.petLastFeed > _1DAY * 2) {
                    couple.data.pet = [];
                    delete couple.data.petLastFeed;
                }
                for (let pet of couple.data.pet) {
                    if (Math.random() > 0.7) {
                        if (pet.health === 'good') pet.health = 'normal';
                        else if (pet.health === 'normal') {
                            pet.health = 'bad';
                            pet.timeHealtStartBeingBad = Date.now();
                        }
                    }
                    if (pet.timeHealtStartBeingBad && Date.now() - pet.timeHealtStartBeingBad > _1DAY * 3) {
                        delete pet.timeHealtStartBeingBad;
                    }
                }
            }
        }
        writeFileSync(DATA_PATH, JSON.stringify(data, null, 4));
    }, 60000); // প্রতি মিনিটে চেক (সেভ করতে পারো 5min-এ)
};

function getMsg() {
    return `𝐌𝐨̣𝐢 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐜𝐮̀𝐧𝐠 𝐭𝐨̛́𝐢 𝐜𝐡𝐮́𝐜 𝐦𝐮̛̀𝐧𝐠 𝐡𝐚̣𝐧𝐡 𝐩𝐡𝐮́𝐜 𝐜𝐡𝐨 𝟐 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐧𝐚̀𝐨 🥰\n\𝐋𝐮̛𝐮 𝐘́:\n- 𝐂𝐚̉ 𝟐 𝐛𝐚̣𝐧 𝐬𝐞̃ 𝐤𝐡𝐨̂𝐧𝐠 𝐭𝐡𝐞̂̉ 𝐜𝐡𝐢𝐚 𝐭𝐚𝐲 𝐭𝐫𝐨𝐧𝐠 𝐯𝐨̀𝐧𝐠 𝟕 𝐧𝐠𝐚̀𝐲\n- 𝐂𝐮𝐨̂́𝐢 𝐜𝐮̀𝐧𝐠 𝐜𝐡𝐮́𝐜 𝐜𝐚̉ 𝟐 𝐛𝐚̣𝐧 𝐜𝐨́ 𝐧𝐡𝐢𝐞̂̀𝐮 𝐧𝐢𝐞̂̀𝐦 𝐡𝐚̣𝐧𝐡 𝐩𝐡𝐮́𝐜\n- 𝐊𝐲́ 𝐭𝐞̂𝐧: 𝑵𝒈𝒖𝒚𝒆̂̃𝒏 𝑷𝒉𝒂̣𝒎 𝑴𝒊𝒏𝒉 𝑻𝒖𝒂̂́𝒏 ❤️`;
}

module.exports.run = async function ({ api, event, args, Users, Currencies }) {
    const { threadID, messageID, senderID, body } = event;
    let data = JSON.parse(readFileSync(DATA_PATH, 'utf-8')) || [];

    const command = (args[0] || '').toLowerCase();

    const userData = await Users.getData(senderID);
    const couple = data.find(c => c.ID_one === senderID || c.ID_two === senderID);

    // কমান্ড হ্যান্ডলিং
    switch (command) {
        case 'info':
        case '-i':
            if (!couple || !couple.status) return api.sendMessage("𝐁𝐚̣𝐧 𝐜𝐡𝐮̛𝐚 𝐡𝐞̣𝐧 𝐡𝐨̀ 𝐯𝐨̛́𝐢 𝐚𝐢 😔", threadID, messageID);
            const yourName = couple.ID_one === senderID ? couple.name_one : couple.name_two;
            const partnerName = couple.ID_two === senderID ? couple.name_one : couple.name_two;
            const msg = `💓==『 𝐁𝐞𝐞𝐧 𝐓𝐨𝐠𝐞𝐭𝐡𝐞𝐫 』==💓\n\n» ❤️ 𝗧𝗲̂𝗻 𝗯𝗮̣𝗻: ${yourName}\n» 🤍 𝗧𝗲̂𝗻 𝗽𝗮𝗿𝘁𝗻𝗲𝗿: ${partnerName}\n» 💌 𝗛𝗲̣𝗻 𝗵𝗼̀ 𝘃𝗮̀𝗼: ${moment(couple.data.timestamp).format("DD/MM/YYYY")}\n» 📆 𝗬𝗲̂𝘂 𝗻𝗵𝗮𝘂: ${couple.data.countDays} 𝗻𝗴𝗮̀𝘆\n» 🎁 𝗣𝗼𝗶𝗻𝘁: ${couple.data.point}\n» 🏆 𝗥𝗮𝗻𝗸: ${getRank(senderID, data)}\n\n» 💘 𝗧𝗵𝗶́𝗻𝗵: ${thinh[Math.floor(Math.random() * thinh.length)]}`;
            return api.sendMessage({ body: msg }, threadID, messageID); // canvas যোগ করতে পারো পরে

        case 'daily':
        case 'diemdanh':
            if (!couple || !couple.status) return api.sendMessage("𝐅𝐀 𝐦𝐚̀ 𝐝𝐢𝐞𝐦𝐝𝐚𝐧𝐡 𝐜𝐚́𝐢 𝐠𝐢̀?", threadID, messageID);
            if (couple.data.daily && Date.now() - couple.data.daily < _1DAY) {
                return api.sendMessage("𝐇𝐨̂𝐦 𝐧𝐚𝐲 𝐝𝐢𝐞𝐦𝐝𝐚𝐧𝐡 𝐫𝐨̂̀𝐢, 𝐪𝐮𝐚𝐲 𝐥𝐚̣𝐢 𝐬𝐚𝐮 𝟐𝟒𝐡 𝐧𝐡𝐞́!", threadID, messageID);
            }
            return api.sendMessage("𝐂𝐚̉ 𝟐 𝐭𝐡𝐚̉ [❤️] 𝐯𝐚̀𝐨 𝐭𝐢𝐧 𝐧𝐡𝐚̆́𝐧 𝐧𝐚̀𝐲 𝐧𝐞̂́𝐮 𝐜𝐨́ 𝐦𝐮𝐨̂́𝐧 𝐝𝐢𝐞𝐦𝐝𝐚𝐧𝐡!", threadID, (err, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'daily',
                    messageID: info.messageID,
                    senderID,
                    couple
                });
            }, messageID);

        // অন্যান্য কেস (shop, breakup, top, house, pet, exchange) একইভাবে হ্যান্ডেল করো
        // উদাহরণ: breakup
        case 'breakup':
        case 'chiatay':
        case 'ct':
            if (!couple || !couple.status) return api.sendMessage("𝐂𝐡𝐮̛𝐚 𝐡𝐞̣𝐧 𝐡𝐨̀ 𝐯𝐨̛́𝐢 𝐚𝐢!", threadID, messageID);
            if (couple.data.countDays < 3) return api.sendMessage(`𝐂𝐨̀𝐧 \( {3 - couple.data.countDays} 𝐧𝐠𝐚̀𝐲 𝐦𝐚̀ 𝐜𝐡𝐢𝐚 𝐭𝐚𝐲? 🥺\n \){msgBreakup()}`, threadID, messageID);
            return api.sendMessage("𝐂𝐚̉ 𝟐 𝐭𝐡𝐚̉ [💔] 𝐧𝐞̂́𝐮 𝐭𝐡𝐚̣̂𝐭 𝐬𝐮̛̣ 𝐜𝐡𝐢𝐚 𝐭𝐚𝐲...", threadID, (err, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'breakup',
                    messageID: info.messageID,
                    senderID,
                    couple
                });
            }, messageID);

        default:
            if (!args[0]) {
                return api.sendMessage("𝐃ùng: !dating [nữ/nam] để tìm người yêu\n!dating info - Xem info\n!dating daily - Điểm danh\n!dating shop - Mua quà\n!dating breakup - Chia tay", threadID, messageID);
            }
            // প্রপোজ লজিক (যেমন নাম দিয়ে)
            const targetGender = args[0].toLowerCase();
            if (!['nữ', 'gái', 'nam', 'trai'].includes(targetGender)) return api.sendMessage("𝐍𝐚𝐦 𝐡𝐚𝐲 𝐍𝐮̛̃ ?", threadID, messageID);

            const fee = 2000;
            const userMoney = (await Currencies.getData(senderID)).money;
            if (userMoney < fee) return api.sendMessage(`𝐂𝐚̂̀𝐧 \( {fee} \) 𝐭𝐢𝐞̂̀𝐧 𝐩𝐡𝐢́ 𝐦𝐮𝐚 𝐧𝐡𝐚̂̃𝐧 💍`, threadID, messageID);

            await Currencies.decreaseMoney(senderID, fee);

            return api.sendMessage(`𝐁𝐚̣𝐧 𝐬𝐞̃ 𝐭𝐢̀𝐦 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐲𝐞̂𝐮 ${targetGender === 'nam' || targetGender === 'trai' ? 'nam' : 'nữ'} 💜\n𝐓𝐡𝐚̉ [❤️] 𝐧𝐞̂́𝐮 𝐜𝐡𝐚̂́𝐩 𝐧𝐡𝐚̣̂𝐧!`, threadID, (err, info) => {
                global.client.handleReaction.push({
                    name: this.config.name,
                    type: 'propose',
                    messageID: info.messageID,
                    senderID,
                    gender: targetGender
                });
            }, messageID);
    }
};

// Rank ফাংশন
function getRank(uid, data) {
    data.sort((a, b) => b.data.point - a.data.point);
    const rank = data.findIndex(c => c.ID_one === uid || c.ID_two === uid);
    return rank === -1 ? "Chưa có" : rank + 1;
}

// handleReaction (breakup, daily, propose ইত্যাদি)
module.exports.handleReaction = async function ({ api, event, handleReaction }) {
    // তোমার bot-এ handleReaction logic আছে, সেখানে যোগ করো
    // উদাহরণ: breakup confirm, daily point add ইত্যাদি
    // ফুল লজিক লাগলে বলো, আলাদা করে দিব
};

// handleReply (shop, house, pet)
module.exports.handleReply = async function ({ api, event, handleReply }) {
    // shop/house/pet reply logic এখানে
};