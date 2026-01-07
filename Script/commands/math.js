const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "math",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ (Improved by Grok)",
  description: "গণিত সমাধান (সাধারণ, ইন্টিগ্রাল, গ্রাফ, ভেক্টর)",
  commandCategory: "শিক্ষা",
  usages: "math <অভিব্যক্তি>\nউদাহরণ:\nmath 1 + 2\nmath x+1=2\nmath -p xdx (অনির্দিষ্ট ইন্টিগ্রাল)\nmath -p xdx from 0 to 2 (নির্দিষ্ট ইন্টিগ্রাল)\nmath -g y = x^3 - 9 (গ্রাফ)\nmath -v (1,2,3) - (5,6,7) (ভেক্টর)",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  envConfig: {
    "WOLFRAM": "T8J8YV-H265UQ762K" // তোমার Wolfram Alpha API Key
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const key = global.configModule.math.WOLFRAM || "T8J8YV-H265UQ762K"; // তোমার API Key

  if (!key || key === "T8J8YV-H265UQ762K") {
    return api.sendMessage("দুঃখিত! Wolfram Alpha API Key সেট করা নেই। বট অ্যাডমিনকে বলো Key সেট করতে।", threadID, messageID);
  }

  const content = (event.type === "message_reply" && event.messageReply.body) 
    ? event.messageReply.body 
    : args.join(" ").trim();

  if (!content) {
    return api.sendMessage(
      "দয়া করে গণিতের অভিব্যক্তি দাও!\nউদাহরণ:\nmath 1 + 2\nmath x^2 = 4\nmath -p xdx\nmath -g y = sin(x)",
      threadID, messageID
    );
  }

  // লোডিং মেসেজ
  const loading = await api.sendMessage("গণনা হচ্ছে... দাঁড়াও 🔢", threadID, messageID);

  try {
    let query = content;

    // -p → primitive/integral
    if (query.startsWith("-p")) {
      query = "integrate " + query.slice(3).trim();
    }
    // -g → plot/graph
    else if (query.startsWith("-g")) {
      query = "plot " + query.slice(3).trim();
    }
    // -v → vector
    else if (query.startsWith("-v")) {
      query = "vector " + query.slice(3).trim().replace(/\(/g, "<").replace(/\)/g, ">");
    }

    const res = await axios.get(
      `http://api.wolframalpha.com/v2/query?appid=\( {key}&input= \){encodeURIComponent(query)}&output=json`
    );

    const data = res.data;

    if (!data.queryresult || !data.queryresult.success) {
      throw new Error("Wolfram Alpha-এ কোনো ফলাফল পাওয়া যায়নি");
    }

    let resultText = "";
    let imageUrl = null;

    // রেজাল্ট পড়া
    if (data.queryresult.pods.some(p => p.id === "Result")) {
      resultText = data.queryresult.pods.find(p => p.id === "Result").subpods[0].plaintext;
    } else if (data.queryresult.pods.some(p => p.id === "Solution")) {
      resultText = data.queryresult.pods.find(p => p.id === "Solution").subpods.map(s => s.plaintext).join("\n");
    } else if (data.queryresult.pods.some(p => p.id === "IndefiniteIntegral")) {
      resultText = data.queryresult.pods.find(p => p.id === "IndefiniteIntegral").subpods[0].plaintext;
    } else if (data.queryresult.pods.some(p => p.id.includes("Plot") || p.id.includes("Graph"))) {
      imageUrl = data.queryresult.pods.find(p => p.id.includes("Plot") || p.id.includes("Graph")).subpods[0].img.src;
    }

    // ইমেজ থাকলে ডাউনলোড + সেন্ড
    if (imageUrl) {
      const imgRes = await axios.get(imageUrl, { responseType: "stream" });
      const imgPath = path.join(__dirname, "cache", `math_${Date.now()}.png`);
      imgRes.data.pipe(fs.createWriteStream(imgPath));

      imgRes.data.on("end", () => {
        api.sendMessage({
          body: `গণিতের ফলাফল:\n\n${resultText || "গ্রাফ দেখানো হচ্ছে"}`,
          attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlinkSync(imgPath), messageID);

        api.unsendMessage(loading.messageID);
      });
    } else {
      api.sendMessage(resultText || "কোনো ফলাফল পাওয়া যায়নি 😔", threadID, () => api.unsendMessage(loading.messageID), messageID);
    }

  } catch (error) {
    console.error("Math error:", error.message);
    api.sendMessage(
      `দুঃখিত! গণনা করতে সমস্যা হয়েছে 😔\nত্রুটি: ${error.message}\nআবার ট্রাই করো বা অভিব্যক্তি চেক করো!`,
      threadID, () => api.unsendMessage(loading.messageID), messageID
    );
  }
};