module.exports.config = {
  name: "random",
  version: "11.9.7",
  hasPermssion: 0,
  credits: "Shaon Ahmed",
  description: "random love story video",
  usePrefix: true,
  commandCategory: "video",
  usages: "random",
  cooldowns: 30,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios")
    const request = require("request")
    const fs = require("fs-extra")
  const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json')
  const n = apis.data.api;
    const res = await axios.get(`${n}/video/random`);
    var data = res.data.url;
    var msg = [];
    let video = `${res.data.url}`;
  let name = `${res.data.name}`;
    let cp = `${res.data.cp}`
  let ln = `${res.data.count}`

    let videos = (await axios.get(`${video}`, {
        responseType: 'arraybuffer'
    })).data;
    fs.writeFileSync(__dirname + "/cache/video.mp4", Buffer.from(videos, "utf-8"));
    var allimage = [];
    allimage.push(fs.createReadStream(__dirname + "/cache/video.mp4"));

    {
        msg += `${cp}\n\n𝐓𝐨𝐭𝐚𝐥 𝐕𝐢𝐝𝐞𝐨𝐬: [${ln}]\n𝐀𝐝𝐝𝐞𝐝 𝐓𝐡𝐢𝐬 𝐕𝐢𝐝𝐞𝐨 𝐓𝐨 𝐓𝐡𝐞 𝐀𝐩𝐢 𝐁𝐲 [${name}]`
    }

    return api.sendMessage({
        body: msg,
        attachment: allimage
    }, event.threadID, event.messageID);
}
