const fs = require("fs"),
	path = require("path"),
	axios = require("axios");

module.exports.config = {
	name: "give",
	version: "1.0",
	hasPermssion: 2,
	credits: "Shaon Ahmed",
	description: "Upload local command files to a pastebin service.",
	commandCategory: "System",
	usages: "[filename]",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
	if (args.length === 0) 
		return api.sendMessage("📁 অনুগ্রহ করে ফাইলের নাম দিন।\nব্যবহার: pastebin <filename>", event.threadID, event.messageID);

	const fileName = args[0];
	const commandsPath = path.join(__dirname, "..", "commands");
	const filePath1 = path.join(commandsPath, fileName);
	const filePath2 = path.join(commandsPath, fileName + ".js");

	let fileToRead;
	if (fs.existsSync(filePath1)) {
		fileToRead = filePath1;
	} else if (fs.existsSync(filePath2)) {
		fileToRead = filePath2;
	} else {
		return api.sendMessage("❌ `commands` ফোল্ডারে ফাইলটি খুঁজে পাওয়া যায়নি।", event.threadID, event.messageID);
	}

	fs.readFile(fileToRead, "utf8", async (err, data) => {
		if (err) {
			console.error("❗ Read error:", err);
			return api.sendMessage("❗ ফাইলটি পড়তে সমস্যা হয়েছে।", event.threadID, event.messageID);
		}
		try {
			api.sendMessage("📤 ফাইল আপলোড হচ্ছে PasteBin-এ, অনুগ্রহ করে অপেক্ষা করুন...", event.threadID, async (error, info) => {
				if (error) return console.error(error);

				const pastebinAPI = "https://pastebin-api.vercel.app";
				const response = await axios.post(`${pastebinAPI}/paste`, { text: data });

				setTimeout(() => {
					api.unsendMessage(info.messageID);
				}, 1000);

				if (response.data && response.data.id) {
					const link = `${pastebinAPI}/raw/${response.data.id}`;
					return api.sendMessage(`📄 ফাইল: ${path.basename(fileToRead)}\n✅ ফাইল সফলভাবে লিংক তেরি হয়েছে:\n🔗 ${link}`, event.threadID);
				} else {
					console.error("⚠️ Unexpected API response:", response.data);
					return api.sendMessage("⚠️ আপলোড ব্যর্থ হয়েছে। PasteBin সার্ভার থেকে সঠিক আইডি পাওয়া যায়নি।", event.threadID);
				}
			});
		} catch (uploadError) {
			console.error("❌ Upload error:", uploadError);
			return api.sendMessage("❌ ফাইল আপলোড করতে সমস্যা হয়েছে:\n" + uploadError.message, event.threadID);
		}
	});
};
