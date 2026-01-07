const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "message",
  version: "3.5.0",
  hasPermssion: 2,
  credits: "rX Abdullah",
  description: "Send announcement with optional image/GIF/video/text (reply message optional) to all groups",
  commandCategory: "system",
  usages: "[your message] (reply to media/text optional)",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  let input = args.join(" ");
  let attachment = [];

  // Cache directory
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  // If replied message exists
  if (event.messageReply) {
    const reply = event.messageReply;

    // If reply has text and no args, then use that text
    if (!input && reply.body) {
      input = reply.body;
    }

    // If reply has media attachments
    if (reply.attachments && reply.attachments.length > 0) {
      for (const atc of reply.attachments) {
        let ext;
        if (atc.type === "photo") ext = ".jpg";
        else if (atc.type === "animated_image") ext = ".gif";
        else if (atc.type === "video") ext = ".mp4";
        else continue; // Skip unsupported types

        const filePath = path.join(cacheDir, `${Date.now()}_${Math.floor(Math.random() * 9999)}${ext}`);
        const res = await axios.get(atc.url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));
        attachment.push(filePath);
      }
    }
  }

  if (!input && attachment.length === 0) {
    return api.sendMessage("📢 Use like this:\n!message [your message]\n(or reply to media/text)", event.threadID, event.messageID);
  }

  const title = "📣 ANNOUNCEMENT";
  let msg = "";

  if (input) {
    msg =
`╭──── [ ${title} ] ────╮

${input}

╰────────────────────────────╯`;
  }

  try {
    const threads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = threads.filter(t => t.isGroup);
    let count = 0;

    for (const thread of groupThreads) {
      try {
        let files = attachment.map(p => fs.createReadStream(p));
        await api.sendMessage({ body: msg || undefined, attachment: files }, thread.threadID);
        count++;
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        console.log(`❌ Failed to send in: ${thread.threadID}`);
      }
    }

    // Delete cached files after sending
    for (const file of attachment) {
      fs.unlinkSync(file);
    }

    return api.sendMessage(`✅ Message sent to ${count} groups.`, event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Something went wrong.", event.threadID, event.messageID);
  }
};
