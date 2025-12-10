const economy = require("./economy.js");

module.exports.config = {
  name: "dice",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Modified by Hridoy",
  description: "Dice Game Low/High Bet System",
  commandCategory: "game",
  usages: "dice low <amount> | dice high <amount>",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const uid = event.senderID;

  if (args.length < 2)
    return api.sendMessage("Usage: dice <low/high> <amount>", event.threadID, event.messageID);

  const choice = args[0].toLowerCase();
  const bet = parseInt(args[1]);

  if (isNaN(bet) || bet <= 0)
    return api.sendMessage("Enter a valid amount!", event.threadID, event.messageID);

  const balance = economy.getBalance(uid);
  if (bet > balance)
    return api.sendMessage("❌ You don't have enough coins!", event.threadID, event.messageID);

  const dice = Math.floor(Math.random() * 6) + 1;

  let result = "";
  if (choice === "low") {
    if (dice <= 3) {
      economy.addBalance(uid, bet);
      result = `🎲 Dice: ${dice}\n✅ You Won! +${bet}`;
    } else {
      economy.subtractBalance(uid, bet);
      result = `🎲 Dice: ${dice}\n❌ You Lost! -${bet}`;
    }
  }

  else if (choice === "high") {
    if (dice >= 4) {
      economy.addBalance(uid, bet);
      result = `🎲 Dice: ${dice}\n✅ You Won! +${bet}`;
    } else {
      economy.subtractBalance(uid, bet);
      result = `🎲 Dice: ${dice}\n❌ You Lost! -${bet}`;
    }
  } 

  else {
    return api.sendMessage(
      "Choose **low** or **high**!\nExample: dice low 500",
      event.threadID,
      event.messageID
    );
  }

  api.sendMessage(result, event.threadID, event.messageID);
};