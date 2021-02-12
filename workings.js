let crit, dmg, score = 0, monsters_array = [], monsters_count = 0, place = 0;

const armory = [
	{ name:"Greatsword", verb:"slash", missverb:"swing", url: "images/greatsword.png", value: 0, damage: 7, crit: .3, helptext: "High damage, low critical"},
	{ name:"Warhammer", verb:"crush", missverb: "swipe", value: 1, url: "images/warhammer.png", damage: 5, crit: .5, helptext: "A balanced weapon" },
	{ name:"Axe", verb:"chop", missverb: "hack",value: 2, url: "images/axe.png", damage: 3, crit: .7, helptext: "Low damage, high critical" }
]

const stances = [
	{ name: "steady", dodge: .2, crit: .2 },
	{ name: "defensive", dodge:.3, crit: .1 },
	{ name: "offensive", dodge: .1, crit: .3 },
	{ name: "reckless", dodge:0, crit: .4 }
]

var monstersList = [
	{ name: "archer", room: 1, total: 10, current: 10, attack: 1, accuracy: .3, loot: 1, alive:true, id: undefined,healthyimg:"archer_healthy.png",woundedimg:"archer_wounded.png",badlywoundedimg:"archer_badlywounded.png",neardeathimg:"archer_neardeath.png",deadimg:"archer_dead.png" },
	{ name: "swordsman", room: 2, total: 20, current: 20, attack:1,accuracy:.4, loot: 2, alive:true, id: undefined,healthyimg:"swordsman_healthy.png",woundedimg:"swordsman_wounded.png",badlywoundedimg:"swordsman_badlywounded.png",neardeathimg:"swordsman_neardeath.png",deadimg:"swordsman_dead.png"  },
	{ name: "spearman",	room: 1, total: 25,	current: 25, attack: 1,	accuracy: .3,loot: 3, alive:true, id:undefined, healthyimg:"spearman_healthy.png",woundedimg:"spearman_wounded.png",badlywoundedimg:"spearman_badlywounded.png",neardeathimg:"spearman_neardeath.png",deadimg:"spearman_dead.png" },
	{ name: "sergeant",	room: 1,total: 35, current: 35, attack: 1, accuracy: .3, loot: 4, alive:true, id:undefined, healthyimg:"sergeant_healthy.png",woundedimg:"sergeant_wounded.png",badlywoundedimg:"sergeant_badlywounded.png",neardeathimg:"sergeant_neardeath.png",deadimg:"sergeant_dead.png"},
	{ name: "knight", room:5, total:30, current:30, attack:2, accuracy:.15, loot:5, alive:true, id:undefined, healthyimg:"knight_healthy.png",woundedimg:"knight_wounded.png",badlywoundedimg:"knight_badlywounded.png",neardeathimg:"knight_neardeath.png",deadimg:"knight_dead.png"}
]

let playerCharacter = {
	name: "Player",
	weapon: {
		crit: 0,
		damage: 0,
		verb: null
	},
	weaponValue: undefined,
	weaponVerb: "",
	weaponDamage: 0,
	critChance: 0,
	dodgeChance: 0,
	totalHealth: 8,
	currentHealth: 8,
	potions: 2,
	stance: 0
}

function reportIntroduction(){
	$("#combatlog").append(
		"<span> A stray bolt sends your horse falling to the ground. The poor beast is dead before it lands. You pull yourself free and remove your helmet to get a better view of the battlefield. Banners hang in the wind, torn and defeated. There are no horns or shouts from commanders; no flags to give instruction to either of the armies engaged with each other. It is every commander's worst fear--your own included. It is nothing resembling an organized battle any longer. It has devolved into an unchecked melee. </br> Soldiers die all around you--not good, or evil. Just men born into different lands, wearing different colors, and all just doing their best to make it through another bloodied battle someone else thrust them into. </br> You survey the chaos and look for a weapon to arm yourself with. If you are to survive this day, it means you'll have to make sure some others won't. </br>   </span>"
	);
}

function findTarget(id){
	let target = monsters_array.filter((monster) => {
		return monster.id == id;
	});
	return target
}

