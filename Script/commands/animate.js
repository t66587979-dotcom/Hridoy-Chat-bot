const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);

const API_ENDPOINT = "https://metakexbyneokex.fly.dev/animate";
const CACHE_DIR = path.join(__dirname, 'cache');

module.exports.config = {
  name: "animate",
  version: "1.0",
  hasPermssion: 0,
  credits: "Neoaz ゐ",
  description: "Generate animated videos from text prompts using AI",
  commandCategory: "ai",
  usages: "[prompt]",
  cooldowns: 30,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "stream": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(" ").trim();
  const { threadID, messageID } = event;

  if (!prompt)
    return api.sendMessage("❌ Please provide a prompt to generate a video.", threadID, messageID);

  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

  api.sendMessage("⏳ Generating video, please wait...", threadID, messageID);

  let tempFilePath;

  try {
    const fullApiUrl = `${API_ENDPOINT}?prompt=${encodeURIComponent(prompt)}`;
    const apiResponse = await axios.get(fullApiUrl, { timeout: 120000 });
    const data = apiResponse.data;

    if (!data.success || !data.video_urls || data.video_urls.length === 0)
      return api.sendMessage("❌ Failed to generate video.", threadID, messageID);

    const videoUrl = data.video_urls[0];
    const videoResponse = await axios.get(videoUrl, { responseType: 'stream', timeout: 120000 });

    const fileHash = Date.now() + Math.random().toString(36).substring(2, 8);
    tempFilePath = path.join(CACHE_DIR, `animate_${fileHash}.mp4`);

    await pipeline(videoResponse.data, fs.createWriteStream(tempFilePath));

    await api.sendMessage(
      { body: `✅ Video generated successfully!`, attachment: fs.createReadStream(tempFilePath) },
      threadID,
      () => fs.unlinkSync(tempFilePath),
      messageID
    );

  } catch (err) {
    console.error("Animate Command Error:", err);
    api.sendMessage("❌ Failed to generate video.", threadID, messageID);
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
  }
};
