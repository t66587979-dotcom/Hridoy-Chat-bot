module.exports.config = {
 name: "upt",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "Islamick Cyber Chat",
 description: "monitoring for your masanger robot 24 hour active",
 commandCategory: "System",
 usages: "[text/reply]",
 cooldowns: 5
};
//////////////////////////////
//////// Khai báo ///////////
////////////////////////////
module.exports.onLoad = () => {
 const fs = require("fs-extra");
 const request = require("request");
 const lvb = __dirname + `/noprefix/`;
 if (!fs.existsSync(lvb + "noprefix")) fs.mkdirSync(lvb, { recursive: true });
 if (!fs.existsSync(lvb + "upt.png")) request("https://i.imgur.com/vn4rXA4.jpg").pipe(fs.createWriteStream(lvb + "upt.png"));
 }
module.exports.run = async function({ api, event, args, client }) {
 const fs = require('fs-extra');
 let time = process.uptime();
 let hours = Math.floor(time / (60 * 60));
 let minutes = Math.floor((time % (60 * 60)) / 60);
 let seconds = Math.floor(time % 60);
 const timeStart = Date.now();
 var name = Date.now();
 var url = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
 var lvbang = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
 if(url.match(lvbang) == null) return api.sendMessage({body:`╭•┄┅═══❁🌺❁═══┅┄•╮\n🕧 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧 🕧\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n𝗗𝗢𝗨𝗚𝗛 𝗧𝗜𝗠𝗥 𝗖𝗨𝗥𝗥𝗘𝗡𝗧𝗟𝗬 𝗢𝗡𝗟𝗜𝗡𝗘 𝗜𝗡 𝗧𝗢𝗧𝗔𝗟 ${hours} 𝗛𝗢𝗨𝗥𝗦 ${minutes} 𝗠𝗜𝗡𝗨𝗧𝗘 ${seconds} 𝗦𝗘𝗖𝗢𝗡𝗗 👾\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆\nPlease enter/replit the url to post on Uptime Robot`, attachment: fs.createReadStream(__dirname + `/noprefix/upt.png`)}, event.threadID, event.messageID);
 var request = require("request");
 var options = { method: 'POST',
 url: 'https://api.uptimerobot.com/v2/newMonitor',
 headers:
 { 'content-type': 'application/x-www-form-urlencoded',
 'noprefix-control': 'no-noprefix' },
 form:
 { api_key: 'u2008156-9837ddae6b3c429bd0315101',
 format: 'json',
 type: '1',
 url: url,
 friendly_name: name } };
 ///////////////////////////////////////// //////Phần điều kiện và gửi tin nhắn//// /////////////////////////////////////// 
request(options, function (error, response, body) {
 if (error) return api.sendMessage(`Lỗi rồi huhu :((`, event.threadID, event.messageID );
 if(JSON.parse(body).stat == 'fail') return api.sendMessage({body:`╭•┄┅════❁🌺❁════┅┄•╮\n🕧𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧🕧\n╰•┄┅════❁🌺❁════┅┄•╯\n\n𝗗𝗢𝗨𝗚𝗛 𝗧𝗜𝗠𝗥 𝗖𝗨𝗥𝗥𝗘𝗡𝗧𝗟𝗬 𝗢𝗡𝗟𝗜𝗡𝗘 𝗜𝗡 𝗧𝗢𝗧𝗔𝗟 ${hours} 𝗛𝗢𝗨𝗥𝗦 ${minutes} 𝗠𝗜𝗡𝗨𝗧𝗘 ${seconds} 𝗦𝗘𝗖𝗢𝗡𝗗 👾\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆\n｢ 𝗘𝗥𝗥𝗢𝗥 ｣ - 𝗨𝗣𝗧𝗜𝗠𝗘 𝗧𝗛𝗘 𝗥𝗢𝗕𝗢𝗧 𝗠𝗢𝗡𝗜𝗧𝗢𝗥 𝗔𝗟𝗥𝗘𝗗𝗬 𝗧𝗛𝗜𝗦 𝗖𝗨𝗥𝗥𝗘𝗡𝗧𝗟𝗬 𝗘𝗫𝗜𝗦𝗧𝗦 𝗢𝗡✨🌺\n🔗 𝐋𝐈𝐍𝐊: ${url}`, attachment: fs.createReadStream(__dirname + `/noprefix/upt.png`)}, event.threadID, event.messageID);
 if(JSON.parse(body).stat == 'success')
 return
api.sendMessage({body: `╭•┄┅════❁🌺❁════┅┄•╮\n🕧𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧🕧\n╰•┄┅════❁🌺❁════┅┄•╯\n\n𝗗𝗢𝗨𝗚𝗛 𝗧𝗜𝗠𝗥 𝗖𝗨𝗥𝗥𝗘𝗡𝗧𝗟𝗬 𝗢𝗡𝗟𝗜𝗡𝗘 𝗜𝗡 𝗧𝗢𝗧𝗔𝗟 ${hours} 𝗛𝗢𝗨𝗥𝗦 ${minutes} 𝗠𝗜𝗡𝗨𝗧𝗘 ${seconds} 𝗦𝗘𝗖𝗢𝗡𝗗 👾\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆\n｢ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 ｣ - 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 𝗨𝗣𝗧𝗜𝗠𝗘 𝗥𝗢𝗕𝗢𝗧 𝗖𝗥𝗘𝗔𝗧𝗘 𝗦𝗘𝗥𝗩𝗘𝗥 𝗔𝗕𝗢𝗩𝗘 ✨🌺\n🔗 𝐋𝐈𝐍𝐊: ${url}`, attachment: fs.createReadStream(__dirname + `/noprefix/upt.png`)}, event.threadID, event.messageID );
});
 }
