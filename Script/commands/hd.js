const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "hd",
  version: "2.5",
  hasPermssion: 0,
  credits: "Hridoy Hossen",
  description: "Enhance any image to HD quality",
  commandCategory: "Image",
  usages: "Reply to an image with: hd",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, messageReply, body } = event;
  if (!body || !body.toLowerCase().startsWith("hd")) return;

  const imageUrl = messageReply?.attachments?.[0]?.url;
  const cachePath = __dirname + "/cache/hd_result.jpg";

  if (!imageUrl) {
    return api.sendMessage(
      "🌺 **HD করতে হলে ছবিটিতে রিপ্লাই দিন**\n\n📸 উদাহরণ:\n👉 ছবিতে রিপ্লাই করে লিখুন: hd",
      threadID,
      messageID
    );
  }

  api.sendMessage("🕐 আপনার ছবি HD করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", threadID, async () => {
    try {
      const apiURL = `https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiURL);

      if (!response.data?.image_data)
        return api.sendMessage("⚠️ HD conversion ব্যর্থ হয়েছে! অনুগ্রহ করে পরে চেষ্টা করুন।", threadID, messageID);

      const imageBuffer = (await axios.get(response.data.image_data, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(cachePath, Buffer.from(imageBuffer, 'binary'));

      api.sendMessage({
        body: "✅ আপনার ছবি সফলভাবে HD তে রূপান্তরিত হয়েছে!",
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => fs.unlinkSync(cachePath), messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error: ছবি প্রক্রিয়া করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", threadID, messageID);
    }
  });
};

module.exports.run = async function () { };