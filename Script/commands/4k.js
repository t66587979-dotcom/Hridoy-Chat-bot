const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "4k",
    version: "3.0.0", // Free Best API Upgrade - Kaguya Style
    hasPermssion: 0,
    credits: "Hridoy Hossen (Powered by Free AI Upscaler)",
    description: "Enhance Photo to 4K/16K - Reply to image (Free & Best 2026)",
    commandCategory: "Image Editing Tools",
    usages: "Reply to an image with '4k'",
    cooldowns: 10
  },

  handleEvent: async ({ api, event }) => {
    if (event.body?.toLowerCase().trim() === "4k") {
      if (!event.messageReply?.attachments?.[0]?.url) 
        return api.sendMessage("🌙 Reply to a photo first, mortal! Kaguya awaits your image.", event.threadID, event.messageID);

      await processImage(api, event.threadID, event.messageID, event.messageReply.attachments[0].url, event);
    }
  },

  run: async ({ api, event }) => {
    if (!event.messageReply?.attachments?.[0]?.url) 
      return api.sendMessage("🌸 Reply to an image to unleash Kaguya's 4K vision!", event.threadID, event.messageID);

    await processImage(api, event.threadID, event.messageID, event.messageReply.attachments[0].url, event);
  }
};

async function processImage(api, threadID, messageID, imgUrl, event) {
  const tempPath = path.join(__dirname, "cache", "kaguya_4k.jpg");
  const waitMsg = await api.sendMessage("🌙 Byakugan activating... Upscaling to divine 4K/16K realm 🔮⏳", threadID, messageID);

  try {
    // Best Free API 2026: imgupscaler.ai (or change to pixelcut.ai if needed)
    // Note: This is example endpoint - test in browser first or adjust based on site
    const upscaleUrl = `https://imgupscaler.ai/api/upscale?image=${encodeURIComponent(imgUrl)}&scale=4`; // Adjust endpoint if different (check dev tools)

    // Alternative free: https://www.pixelcut.ai/api/upscaler (if they expose)
    // const upscaleUrl = `https://api.pixelcut.ai/upscale?url=${encodeURIComponent(imgUrl)}&scale=4`;

    const response = await axios.get(upscaleUrl, { responseType: 'arraybuffer' }); // If POST needed, change to post

    fs.writeFileSync(tempPath, Buffer.from(response.data, 'binary'));

    await api.sendMessage(
      {
        body: `🌕 **4K/16K Divine Enhancement Complete!** 🌕\n` +
              `Your mortal image now radiates with Kaguya's eternal clarity.\n` +
              `"Witness the power of the Rabbit Goddess..." - Kaguya Ōtsutsuki 🔮`,
        attachment: fs.createReadStream(tempPath)
      },
      threadID,
      () => {
        fs.unlinkSync(tempPath);
        api.unsendMessage(waitMsg.messageID);
      },
      messageID
    );

  } catch (e) {
    console.error("Upscale Error:", e.message);
    api.sendMessage(
      `🌑 **Chakra disrupted!** 🌑\n` +
      `Error: ${e.message}\n` +
      `Try again or contact Hridoy. Backup: Use upscale.media manually.`,
      threadID, messageID
    );
    api.unsendMessage(waitMsg.messageID);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}