function checkAccuracy(){
	let i = Math.random();
	if (i >= .4) {
		return true;
	} else {
		return false
	}
}

function checkCriticalHit(){
	let i = Math.random();
	if(i < playerCharacter.crit ) { 
		return true 
	} else { 
		return false 
	}
};

function findDamageToTarget(weaponDamage, criticalHit){
	//Find the damage
	let damage = Math.round(weaponDamage * (Math.random() * 10))
	//Multiply if critical
	return criticalHit ? damage * 2 : damage; 
}

function dealDamageToTarget(target, damage){
	//Find the new health after dealing damage
	console.log("TARRRRRGET", target);
	let newHealth = target.total - damage;
	//Set the new health 
	target.total = newHealth;
	//Find the % to send to the next function 
	let returnHealth = (target.total / newHealth) * 100;
	console.log("Damage: ", damage, " Total:", newHealth);
	reportHitMessage(returnHealth, target);
	//Trigger the return attack after a player deals damage.
	setTimeout(function() {
		attackPlayer(target)}, 1500);
}

function reportHitMessage(health, target){
	console.log(target, "ERARE")
	let total = target.total
	let current = target.current;

	switch(health){
		case health == 100: 
			console.log(health);
			break;
		case health < 100 && health > 60:
			$("#combatlog").append("<span class=attacksuccess> You " + verb + " the "+ target.name + ". It's wounded!</span><br>");
			$(m_health).html("<span><input type=image src="+ target.woundedimg +" onclick=check(" + space + ") id=attack_" + space + "></span> </p>");
			console.log(health);
			break;
		case health <= 60 && health > 30:
			console.log(health);
			$("#combatlog").append("<span class=attacksuccess> You " + verb + " the " + target.name + ". It's badly wounded! </span><br>");
			$(m_health).html("<span><input type=image src=" + target.badlywoundedimg + " onclick=check(" + space + ") id=attack_" + space + "></span> </p>");
			break;
		case health <= 30 && health > 0:
			console.log(health);
			$("#combatlog").append("<span class=attacksuccess> You " + verb + " the " + target.name + ". It's near death!</span> <br>");
			$(m_health).html("<span><input type=image src=" + target.neardeathimg + " onclick=check(" + space + ") id=attack_" + space + "></span> </p>");
			break;
		default: 
			console.log("monster is dead");
			reportMonsterDeath(space, target); 
	}
}

function reportMissMessage(name) {
	$("#combatlog").append("<span class=attacksuccess> You miss hitting the " + name + ".</span><br>");
}

function reportIncomingHitMessage(name, damage){
	$("#combatlog").append("<span class=enemyattacksuccess> The "+ name + " hits you for " + damage + " points of damage.</span><br>");
}

function setPlayerHealth(damage){
	playerCharacter.currentHealth = playerCharacter.currentHealth - damage;

	$("#playerhealth").html("");
	for(i=0; i<playerCharacter.currentHealth; i++){
		$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
	}

	if (playerCharacter.currentHealth <= 0){
		processPlayerDeath()
	}
}

function processPlayerDeath(){
	$(':button').prop('disabled',true);
	$("#combatlog").append("<span class=death> The "+ target.name + " kills you.</span><br>");
}

function reportMonsterDeath(space, target) {	
	let monster_healthbar = "#monster_" + space;
	let monsterIdButton= "#attack_" + space;
	$(':button').prop('disabled',true);
	$("#combatlog").append("<span class=attacksuccess> The "+ target.name+" dies.</span><br>");
	$(monster_healthbar).html("<img src="+target.deadimg+">");
	$(monsterIdButton).prop("disabled",true);
	changeProperty('alive','false');
}

function processMonsterDeath(target) {
	console.log("PMD", target);
	let middiv = "#div" + space;

	score += target.loot;
	target.alive = false;

	$("#playerscore").html(score);
	delete monsters_array[target];			
	monsters_count -= 1;

	console.log("Before:", monsters_array);
	let remove = monsters_array.filter((target) => {
		return monster.place == space;
	});

	monsters_array.splice(remove, 1);
	console.log("After:", monsters_array);

	middiv = "#div"+space;
	$(middiv).html("");
	setTimeout(function(){
		spawnEnemy();		
		$(':button').prop('disabled',false);	
		$(':image').prop('disabled',false);						
	},2000);

};

