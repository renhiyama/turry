export default function attackBack(bot){
	console.log("%c[INFO] %cLoaded attackBack.js!", "color: #00ff00", "color: white");
	//listen for event where user attacks you
	bot.on("entityHurt", async(entity) => {
		console.log(entity);
		if(entity.username === bot.username) return;
		//attack normally once if the entity is a player
		if(entity.type === "player"){
			console.log(`%c[INFO] %cAttacking ${entity.username}!`, "color: #00ff00", "color: white");
			bot.attack(entity);
			return;
		}
		//attack critically continuously if the entity is not a player until it dies
		console.log(`%c[INFO] %cAttacking ${entity.displayName}!`, "color: #00ff00", "color: white");
		while(entity.health > 0){
			//crit attack = jump + attack while falling
			bot.setControlState("jump", true);
			bot.attack(entity, true);
			await sleep(500);
		}
	});
}
