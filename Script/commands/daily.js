// daily.js
module.exports.config = {
  name: "daily",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Claim daily coins",
  commandCategory: "Games",
  usages: "",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID, senderID } = event;

  const cooldownHours = 24;
  const reward = 500; // you can change

  const can = await econ.canClaimDaily(senderID, cooldownHours);
  if (!can) {
    return api.sendMessage(`You already claimed daily in last ${cooldownHours} hours. Try later.`, threadID, messageID);
  }

  await econ.addMoney(senderID, reward, "daily");
  await econ.setDailyClaim(senderID);
  const name = await Users.getNameUser(senderID);
  api.sendMessage(`${name}, you received ${reward} coins as daily reward! 🎁`, threadID, messageID);
};
