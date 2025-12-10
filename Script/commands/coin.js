const economy = require("./economy.js");

module.exports.config = {
  name: "coin",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Modified by Hridoy",
  description: "Coin Flip Game",
  commandCategory: "game",
  usages: "coin head <amount> | coin tail <amount>",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const uid = event.senderID;

  if (args.length < 2)
    return api.sendMessage("Usage: coin <head/tail> <amount>", event.threadID, event.messageID);

  const choice = args[0].toLowerCase();
  const bet = parseInt(args[1]);

  if (isNaN(bet) || bet <= 0)
    return api.sendMessage("Enter a valid amount!", event.threadID, event.messageID);

  const balance = economy.getBalance(uid);
  if (bet > balance)
    return api.sendMessage("❌ Not enough balance!", event.threadID, event.messageID);

  const flip = Math.random() < 0.5 ? "head" : "tail";

  let result = "";
  if (choice === flip) {
    economy.addBalance(uid, bet);
    result = `🪙 Coin: ${flip}\n✅ You Won! +${bet}`;
  } else {
    economy.subtractBalance(uid, bet);
    result = `🪙 Coin: ${flip}\n❌ You Lost! -${bet}`;
  }

  api.sendMessage(result, event.threadID, event.messageID);
};