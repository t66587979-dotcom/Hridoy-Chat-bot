const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");

module.exports.config = {
 name: "resend",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️",
 description: "Auto resend removed messages",
 commandCategory: "System",
 usages: "",
 cooldowns: 0,
 hide: true,
 dependencies: {
 request: "",
 "fs-extra": "",
 axios: ""
 }
};

module.exports.handleEvent = async function ({ event, api, Users }) {
 const { threadID, messageID, senderID, body, attachments, type } = event;

 if (!global.logMessage) global.logMessage = new Map();
 if (!global.data.botID) global.data.botID = api.getCurrentUserID();

 const threadData = global.data.threadData.get(threadID) || {};
 if ((threadData.resend === undefined || threadData.resend !== false) && senderID !== global.data.botID) {
 
 if (type !== "message_unsend") {
 global.logMessage.set(messageID, {
 msgBody: body,
 attachment: attachments
 });
 }

 
 if (type === "message_unsend") {
 const msg = global.logMessage.get(messageID);
 if (!msg) return;

 const userName = await Users.getNameUser(senderID);


 if (!msg.attachment || msg.attachment.length === 0) {
 return api.sendMessage(
 `═════════════════════\n 𝙆𝙖𝙜𝙪𝙮𝙖 Ō𝙩𝙨𝙪𝙩𝙨𝙪𝙠𝙞\n═════════════════════\n\nকই গো সবাই দেখুন🥺\n@${userName} এই লুচ্ছায়\nমাত্র 👉 [${msg.msgBody}] 👈\nএই টেক্সট টা  রিমুভ দিছে😁\n\n═════════════════════\n 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍\n═════════════════════`,
 threadID,
 (err, info) => {
 if (!err && info) {
 api.sendMessage({ mentions: [{ tag: userName, id: senderID }] }, threadID);
 }
 }
 );
 }

 
 let attachmentsList = [];
 let count = 0;
 for (const file of msg.attachment) {
 count++;
 const ext = file.url.substring(file.url.lastIndexOf(".") + 1);
 const filePath = __dirname + `/cache/resend_${count}.${ext}`;
 const fileData = (await axios.get(file.url, { responseType: "arraybuffer" })).data;
 fs.writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
 attachmentsList.push(fs.createReadStream(filePath));
 }

 const resendMsg = {
 body: `@${userName} এই হালায় এই মাত্র এইডা রিমুভ দিছে🙆 সবাই দেখে নেও🐸😁${msg.msgBody ? `\n\nContent: ${msg.msgBody}` : ""}`,
 attachment: attachmentsList,
 mentions: [{ tag: userName, id: senderID }]
 };

 return api.sendMessage(resendMsg, threadID);
 }
 }
};

module.exports.languages = {
 vi: {
 on: "Bật",
 off: "Tắt",
 successText: "resend thành công"
 },
 en: {
 on: "on",
 off: "off",
 successText: "resend success!"
 }
};

module.exports.run = async function ({ api, event, Threads, getText }) {
 const { threadID, messageID } = event;
 let data = (await Threads.getData(threadID)).data || {};

 data.resend = !data.resend;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);

 return api.sendMessage(`${data.resend ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
};
