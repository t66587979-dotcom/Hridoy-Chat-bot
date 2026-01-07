const fs = require("fs");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

module.exports.config = {
  name: "owner3",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Rahat Islam (Ultra upgraded & unique by Grok)",
  description: "স্টাইলিশ ওনার ইনফো কার্ড (নিয়ন গ্লো + গ্লাসমরফিজম)",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  // Loading message
  const loading = await api.sendMessage("ওনার কার্ড তৈরি হচ্ছে... ✨", threadID, messageID);

  try {
    // === Canvas সেটআপ ===
    const width = 1000;
    const height = 1400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // === ব্যাকগ্রাউন্ড: ডার্ক নিয়ন গ্রেডিয়েন্ট ===
    const bg = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    bg.addColorStop(0, "#0a1f44");
    bg.addColorStop(0.4, "#001f3f");
    bg.addColorStop(1, "#000d1a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // === নিয়ন গ্লো পার্টিকেল সিমুলেশন (ছোট ছোট স্পার্কল) ===
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 4 + 1;
      ctx.fillStyle = `hsl(${Math.random()*60 + 180}, 100%, 70%)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // === মেইন কার্ড (গ্লাসমরফিজম + ব্লার গ্লো) ===
    const cardX = 60, cardY = 80;
    const cardW = width - 120, cardH = height - 160;
    drawNeonGlassCard(ctx, cardX, cardY, cardW, cardH, 40);

    // === ওনার অ্যাভাটার + ক্রাউন ===
    const avatarSize = 280;
    const avatarX = cardX + cardW/2 - avatarSize/2;
    const avatarY = cardY + 60;

    // তোমার অ্যাভাটার লোড (তোমার FB ID দিয়ে)
    const ownerID = "100048786044500"; // তোমার FB ID
    const avatarUrl = `https://graph.facebook.com/${ownerID}/picture?width=512&height=512`;
    const avatarImg = await loadImage(avatarUrl);
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI*2);
    ctx.clip();
    ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // ক্রাউন ওভারলে (অ্যাডমিন ফিল)
    ctx.font = "bold 120px 'Arial Black'";
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffaa00";
    ctx.shadowBlur = 30;
    ctx.fillText("👑", avatarX + avatarSize/2 - 40, avatarY + 80);
    ctx.shadowBlur = 0;

    // === টাইটেল ===
    ctx.font = "bold 90px 'Segoe UI Black'";
    const titleGrad = ctx.createLinearGradient(cardX, cardY + 420, cardX + 800, cardY + 420);
    titleGrad.addColorStop(0, "#00ffff");
    titleGrad.addColorStop(0.5, "#ff00ff");
    titleGrad.addColorStop(1, "#00ff99");
    ctx.fillStyle = titleGrad;
    ctx.shadowColor = "#00ffff88";
    ctx.shadowBlur = 40;
    ctx.textAlign = "center";
    ctx.fillText("✨ HRIDOY HOSSEN ✨", width/2, cardY + 420);
    ctx.shadowBlur = 0;

    // === ইনফো লাইনস ===
    ctx.font = "bold 45px 'Segoe UI'";
    ctx.fillStyle = "#e0f7ff";
    ctx.textAlign = "left";
    let y = cardY + 520;

    const infoLines = [
      "👑 নাম: Hridoy Hossen",
      "🧸 ডাকনাম: Kakashi",
      "🎂 বয়স:  ২১",
      "💘 রিলেশন: সিঙ্গেল",
      "🎓 পেশা: স্টুডেন্ট",
      "🏡 ঠিকানা: যশোর ",
      "",
      "🔗 যোগাযোগ লিঙ্ক",
      "📘 ফেসবুক: fb.com/100048786044500",
      "💬 মেসেঞ্জার: m.me/100048786044500"
    ];

    infoLines.forEach(line => {
      ctx.fillText(line, cardX + 80, y);
      y += 70;
    });

    // === বটম গ্লো + সাইন ===
    ctx.font = "italic 35px 'Segoe UI'";
    ctx.fillStyle = "#a0f0ff";
    ctx.textAlign = "center";
    ctx.fillText("HridoyBot • Powered by Love & Code 💙", width/2, height - 80);

    // === এক্সপোর্ট ===
    const buffer = canvas.toBuffer("image/png");
    const filePath = path.join(__dirname, "cache", `owner3_${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);

    await api.sendMessage({
      body: "💙 𝗥𝗮𝗵𝗮𝘁 𝗕𝗼𝘁 💙\n✨ ওনার ইনফো কার্ড রেডি ✨",
      attachment: fs.createReadStream(filePath)
    }, threadID, () => fs.unlinkSync(filePath), messageID);

    api.unsendMessage(loading.messageID);

  } catch (error) {
    console.error("Owner3 error:", error);
    api.sendMessage("কার্ড বানাতে সমস্যা হয়েছে 😔 আবার ট্রাই করো!", threadID, messageID);
    api.unsendMessage(loading.messageID);
  }
};

// === নিয়ন গ্লাস কার্ড ড্র (গ্লাসমরফিজম + গ্লো) ===
function drawNeonGlassCard(ctx, x, y, w, h, r) {
  // গ্লাস ব্যাকগ্রাউন্ড
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, x, y, w, h, r, true, false);
  ctx.restore();

  // নিয়ন বর্ডার গ্লো
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 30;
  ctx.strokeStyle = "#00ffff44";
  ctx.lineWidth = 4;
  roundRect(ctx, x, y, w, h, r, false, true);

  // ইনার গ্লো
  ctx.shadowColor = "#00ffff88";
  ctx.shadowBlur = 15;
  ctx.strokeStyle = "#00ffff22";
  ctx.lineWidth = 2;
  roundRect(ctx, x+4, y+4, w-8, h-8, r-4, false, true);

  ctx.shadowBlur = 0;
}

function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}