import nlp from 'compromise';
import { Movements, goals } from "mineflayer-pathfinder";

function randomReply(array) {
	//return back a random reply from the array
	return array[Math.floor(Math.random() * array.length)];
}

let state = {
	isFollowing: false,//can be set to owner
}

//export a function that takes message and owner as input

export default async function messageAction({ message, owner, bot }) {
	let myName = bot.username;
	//use nlp to parse the message
	let doc = nlp(message);
	//if the message is directed at the bot
	if (true) {
		//the bot will either respond or take necessary actions.

		//if the message contains "hello" or "hi"
		if (doc.has("hello") || doc.has("hi")) {
			//return a random greeting
			return randomReply(["Hello", "Hi", "Hey", "Yo"]) + randomReply([owner + " !", "!", ""]);
		}
		//if the message contains "how are you"
		//		if(doc.has("how").has("are").has("you")){
		if ((doc.has("how") && doc.has("are") && doc.has("you")) || (doc.has("how") && doc.has("r") && doc.has("u")) || (doc.has("how") && doc.has("u"))) {
			//return a random response
			return randomReply(["I'm good", "I'm fine", "I'm doing well", "I'm doing good", "freakin' bored", "fkin bored"]) + randomReply([", " + owner, ""]);
		}
		//if the message contains "what are you doing" or "what you doing" or "what u doing" or "what r u doing" or "what are u doin" or any similar combinations
		if ((doc.has("what") && doc.has("are") && doc.has("you") && doc.has("doing")) || (doc.has("what") && doc.has("you") && doc.has("doing")) || (doc.has("what") && doc.has("u") && doc.has("doing")) || (doc.has("what") && doc.has("r") && doc.has("u") && doc.has("doing")) || (doc.has("what") && doc.has("are") && doc.has("u") && doc.has("doin"))) {
			//return a random response
			return randomReply(["Nothing much", "Nothing", "Just chillin'", "Chillin'", "Just chilling...", "idk man"]) + randomReply([", " + owner, ""]);
		}
		//if the msg contains "where u at" or "where are you" or "where r u" or "where are u" or "where are you at" or "where r u at" or "where are u at" or "ur coords" and is a question
		if ((doc.has("where") && doc.has("u") && doc.has("at")) || (doc.has("where") && doc.has("are") && doc.has("you")) || (doc.has("where") && doc.has("r") && doc.has("u")) || (doc.has("where") && doc.has("are") && doc.has("u")) || (doc.has("where") && doc.has("are") && doc.has("you") && doc.has("at")) || (doc.has("where") && doc.has("r") && doc.has("u") && doc.has("at")) || (doc.has("where") && doc.has("are") && doc.has("u") && doc.has("at")) || (doc.has("ur") && doc.has("coords"))) {
			//return a random response that contains "{my_coords}"
			return randomReply(["I'm at {my_coords}", "at {my_coords}", "{my_coords}"]) + randomReply([", " + owner, ""]);
		}
		//if msg contains "what's your hunger" or similar questions
		if ((doc.has("what") && (doc.has("your") || doc.has("ur")))) {
			if (doc.has("hunger") && doc.has("health")) {
				return randomReply(["My hunger is {my_hunger} and my health is {my_health}", "I'm at {my_hunger} hunger and {my_health} health"]) + randomReply([", " + owner, ""]);
			}
			else if (doc.has("hunger")) {
				return randomReply(["My hunger is {my_hunger}", "I'm at {my_hunger}"]) + randomReply([", " + owner, ""]);
			}
			else if (doc.has("health")) {
				return randomReply(["My health is {my_health}", "I'm at {my_health}"]) + randomReply([", " + owner, ""]);
			}
		}
		//if msg contains "fight me"or "pvp me" fight the player
		if (doc.has("fight") || doc.has("pvp")) {
			let player = bot.players[owner] ? bot.players[owner].entity : null;
			if (!player) {
				return randomReply(["I can't see you", "I can't find you", "I can't see you anywhere", "I can't find you anywhere"]) + randomReply([", " + owner, ""]);
			}
			bot.pvp.attack(player);
			console.log(bot.pvp);
			return randomReply(["DIEE!!", "just die!", "FAILURE!!!"]);
		}
		//if msg contains "stop fighting", "i give up", "stop"
		if (doc.has("stop") || doc.has("give") || doc.has("up")) {
			bot.pvp.stop();
			return randomReply(["That's all you got?","You're weak","You're weak, " + owner]);
		}

		//if msg contains "follow me" or "follow" or "come with me" or "come with" or "come here" or "come" or "cum here" or "cum"
		//or if msg contains "follow {player}" or "goto {player}"
		if (doc.has("follow")) {
			let target;
			if (doc.match("#firstName").text()) {
				let playerName = doc.match("#firstName").text();
				console.log("uh", playerName);
				target = bot.players[playerName] ? bot.players[playerName].entity : null;
			}
			else {
				target = bot.players[owner] ? bot.players[owner].entity : null;
				if (!target) {
					return randomReply(["I can't see you", "I can't find you", "I can't see you anywhere", "I can't find you anywhere"]) + randomReply([", " + owner, ""]);
				}
			}
			const defaultMove = new Movements(bot);
			bot.pathfinder.setMovements(defaultMove);
			bot.setControlState('sprint', true);
			bot.pathfinder.setGoal(new goals.GoalFollow(target, 3), true);
			return randomReply(["On my way", "Coming", "I'm coming", "I'm on my way", `I'm following ${target.username}`, "Roger that!"]) + randomReply([", " + owner, ""]);
		}

		//if msg contains "come here" "cum here" goto owner
		if ((doc.has("come") && doc.has("here")) || (doc.has("cum") && doc.has("here"))) {
			const target = bot.players[owner] ? bot.players[owner].entity : null;
			if (!target) {
				return randomReply(["I can't see you", "I can't find you", "I can't see you anywhere", "I can't find you anywhere"]) + randomReply([", " + owner, ""]);
			}
			const defaultMove = new Movements(bot);
			bot.pathfinder.setMovements(defaultMove);
			bot.setControlState('sprint', true);
			bot.pathfinder.setGoal(new goals.GoalNear(target.position.x, target.position.y, target.position.z, 1));
			return randomReply(["On my way", "Coming", "I'm coming", "I'm on my way", "cumming!"]) + randomReply([", " + owner, ""]);
		}
		return;
	}
}
