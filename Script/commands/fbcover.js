const axios = require("axios");
const baseApiUrl = async () => {
 const _0x15493d = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
 return _0x15493d.data.api;
};
module.exports.config = {
 'name': "fbcover",
 'version': "6.9",
 'hasPermission': 0x0,
 'credits': "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 'description': "Image",
 'commandCategory': "Image",
 'usages': "name - title - address - email - phone - color (default = white)",
 'cooldowns': 0x5
};
module.exports.run = async function ({
 api: _0x1cb5ab,
 event: _0x39784b,
 args: _0x99677d,
 Users: _0x27cfb6
}) {
 const _0x486dd8 = _0x99677d.join(" ");
 let _0x47416f;
 if (_0x39784b.type === "message_reply") {
 _0x47416f = _0x39784b.messageReply.senderID;
 } else {
 _0x47416f = Object.keys(_0x39784b.mentions)[0] || _0x39784b.senderID;
 }
 var _0x2d3b59 = await _0x27cfb6.getNameUser(_0x47416f);
 if (!_0x486dd8) {
 return _0x1cb5ab.sendMessage("you can see and try this system Create Your Facebook Cover " + global.config.PREFIX + "fbcover v1/v2/v3 - name - title - address - email - phone - color (default = white)", _0x39784b.threadID, _0x39784b.messageID);
 } else {
 const _0x1bc6cb = _0x486dd8.split('-');
 const _0xb7cc01 = _0x1bc6cb[0].trim() || 'v1';
 const _0x3ea3dd = _0x1bc6cb[1].trim() || " ";
 const _0x6252a8 = _0x1bc6cb[2].trim() || " ";
 const _0x3744c5 = _0x1bc6cb[3].trim() || " ";
 const _0x1bb59a = _0x1bc6cb[4].trim() || " ";
 const _0x34c576 = _0x1bc6cb[5].trim() || " ";
 const _0x34e9f5 = _0x1bc6cb[6].trim() || "white";
 _0x1cb5ab.sendMessage("Processing your cover,Wait", _0x39784b.threadID, (_0x5e0253, _0x51abd0) => setTimeout(() => {
 _0x1cb5ab.unsendMessage(_0x51abd0.messageID);
 }, 4000));
 const _0x226845 = (await baseApiUrl()) + "/cover/" + _0xb7cc01 + "?name=" + encodeURIComponent(_0x3ea3dd) + "&subname=" + encodeURIComponent(_0x6252a8) + "&number=" + encodeURIComponent(_0x34c576) + "&address=" + encodeURIComponent(_0x3744c5) + "&email=" + encodeURIComponent(_0x1bb59a) + "&colour=" + encodeURIComponent(_0x34e9f5) + "&uid=" + _0x47416f;
 try {
 const _0x1598a7 = await axios.get(_0x226845, {
 'responseType': "stream"
 });
 const _0xf0c350 = _0x1598a7.data;
 _0x1cb5ab.sendMessage({
 'body': "⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆\n✧⃝•🩷𝗙𝗜𝗥𝗦𝗧 𝗡𝗔𝗠𝗘: " + _0x3ea3dd + "\n✧⃝•💜𝗦𝗘𝗖𝗢𝗡𝗗 𝗡𝗔𝗠𝗘:" + _0x6252a8 + "\n✧⃝•🤍𝗔𝗗𝗗𝗥𝗘𝗦𝗦: " + _0x3744c5 + "\n✧⃝•💛𝗠𝗔𝗜𝗟: " + _0x1bb59a + "\n✧⃝•❤️‍🩹𝗣𝗛𝗢𝗡𝗘 𝗡𝗢.: " + _0x34c576 + "\n✧⃝•💖𝗖𝗢𝗟𝗢𝗥: " + _0x34e9f5 + "\n✧⃝•❤️𝗨𝗦𝗘𝗥 𝗡𝗔𝗠𝗘: " + _0x2d3b59 + "\n✧⃝•💛𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : " + _0xb7cc01 + "\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆",
 'attachment': _0xf0c350
 }, _0x39784b.threadID, _0x39784b.messageID);
 } catch (_0x5d9b8d) {
 console.error(_0x5d9b8d);
 _0x1cb5ab.sendMessage("An error occurred while generating the FB cover.", _0x39784b.threadID);
 }
 }
};