function check(space){
	console.log("SPACE", space);
	let target = findTarget(space);

	if (checkAccuracy()) {
		console.log("ITS A HIT!");
		let critical = (checkCriticalHit() < crit) 
		let damage = findDamageToTarget(playerCharacter.weapon.damage, critical);

		dealDamageToTarget(target, damage);
		attackPlayer(target);
		} else {
		reportMissMessage(target.name);
		attackPlayer(target);
			//WE MISSED IT
		console.log("THATS A MISS");
	}
	//DISABLE BUTTONS AT THE END OF THE ATTACK
	$(':button').prop('disabled',true);
	$(':image').prop('disabled',true);
	updateScroll();
}

// PLAYER TAKES DAMAGE EACH TIME DAMAGE IS GIVEN
function attackPlayer(target){
	console.log("TARGET", target);
	let hitpoints = playerCharacter.currentHealth;
	console.log("Initiating Attack Function, Hitpoints: ", hitpoints);;

	//IF THE ENEMY SUCCEEDS
	if (Math.random() < target.accuracy){
		//If we fail to dodge 
		if (playerCharacter.dodgeChance > Math.random()){
			let enemyDamage = Math.floor(target.attack * (Math.random() * 3))
			reportIncomingHitMessage(target.name, enemyDamage);
			setPlayerHealth(enemyDamage);

			playerCharacter.current -= enemyDamage;

		} else {
		//If we succeed to dodge	
			$("#combatlog").append("<span class=dodgesuccess> You avoid the blow from the "+ target.name + ".</span><br>");
		}
	
	} else {
		$("#combatlog").append("<span class=dodgesuccess> The "+ target.name + " missed you.</span><br>");
	}
	setTimeout(function(){
		$(':button').prop('disabled',false);	
		$(':image').prop('disabled',false);
	}, 1000);
	updateScroll();
}

function loot(target){
	var loot_target = monsters_array[target];
	var loot_button = "lootybutton"+target;
	inventory.push(loot_target.loot);
	inventory.join(", ");
	document.getElementById("inventory").innerHTML = inventory;
	document.getElementById(loot_button).disabled = true;

}
//ACCESSING THE PROPERTIES OF EACH MONSTER IN THE MONSTER_ARRAY
function changeProperty(value,property){
	for (var i in monsters_array){
		if(monsters_array[i].total == value){
		monsters_array[M].current = property;
		break;
		}
	}
}
// WEAPON SELECTION AND DAMAGE 
function select_weapon(r){
	console.log("R", r);
	let weaponname = armory[r].name;
	playerCharacter.weapon = armory[r]
	$("#playerweapon").append(weaponname);
	document.getElementById("weaponselection").style.display = "none";
	roomstart();
};

// WE GOTTA START THAT ROOM
function roomstart(){
	$(':button').prop('disabled',true);
	$(':image').prop('disabled',true);
	spawnEnemy();

	document.getElementById("startroom").style.display = "none";

	setTimeout(function(){
		$(':button').prop('disabled',false);
		$(':image').prop('disabled',false);
	}, 5000);
}
	
//INITIALIZE
function doPlayer(){
	$("#playerscore").html(score);
	for(i=0; i< playerCharacter.totalHealth; i++){
		$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
	}
	setStanceButtons();
	$("#playerbreather").html("<button type=button onclick=breather()> Find a respite </button>")
}

//ON THE START
$(document).ready(function() {
	doPlayer();
	reportIntroduction();
	setTimeout(function() { 
	listArmory(), updateScroll() ;}, 5000);
});

function listArmory(){
	armory.forEach((e, i) =>  {
		console.log(i)
		$("#weaponselection").append("<input type=image src=" + e.url + " style='margin:5px' onclick=select_weapon("+i+") alt="+e.helpText+">");
	})
}

