const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data'); // npm install form-data দিয়ে ইনস্টল করো যদি না থাকে

module.exports = {
  config: {
    name: "4k",
    version: "4.1.0", // Your API Key Integrated - Kaguya Style
    hasPermssion: 0,
    credits: "Hridoy Hossen (Powered by Pixelcut AI - Your Key)",
    description: "Enhance Photo to 4K - Reply to image (Using Your Pixelcut Key)",
    commandCategory: "Image Editing Tools",
    usages: "Reply to an image with '4k'",
    cooldowns: 15
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
  const waitMsg = await api.sendMessage("🌙 Byakugan activating... Upscaling to 4K realm 🔮⏳", threadID, messageID);

  try {
    // তোমার API Key এখানে
    const PIXELCUT_API_KEY = "sk_557563e7479f4c0ba34457b902e09024";

    // Pixelcut Upscale Endpoint (অফিশিয়াল docs থেকে: https://api.developer.pixelcut.ai/v1/upscale)
    const upscaleUrl = "https://api.developer.pixelcut.ai/v1/upscale";

    // Messenger-এর ইমেজ URL থেকে বাইনারি ডাটা নেয়া
    const imageResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    const form = new FormData();
    form.append('image', imageBuffer, { filename: 'input.jpg' });
    form.append('scale', '4'); // 2 বা 4 (4x upscale)

    const response = await axios.post(upscaleUrl, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${PIXELCUT_API_KEY}`
      },
      responseType: 'arraybuffer' // এনহ্যান্সড ইমেজ বাইনারি হিসেবে আসবে
    });

    fs.writeFileSync(tempPath, Buffer.from(response.data, 'binary'));

    await api.sendMessage(
      {
        body: `🌕 **4K Divine Enhancement Complete!** 🌕\n` +
              `Your image now radiates with Kaguya's eternal clarity.\n` +
              `"Witness the power of the Rabbit Goddess..." - Kaguya Ōtsutsuki 🔮\n\n` +
              `Powered by your Kakashi.`,
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
    console.error("4K Pixelcut Error:", e.message, e.response ? e.response.data.toString() : 'No response');
    api.sendMessage(
      `🌑 **Chakra disrupted!** 🌑\n` +
      `Error: ${e.message} (Possible: Invalid key, rate limit, or API issue)\n` +
      `Check console for details. Try a smaller image or contact Pixelcut support.\n` +
      `Backup: Use upscale.media or letsenhance.io manually.`,
      threadID, messageID
    );
    api.unsendMessage(waitMsg.messageID);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}
