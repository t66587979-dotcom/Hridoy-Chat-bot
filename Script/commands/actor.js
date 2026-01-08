const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "actor",
    aliases: ["actorgame", "guessactor"],
    version: "2.0.0", // Kaguya Upgrade
    author: "Hridoy Hossen (Kaguya Theme Adaptation)",
    countDown: 10,
    role: 0,
    category: "game",
    guide: { en: "{pn} → Guess the actor from image" }
  },

  onReply: async function ({ api, event, Reply, usersData }) {
    const { actorNames, author } = Reply;

    if (event.senderID !== author) {
      return api.sendMessage("🌙 This chakra vision belongs to another mortal. Not yours!", event.threadID, event.messageID);
    }

    const reply = event.body.toLowerCase().trim();
    await api.unsendMessage(Reply.messageID);

    const isCorrect = actorNames.some(name => reply.includes(name.toLowerCase()));

    const userData = await usersData.get(event.senderID);
    const getCoin = 500;
    const getExp = 121;

    if (isCorrect) {
      userData.money = (userData.money || 0) + getCoin;
      userData.exp = (userData.exp || 0) + getExp;
      await usersData.set(event.senderID, userData);

      return api.sendMessage(
        `🌸 **Correct Insight!** 🌸\n` +
        `The hidden face was revealed before Kaguya's Byakugan.\n` +
        `You earned **\( {getCoin} coins** & ** \){getExp} exp**.\n` +
        `Bow before the Rabbit Goddess... your power grows~ 🔮`,
        event.threadID, event.messageID
      );
    } else {
      return api.sendMessage(
        `🥀 **Wrong Vision, Mortal!** 🥀\n` +
        `The true identity: **${actorNames.join(", ")}**\n` +
        `Submit to Kaguya's wisdom next time... 🌑`,
        event.threadID, event.messageID
      );
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const apiUrl = await baseApiUrl();
      const response = await axios.get(`${apiUrl}/api/actor`);
      const { name, imgurLink } = response.data.actor;

      const actorNames = Array.isArray(name) ? name : [name];

      // Stream the actor image
      const imageStream = await axios({
        url: imgurLink,
        method: "GET",
        responseType: "stream",
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const msg = `🌙 **Kaguya's Chakra Vision Activated** 🌙\n\n` +
                   `A mysterious face from the mortal world has appeared...\n` +
                   `Guess the actor's name before the timer ends!\n\n` +
                   `⏳ You have 40 seconds. Reply with your answer.\n` +
                   `"Bow before my insight... or perish in ignorance." - Kaguya Ōtsutsuki`;

      api.sendMessage(
        {
          body: msg,
          attachment: imageStream.data
        },
        event.threadID,
        (err, info) => {
          if (err) {
            console.error("Failed to send actor image:", err);
            return api.sendMessage("❌ Kaguya's vision failed to manifest. Try again later.", event.threadID, event.messageID);
          }

          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            actorNames
          });

          // Auto-unsend after 40 seconds
          setTimeout(() => {
            api.unsendMessage(info.messageID).catch(() => {});
          }, 40000);
        },
        event.messageID
      );

    } catch (err) {
      console.error("Kaguya Actor Game Error:", err.message);
      return api.sendMessage(
        `🌑 **Error in Chakra Flow** 🌑\n` +
        `The API realm rejected our call.\n` +
        `Contact Hridoy Hossen if this persists.`,
        event.threadID, event.messageID
      );
    }
  }
};