function breather(){
	$(':button').prop('disabled',true);	

	if (playerCharacter.currentHealth < playerCharacter.totalHealth) {
		let rest = Math.ceil(Math.random() * 3);
		$("#combatlog").append("You step away and take a breather.<br>");

		for(i=0; i<rest; i++){
			if (playerCharacter.currentHealth < playerCharacter.totalHealth){
				playerCharacter.currentHealth += 1;
				$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
				console.log("rest " + rest)
			} else {
				$("#combatlog").append("You catch your second wind. <br>");
				console.log("health full");
			}
		}

		let attackernumber = Math.floor(Math.random() * 3);	
		let attacker = monsters_array[attackernumber]; 

		setTimeout(function(){
			attackPlayer(attacker); 
			$(':button').prop('disabled',false);	
		}, 1500)
	} else {
		$("#combatlog").append("You do not need to catch your breath. <br>");
		$(':button').prop('disabled',false);	
	}
}

function spawnEnemy(){
	let monsterIndex = Math.floor(Math.random() * 5);
	let newSpawn = {}
	newSpawn = Object.assign(monstersList[monsterIndex], newSpawn);
	Object.defineProperty(newSpawn, 'id', {
		value: monsters_count,
		writable: false
	  });
	monsters_count ++;
	checkNumberOfEnemies();
	reportMonsterSpawn(monsterIndex, newSpawn);
	updateScroll();
}

function reportMonsterSpawn(monsterIndex, newSpawn){
	console.log("HELLO,", monsterIndex, newSpawn);
	if (monsterIndex == 0){
		var a = "An";
	} else {
		var a = "A";
	}
	let html = ""
	let thispar = "m" + newSpawn.id;	
	html += "<p id=monster_"+place+" > <span><input type=image disabled=true src="+ newSpawn.healthyimg + " onclick=check(" + newSpawn.id + ") id=attack_" + newSpawn.id + "></span> </p>" ;
	html += '<p id=' + thispar +'>'+ '</p>';
	$("#combatlog").append("<span class=enemyspawn>"+ a + " " + newSpawn.name + " approaches you.</span><br>");
	$("#monstersbox").append('<div class=monsterholder id="div'+ newSpawn.id +'">' + html + "</div>");
	monsters_array.push(newSpawn); 
}

function checkNumberOfEnemies(){
	if (monsters_count < 3){
		setTimeout(function(){
			spawnEnemy();	
		}, 1500);
	}
}

function setStanceButtons(){
	for(i=0;i<stances.length;i++){
		var html = '';
		html += "<button onclick=stance_set("+i+") id=stance"+i+">" + stances[i].name + "</button>"
		$("#stanceselect").append(html);
		}
}
function stance_set(next){
	if (playerCharacter.stance == next){
			return;
	}
	switch (next){
	case 0:
		$("#playerstance").html("Steady");
		$("#combatlog").append("<span> You lean back and set your feet into a defensive stance.</span><br>");
		playerCharacter.dodgeChance = stances[1].dodge;
		playerCharacter.critChance = stances[1].crit;
		playerCharacter.stance = 1;
	case 1:
		$("#playerstance").html("Defensive");
		$("#combatlog").append("<span> You lean back and set your feet into a defensive stance.</span><br>");
		playerCharacter.dodgeChance = stances[1].dodge;
		playerCharacter.critChance = stances[1].crit;
		playerCharacter.stance = 1;
		break;
	case 2:
		$("#playerstance").html("Offensive");
		$("#combatlog").append("<span> You set one foot backwards, readying to strike.</span><br>");
		playerCharacter.dodgeChance = stances[2].dodge;
		playerCharacter.critChance = stances[2].crit;
		playerCharacter.stance = 2;
		break;
	case 3: 
		$("#playerstance").html("Reckless");
		$("#combatlog").append("<span> You spread your feet and prepare to leap into the fray.</span><br>");
		playerCharacter.dodgeChance = stances[3].dodge;
		playerCharacter.critChance = stances[3].crit;
		playerCharacter.stance = 3;
		break;
		default:	
}

	updateScroll();
	$("#playercrit").html(playerCharacter.critChance * 100);
	$("#playerdodge").html(playerCharacter.dodgeChance * 100);

}

function updateScroll(){
	var box = document.getElementById("combatlog");
	box.scrollTop = box.scrollHeight;
}