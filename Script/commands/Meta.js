const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];
const { createCanvas, loadImage } = require("canvas");

const API_ENDPOINT = "https://metakexbyneokex.fly.dev/images/generate";

module.exports.config = {
  name: "meta",
  aliases: ["metaai", "metagen"],
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Neoaz ゐ",
  description: "Generate images using Meta AI",
  commandCategory: "ai-image",
  usages: "<prompt>",
  cooldowns: 20
};

/* ================= HELPERS ================= */

async function downloadImage(url, dir, name) {
  const filePath = path.join(dir, name);
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 60000
  });
  await fs.writeFile(filePath, res.data);
  return filePath;
}

async function createGrid(imgs, out) {
  const images = await Promise.all(imgs.map(loadImage));
  const w = images[0].width;
  const h = images[0].height;
  const p = 10;

  const canvas = createCanvas(w * 2 + p * 3, h * 2 + p * 3);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const pos = [
    [p, p],
    [w + p * 2, p],
    [p, h + p * 2],
    [w + p * 2, h + p * 2]
  ];

  images.forEach((img, i) => {
    ctx.drawImage(img, pos[i][0], pos[i][1], w, h);
    ctx.fillStyle = "rgba(0,0,0,.6)";
    ctx.beginPath();
    ctx.arc(pos[i][0] + 28, pos[i][1] + 28, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.fillText(i + 1, pos[i][0] + 20, pos[i][1] + 34);
  });

  await fs.writeFile(out, canvas.toBuffer());
  return out;
}

/* ================= COMMAND ================= */

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (!args.length)
    return api.sendMessage(
      "❌ Prompt দাও\nExample: meta a cute cat",
      threadID,
      messageID
    );

  const prompt = args.join(" ");
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const res = await axios.post(API_ENDPOINT, { prompt });
    const imageUrls = res.data.images.slice(0, 4).map(i => i.url);

    const temp = [];
    for (let i = 0; i < imageUrls.length; i++) {
      temp.push(
        await downloadImage(imageUrls[i], cacheDir, `meta_${Date.now()}_${i}.png`)
      );
    }

    const gridPath = path.join(cacheDir, "meta_grid.png");
    await createGrid(temp, gridPath);

    api.sendMessage(
      {
        body: "🧠 Meta AI Result\nReply 1-4 or all",
        attachment: fs.createReadStream(gridPath)
      },
      threadID,
      (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            name: "meta",
            author: senderID,
            imageUrls
          });
        }
      },
      messageID
    );

    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (e) {
    api.setMessageReaction("❌", messageID, () => {}, true);
    api.sendMessage("❌ Image generate failed", threadID, messageID);
  }
};

/* ================= REPLY ================= */

module.exports.onReply = async function ({ api, event, Reply }) {
  if (event.senderID !== Reply.author) return;

  const text = event.body.trim().toLowerCase();
  const cacheDir = path.join(__dirname, "cache");

  if (text === "all") {
    const files = [];
    for (let i = 0; i < Reply.imageUrls.length; i++) {
      files.push(
        fs.createReadStream(
          await downloadImage(
            Reply.imageUrls[i],
            cacheDir,
            `meta_all_${Date.now()}_${i}.png`
          )
        )
      );
    }
    return api.sendMessage({ attachment: files }, event.threadID);
  }

  const num = parseInt(text);
  if (num < 1 || num > 4) return;

  const img = await downloadImage(
    Reply.imageUrls[num - 1],
    cacheDir,
    `meta_select_${Date.now()}.png`
  );

  api.sendMessage(
    { attachment: fs.createReadStream(img) },
    event.threadID
  );
};
