/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
  name: "adultvideo",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Hridoy Hossen",
  description: "18+ VIDEOS",
  commandCategory: "video",
  usages: "18+ vedio",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  // নতুন ক্যাপশন
  var captions = ["এই নে এবার যা হেন্ডেল মেরে আয় 🙂"];
  var caption = captions[Math.floor(Math.random() * captions.length)];

  // নতুন লিংকগুলো
  var links = [
    "https://drive.google.com/uc?export=download&id=1Qob7yk1a5HBi-syqcUTGm_C-2yDWR-3S",
    "https://drive.google.com/uc?export=download&id=",
    "https://drive.google.com/uc?export=download&id="
  ];

  // ভিডিও ফাইল ডাউনলোড ও সেন্ড
  var callback = () => api.sendMessage(
    { body: `「 ${caption} 」`, attachment: fs.createReadStream(__dirname + "/cache/video.mp4") },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/video.mp4")
  );

  return request(encodeURI(links[Math.floor(Math.random() * links.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/video.mp4"))
    .on("close", () => callback());
};
