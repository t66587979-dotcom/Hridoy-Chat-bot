module.exports.config = {
name: "fork",
version: "1.0.0",
hasPermssion: 0,
credits: "SHAHADAT SAHU",
description: "Send GitHub repo link",
commandCategory: "Tool",
usages: "fork",
cooldowns: 3,
};

module.exports.run = async function({ api, event }) {
return api.sendMessage(
"🔗 GitHub Repo Link: www.Pornhub.com\n\n",
event.threadID,
event.messageID
);
};

