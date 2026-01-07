const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "convert",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Islamic chat (Improved by Grok)",
  description: "Download media from URL and send as Messenger attachment",
  commandCategory: "Media",
  usages: ["/convert <direct media link>"],
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const url = args[0];

  if (!url || !url.startsWith('http')) {
    return api.sendMessage("দয়া করে একটা ভ্যালিড মিডিয়া লিঙ্ক দাও (http/https)!", threadID, messageID);
  }

  const validExts = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mp3', '.wav', '.pdf', '.docx', '.txt', '.raw'];
  const ext = path.extname(url).toLowerCase();

  if (!validExts.includes(ext)) {
    return api.sendMessage(`সাপোর্টেড ফরম্যাট: ${validExts.join(', ')}\nতোমার লিঙ্কের এক্সটেনশন: ${ext || 'অজানা'}`, threadID, messageID);
  }

  const tempPath = path.join(__dirname, 'cache', `media_\( {Date.now()} \){ext}`);

  try {
    api.sendMessage("ডাউনলোড হচ্ছে... দাঁড়াও!", threadID, messageID);

    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}`);
    }

    fs.writeFileSync(tempPath, Buffer.from(response.data));

    await api.sendMessage({
      body: `মিডিয়া ডাউনলোড + সেন্ড সাকসেসফুল!\nলিঙ্ক: ${url}`,
      attachment: fs.createReadStream(tempPath)
    }, threadID, () => fs.unlinkSync(tempPath), messageID);

  } catch (error) {
    console.error("Convert error:", error.message);
    api.sendMessage(`এরর: ${error.message.includes('timeout') ? 'লিঙ্ক লোড হতে অনেক সময় লাগছে' : 'ফাইল ডাউনলোড/সেন্ড ফেল হয়েছে'} 😔`, threadID, messageID);
  }
};