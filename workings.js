let crit, dmg, score = 0, monsters_array = [], totalMonsters = 0;

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
	{ name: "archer", room: 1, total: 10, current: 10, attack: 1, accuracy: .3, loot: 1, alive:true, id: undefined,healthyimg:"images/archer_healthy.png",woundedimg:"images/archer_wounded.png",badlywoundedimg:"images/archer_badlywounded.png",neardeathimg:"images/archer_neardeath.png",deadimg:"images/archer_dead.png" },
	{ name: "swordsman", room: 2, total: 20, current: 20, attack:1,accuracy:.4, loot: 2, alive:true, id: undefined,healthyimg:"images/swordsman_healthy.png",woundedimg:"images/swordsman_wounded.png",badlywoundedimg:"images/swordsman_badlywounded.png",neardeathimg:"images/swordsman_neardeath.png",deadimg:"images/swordsman_dead.png"  },
	{ name: "spearman",	room: 1, total: 25,	current: 25, attack: 1,	accuracy: .3,loot: 3, alive:true, id:undefined, healthyimg:"images/spearman_healthy.png",woundedimg:"images/spearman_wounded.png",badlywoundedimg:"images/spearman_badlywounded.png",neardeathimg:"images/spearman_neardeath.png",deadimg:"images/spearman_dead.png" },
	{ name: "sergeant",	room: 1,total: 35, current: 35, attack: 1, accuracy: .3, loot: 4, alive:true, id:undefined, healthyimg:"images/sergeant_healthy.png",woundedimg:"images/sergeant_wounded.png",badlywoundedimg:"images/sergeant_badlywounded.png",neardeathimg:"images/sergeant_neardeath.png",deadimg:"images/sergeant_dead.png"},
	{ name: "knight", room:5, total:30, current:30, attack:2, accuracy:.15, loot:5, alive:true, id:undefined, healthyimg:"images/knight_healthy.png",woundedimg:"images/knight_wounded.png",badlywoundedimg:"images/knight_badlywounded.png",neardeathimg:"images/knight_neardeath.png",deadimg:"images/knight_dead.png"}
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
	critChance: .2,
	dodgeChance: .2,
	totalHealth: 8,
	currentHealth: 8,
	stance: 0
}

function reportIntroduction(){
	$("#combatlog").append(
		"<span> A stray bolt sends your horse falling to the ground. The poor beast is dead before it lands. You pull yourself free and remove your helmet to get a better view of the battlefield. Banners hang in the wind, torn and defeated. There are no horns or shouts from commanders; no flags to give instruction to either of the armies engaged with each other. It is every commander's worst fear--your own included. It is nothing resembling an organized battle any longer. It has devolved into an unchecked melee. </br> Soldiers die all around you--not good, or evil. Just men born into different lands, wearing different colors, and all just doing their best to make it through another bloodied battle someone else thrust them into. </br> You survey the chaos and look for a weapon to arm yourself with. If you are to survive this day, it means you'll have to make sure some others won't. </br>   </span>"
	);
}

