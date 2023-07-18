import enquirer from "enquirer";
const { prompt, Select } = enquirer;
import { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import autoeat from "mineflayer-auto-eat";
import pvp from "mineflayer-pvp";
import armorManager from "mineflayer-armor-manager";
import ai from "./ai";
import attackBack from "./actions/attackBack.js";
const bot = createBot({
	host: "100.100.118.28", // optional
	port: 25565, // optional
	username: process.env.NAME || "HelloWorld",
	auth: "offline",
	logErrors: false,
});
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoeat.plugin);
bot.loadPlugin(pvp.plugin);
bot.loadPlugin(armorManager);

bot.on("chat", async (username, message) => {
	if (username === bot.username) return;
	let res = await ai({ message: message.replaceAll(bot.username, ""), owner: username, bot });
	console.log(`%c[CHAT] %c${username}: %c${message}`, "color: #00ff00", "color: #5865F2;", "color: white");
	//log res and chat
	if (res) {
		res = res.replaceAll("{my_coords}", bot.entity.position.toString())
			.replaceAll("{my_hunger}", bot.food)
			.replaceAll("{my_health}", bot.health);
		console.log(`%c[CHAT] %c${bot.username}: %c${res}`, "color: #00ff00", "color: #5865F2;", "color: white");
		bot.chat(res);
	}
});

bot.on("physicTick", () => {
	//look at nearest player
	const playerFilter = (entity) => entity.type === "player";
	const playerEntity = bot.nearestEntity(playerFilter);
	if (!playerEntity) return;
	bot.lookAt(playerEntity.position.offset(0, playerEntity.height, 0));
});

bot.on("physicTick", () => {
	//if in lava, swim up and get out somehow
	if (bot.entity.isInLava) {
		bot.setControlState("jump", true);
		bot.setControlState("sprint", true);
		bot.setControlState("forward", true);
	}
});

bot.on("messagestr", (message) => {
	console.log(message);
});

bot.on("playerUpdated", async (player) => {
	//return if the player is the bot
	if (player.username === bot.username) return;
});

bot.on("spawn", () => {
	console.log("%c[INFO] %cSpawned!", "color: #00ff00", "color: white");
	attackBack(bot);
});

bot.on("end", () => {
	console.log("%c[INFO] %cDisconnected!", "color: #00ff00", "color: white");
});

bot.on("error", err => {
	console.log("%c[ERROR] %cError!", "color: #ff0000", "color: white");
	console.log(err);
});

async function run(msg) {
	const cmd = msg.split(" ")[0];
	const args = msg.split(" ").slice(1);
	let commands = ["help", "say", "stop"];
	switch (cmd) {
		case "help":
			console.log("Commands:");
			console.log(commands.join("\n"));
			break;
		case "stop":
			bot.end();
			process.exit();
		default:
			bot?.chat(msg);
			break;
	}
}

//ask for commands infinitely
const ask = async () => {
	const { command } = await prompt({
		type: "input",
		name: "command",
		message: "> "
	});
	await run(command);
	await ask();
}

await ask();
