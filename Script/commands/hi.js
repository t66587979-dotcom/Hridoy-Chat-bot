const moment = require("moment-timezone");

module.exports.config = {
  name: "",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Auto reply with sticker when someone says hi",
  commandCategory: "Auto-Response",
  usages: "[text]",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const KEYWORDS = [
    "hi", "hello", "hai", "helo", "hii", "hí", "lô", "chao", "chào", "hê nhô"
  ];

  // Check if auto reply is ON for this thread
  const threadData = global.data.threadData.get(threadID) || {};
  if (threadData["hi"] === false) return;

  if (KEYWORDS.includes(body.toLowerCase())) {
    const stickers = [
      "526214684778630", "526220108111421", "526220308111401",
      "526220484778050", "526220691444696", "526220814778017",
      "526220978111334", "526221104777988", "526221318111300",
      "526221564777942", "526221711444594", "526221971444568",
      "2041011389459668", "2041011569459650", "2041011726126301",
      "2041011836126290", "2041011952792945", "2041012109459596",
      "2041012262792914", "2041012406126233", "2041012539459553",
      "2041012692792871", "2041014432792697", "2041014739459333",
      "2041015016125972", "2041015182792622", "2041015329459274",
      "2041015422792598", "2041015576125916", "2041017422792398",
      "2041020049458802", "2041020599458747", "2041021119458695",
      "2041021609458646", "2041022029458604", "2041022286125245"
    ];

    const sticker = stickers[Math.floor(Math.random() * stickers.length)];
    const name = await Users.getNameUser(senderID);

    // Determine time-based greeting
    const hour = parseInt(moment.tz("Asia/Dhaka").format("HH"));
    let session;
    if (hour >= 0 && hour < 4) session = "🌃 late night";
    else if (hour >= 4 && hour < 8) session = "🌅 early morning";
    else if (hour >= 8 && hour < 12) session = "🌞 morning";
    else if (hour >= 12 && hour < 17) session = "☀️ afternoon";
    else if (hour >= 17 && hour < 20) session = "🌇 evening";
    else session = "🌙 night";

    const msg = {
      body: `👋 Hi ${name}, have a good ${session}!`,
      mentions: [{ tag: name, id: senderID }]
    };

    api.sendMessage(msg, threadID, (err, info) => {
      if (err) return;
      setTimeout(() => {
        api.sendMessage({ sticker }, threadID);
      }, 300);
    }, messageID);
  }
};

module.exports.languages = {
  "en": { on: "on", off: "off", successText: "Auto-reply feature toggled successfully!" },
  "vi": { on: "Bật", off: "Tắt", successText: "đã thay đổi trạng thái thành công" }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data;

  data["hi"] = !data["hi"];
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(
    `${data["hi"] ? getText("on") : getText("off")} ${getText("successText")}`,
    threadID,
    messageID
  );
};