function findTarget(id){
	console.log("hello?", id);
	let target = monsters_array.filter((monster) => {
		return monster.id == id;
	});
	let found = target[0]
	console.log("findTarget target:", found);
	return found
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

function dealDamageToTarget(target, damage, critical){
	//Find the new health after dealing damage
	console.log("dealDamageToTarget target:", target);
	let newHealth = target.total - damage;
	//Set the new health 
	target.total = newHealth;
	//Find the % to send to the next function 
	let returnHealth = (target.total / newHealth) * 100;
	console.log("Damage: ", damage, " Total:", newHealth);

	if(targetIsAlive(target)){ 
		reportHitMessage(returnHealth, target, critical);
	} else {
		processMonsterDeath(target);
	}
}

function reportHitMessage(health, target, critical){
	console.log("target in reportHitMessage:", target, "health: ", health);
	let verb = playerCharacter.weapon.weaponVerb

	let attackColorClass = critical ? "criticalHit" : "hit" 

	switch(health){
		case health == 100: 
			console.log(health);
			break;
		case health < 100 && health > 60:
			$("#combatlog").append(`<span class=${attackColorClass}> You ${verb} the ${target.name}. It's wounded!</span><br>`);
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
			console.log(target, " is dead");
			processMonsterDeath(target);
	}
}

function reportMissMessage(name) {
	$("#combatlog").append("<span class=successfulAttack> You miss hitting the " + name + ".</span><br>");
}

function reportIncomingHitMessage(name, damage){
	$("#combatlog").append("<span class=enemyattacksuccess> The "+ name + " hits you for " + damage + " points of damage.</span><br>");
}

function setPlayerHealth(damage){
	playerCharacter.currentHealth = playerCharacter.currentHealth - damage;

	$("#playerhealth").html("");
	for(i=0; i<playerCharacter.currentHealth; i++){
		$("#playerhealth").append("<img src='images/redblock.png' style='margin:1px 1px 1px 1px'>");
	}

	if (playerCharacter.currentHealth <= 0){
		processPlayerDeath()
	}
}

function processPlayerDeath(){
	$(':button').prop('disabled',true);
	$("#combatlog").append("<span class=death> The "+ target.name + " kills you.</span><br>");
}

function reportMonsterDeath(target) {	
	console.log("RMD", target);
	let monster_healthbar = "#monster_" + target.id;
	let monsterIdButton= "#attack_" + target.id;
	$(':button').prop('disabled',true);
	$("#combatlog").append("<span class=attacksuccess> You deliver a killing blow to "+ target.name+".</span><br>");
	$(monster_healthbar).html("<img src="+target.deadimg+">");
	$(monsterIdButton).prop("disabled",true);
}

function processMonsterDeath(target) {
	console.log("PMD", target);
	reportMonsterDeath(target); 
	let middiv = "#div" + target.id;

	score += target.loot;
	target.alive = false;

	$("#playerscore").html(score);
	delete monsters_array[target];			

	console.log("Before:", monsters_array);
	let remove = monsters_array.filter((monster) => {
		return monster.id == target.id;
	});

	monsters_array.splice(remove, 1);
	console.log("After:", monsters_array);

	middiv = "#div"+target.id;
	$(middiv).html("");
	setTimeout(function(){
		spawnEnemy();		
		$(':button').prop('disabled',false);	
		$(':image').prop('disabled',false);						
	},2000);

};

function targetIsAlive(target){
	console.log("is alive", target);
	if (target.current >= target.total) {
		return true;
	}
}

function check(space){
	console.log("SPACE", space);
	let target = findTarget(space);
	console.log("Target inside 'check' function:", target);

	if (checkAccuracy()) {
		console.log("ITS A HIT!");
		let critical = (checkCriticalHit() < crit) 
		let damage = findDamageToTarget(playerCharacter.weapon.damage, critical);
		dealDamageToTarget(target, damage, critical);
	} else {
		reportMissMessage(target.name);
		//WE MISSED IT
		console.log("THATS A MISS");
	}
	//TARGET RETURNS ATTACK
	if (targetIsAlive(target)) {
		setTimeout(function() { 
			console.log("attacking in the check function");
			attackPlayer(target);
		}, 1500) 
	}	

	//DISABLE BUTTONS AT THE END OF THE ATTACK
	$(':button').prop('disabled',true);
	$(':image').prop('disabled',true);
	updateScroll();
}

// PLAYER TAKES DAMAGE EACH TIME DAMAGE IS GIVEN
function attackPlayer(target){
	console.log("attackPlayer", target);
	let hitpoints = playerCharacter.currentHealth;
	console.log("Initiating Attack Function, Hitpoints: ", hitpoints);;

	let roll = Math.random();
	let goal = target.accuracy;

	console.log("Roll: ", roll, "Goal:", goal);

	//IF THE ENEMY SUCCEEDS
	if (roll > goal){
		console.log("DC", playerCharacter.dodgeChance)
		
		//Check our chance to dodge an incoming attack
		let dodge = playerCharacter.dodgeChance;
		let incoming = Math.random();
		
		if (incoming > dodge){
			let enemyDamage = Math.floor(target.attack * (Math.random() * 3))
			reportIncomingHitMessage(target.name, enemyDamage);
			setPlayerHealth(enemyDamage);
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

	setTimeout(function(){
		$(':button').prop('disabled',false);
		$(':image').prop('disabled',false);
	}, 5000);
}
	
//INITIALIZE
function doPlayer(){
	$("#playerscore").html(score);
	for(i=0; i< playerCharacter.totalHealth; i++){
		$("#playerhealth").append("<img src='images/redblock.png' style='margin:1px 1px 1px 1px'>");
	}
	setStanceButtons();
	$("#playerbreather").html("<button id='respiteButton' type=button onclick=breather()> Find a respite </button>")
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
			console.log("breather attack");
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
		value: totalMonsters,
		writable: false
	  });
	totalMonsters += 1;
	monsters_array.push(newSpawn); 
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
	html += "<p id=monster_"+newSpawn.id+" > <span><input type=image disabled=true src="+ newSpawn.healthyimg + " onclick=check(" + newSpawn.id + ") id=attack_" + newSpawn.id + "></span> </p>" ;
	html += '<p id=' + thispar +'>'+ '</p>';
	$("#combatlog").append("<span class=enemyspawn>"+ a + " " + newSpawn.name + " approaches you. ID: (" + newSpawn.id +")</span><br>");
	$("#monstersbox").append('<div class=monsterholder id="div'+ newSpawn.id +'">' + html + "</div>");
}

function checkNumberOfEnemies(){
	if ((monsters_array.length + 1) <= 3){
		setTimeout(function(){
			console.log(monsters_array.length);
			spawnEnemy();	
		}, 1500);
	}
}

function setStanceButtons(){
	for(i=0;i<stances.length;i++){
		var html = '';
		html += "<button class='stanceButton' onclick=stance_set("+i+") id=stance"+i+">" + stances[i].name + "</button>"
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
		$("#combatlog").append("<span> You relax and allow your instincts to react to whatever comes next.</span><br>");
		playerCharacter.dodgeChance = stances[0].dodge;
		playerCharacter.critChance = stances[0].crit;
		playerCharacter.stance = 0;
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