// balance.js
module.exports.config = {
  name: "balance",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐇𝐑𝐈𝐃𝐎𝐘 𝐇𝐎𝐒𝐒𝐄𝐍",
  description: "Show your balance or someone else's (reply/mention/uid).",
  commandCategory: "Games",
  usages: "[reply|mention|uid]",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args, Users }) {
  const econ = require("./Economy.js");
  const { threadID, messageID, messageReply } = event;
  let id;
  if (messageReply) id = messageReply.senderID;
  else if (Object.keys(event.mentions || {}).length) id = Object.keys(event.mentions)[0];
  else if (args[0]) id = args[0];
  else id = event.senderID;

  if (isNaN(id)) return api.sendMessage("Invalid ID.", threadID, messageID);
  const bal = await econ.getBalance(id);
  const name = await Users.getNameUser(id);
  return api.sendMessage(`${name}\n💰 Balance: ${bal} coin`, threadID, messageID);
};
