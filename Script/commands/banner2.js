module.exports.config = {
  name: "banner2",
  version: "2.0.0", // Upgraded: Memory-only, no disk files, Kaguya style
  hasPermssion: 0,
  credits: "Hridoy Hossen (Kaguya Upgrade)",
  description: "Generate anime-style banner in 4 designs (multi-step reply)",
  commandCategory: "game",
  usages: ".banner3  (then reply to choose style, char id, names, color)",
  cooldowns: 10
};

module.exports.run = async function({ api, args, event }) {
  const axios = require("axios");

  if (args[0] === "find" || args[0] === "tìm") {
    try {
      const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
      const index = parseInt(args[1]);
      if (isNaN(index) || index < 0 || index >= lengthchar.length) {
        return api.sendMessage("🌙 Invalid character number! Choose a valid id.", event.threadID, event.messageID);
      }
      const char = lengthchar[index];
      const imgStream = (await axios.get(char.imgAnime, { responseType: "stream" })).data;
      return api.sendMessage({
        body: `🌸 Character ID: ${index}\nName/Style: ${char.name || "Anime Character"}\nPowered by Kaguya's vision~ 🔮`,
        attachment: imgStream
      }, event.threadID, event.messageID);
    } catch (err) {
      return api.sendMessage("🌑 Error loading character. Try again later.", event.threadID, event.messageID);
    }
  }

  if (!args[0]) {
    const styles = [
      "https://imgur.com/7AiLKO5.png",
      "https://imgur.com/6we7T1g.png",
      "https://imgur.com/W1TNnj9.png",
      "https://imgur.com/qZAh20x.png"
    ];
    const attachments = await Promise.all(
      styles.map(url => axios.get(url, { responseType: "stream" }).then(res => res.data))
    );

    return api.sendMessage({
      body: "🌙 Choose your banner style (reply with number 1-4):\n1. Style 1\n2. Style 2\n3. Style 3\n4. Style 4",
      attachment: attachments
    }, event.threadID, (err, info) => {
      global.client.handleReply.push({
        step: 1,
        name: "banner3",
        author: event.senderID,
        messageID: info.messageID
      });
    }, event.messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  if (handleReply.author !== event.senderID) return api.sendMessage("🌑 This banner belongs to someone else, mortal!", event.threadID, event.messageID);

  const axios = require("axios");
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const lengthchar = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;

  const steps = {
    1: { msg: "You chose style {body}. Reply with character ID (1-" + lengthchar.length + ")", nextStep: 2, store: "kieu" },
    2: { msg: "Character ID {body} selected. Reply with main name", nextStep: 3, store: "idnv" },
    3: { msg: "Main name '{body}' set. Reply with sub name", nextStep: 4, store: "tenchinh" },
    4: { msg: "Sub name '{body}' set. Reply with color (or 'no' for default)", nextStep: 5, store: "tenphu" }
  };

  if (handleReply.step in steps) {
    const step = steps[handleReply.step];
    api.unsendMessage(handleReply.messageID);

    if (handleReply.step === 1 && (isNaN(event.body) || event.body < 1 || event.body > 4)) {
      return api.sendMessage("🌙 Choose a valid style number (1-4)!", event.threadID, event.messageID);
    }

    if (handleReply.step === 2 && (isNaN(event.body) || event.body < 0 || event.body >= lengthchar.length)) {
      return api.sendMessage("🌑 Invalid character ID! Choose 0 to " + (lengthchar.length - 1), event.threadID, event.messageID);
    }

    api.sendMessage(step.msg.replace("{body}", event.body), event.threadID, (err, info) => {
      global.client.handleReply.push({
        step: step.nextStep,
        name: "banner3",
        author: event.senderID,
        [step.store]: event.body,
        messageID: info.messageID
      });
    }, event.messageID);
  } else if (handleReply.step === 5) {
    api.unsendMessage(handleReply.messageID);

    const type = parseInt(handleReply.kieu);
    const charId = parseInt(handleReply.idnv);
    const mainName = handleReply.tenchinh;
    const subName = handleReply.tenphu;
    let color = event.body;
    const char = lengthchar[charId];

    if (!char) return api.sendMessage("🌑 Character not found.", event.threadID, event.messageID);

    if (color.toLowerCase() === "no") color = char.colorBg || "#e6b030";

    try {
      // Load all resources as Buffer (no disk)
      const resources = await Promise.all([
        axios.get(char.imgAnime, { responseType: "arraybuffer" }).then(r => Buffer.from(r.data)),
        // Backgrounds & effects based on type
        axios.get(type === 1 ? "https://i.imgur.com/HUblFwC.png" : type === 2 ? "https://i.imgur.com/j8FVO1W.jpg" : type === 3 ? "https://lh3.googleusercontent.com/-p0IHqcx8eWE/YXZN2izzTrI/AAAAAAAAym8/T-hqrJ2IFooUfHPeVTbiwu047RkmxGLzgCNcBGAsYHQ/s0/layer2.jpg" : "https://lh3.googleusercontent.com/-JZxo4uTVIKQ/YaS7VBjAojI/AAAAAAAA1rk/mg_Bp0Z6_yUGLp1lfC9ugriYTGFfRaXTwCNcBGAsYHQ/s0/layer-2.png", { responseType: "arraybuffer" }).then(r => Buffer.from(r.data)),
        // Add more for lines/effects if needed
      ]);

      const avaBuffer = resources[0];
      const bgBuffer = resources[1];

      const avaImg = await loadImage(avaBuffer);
      const bgImg = await loadImage(bgBuffer);

      const canvas = createCanvas(bgImg.width, bgImg.height);
      const ctx = canvas.getContext("2d");

      // Common drawing (customize per type)
      ctx.drawImage(bgImg, 0, 0);

      // Type-specific drawing (simplified example - expand as needed)
      if (type === 1) {
        ctx.drawImage(avaImg, 0, -320, canvas.width, canvas.width);
        // Add text, effects...
      } // Add if/else for type 2,3,4 similarly

      // Font loading example (direct Buffer)
      const fontBuffer = await axios.get("https://github.com/hanakuUwU/font/raw/main/GMV_DIN_Pro.ttf", { responseType: "arraybuffer" }).then(r => Buffer.from(r.data));
      registerFont(fontBuffer, { family: "GMV DIN Pro Cond" });

      ctx.font = "200px GMV DIN Pro Cond";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(mainName.toUpperCase(), canvas.width / 2, canvas.height / 2);

      // Final output
      const buffer = canvas.toBuffer("image/png");

      api.sendMessage({
        body: `🌕 **Kaguya's Banner Ready!** 🌕\nStyle: ${type} | Char: ${charId} | Main: ${mainName} | Sub: ${subName}\nDivine creation complete~ 🔮`,
        attachment: buffer
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error("Banner3 Error:", err);
      api.sendMessage("🌑 Chakra flow broken! Error: " + err.message + "\nTry again or check inputs.", event.threadID, event.messageID);
    }
  }
};