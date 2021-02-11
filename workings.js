let crit, dmg, room = 1, score = 0, monsters_array = [], monsters_count = 0, place = 1, player_has_stance = playerCharacter.stance;

let playerCharacter = {
	name: "Player",
	weapon: "",
	weaponValue: undefined,
	weaponVerb: "",
	damage: 0,
	crit: 0,
	dodge: 0,
	total: 8,
	current: 8,
	potions: 2,
	stance: 0
}

function findTarget(space){
	let target = monsters_array.filter((monster) => {
		return monster.place == space;
	});
	return target
}

function checkAccuracy(){
	let i = Math.random();
	if (i > .5) {
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

function findDamageToTarget(weapon, criticalHit){
	//Find the damage
	let damage = Math.round(armory[weapon].damage * (Math.random() * 10))
	//Multiply if critical
	return criticalHit ? damage * 2 : damage; 
}

function dealDamageToTarget(target, damage){
	//Find the new health after dealing damage
	let newHealth = target.total - damage;
	//Set the new health 
	target.total = newHealth;
	//Find the % to send to the next function 
	let returnHealth = (target.total / newHealth) * 100;
	console.log("Damage: ", damage, " Total:", newHealth);
	reportHitMessage(returnHealth);
}

function reportHitMessage(health){
	let total = target.total
	let current = target.current;

	switch(health){
		case health == 100: 
			console.log(health);
			attackPlayer(target);
			break;
		case health < 100 && health > 60:
			$("#combatlog").append("<span class=attacksuccess> You "+verb+" the "+ target.name+". It's wounded!</span><br>");
			$(m_health).html("<span><input type=image src="+target.woundedimg+" onclick=check("+space+") id=attack_"+space+"></span> </p>");
			console.log(health);
			attackPlayer(target);
			break;
		case health <= 60 && health > 30:
			console.log(health);
			$("#combatlog").append("<span class=attacksuccess> You "+verb+" the "+ target.name+". It's badly wounded! </span><br>");
			$(m_health).html("<span><input type=image src="+target.badlywoundedimg+" onclick=check("+space+") id=attack_"+space+"></span> </p>");
			attackPlayer(target);
			break;
		case health <= 30 && health > 0:
			console.log(health);
			$("#combatlog").append("<span class=attacksuccess> You "+verb+" the "+ target.name+". It's near death!</span> <br>");
			$(m_health).html("<span><input type=image src="+target.neardeathimg+" onclick=check("+space+") id=attack_"+space+"></span> </p>");
			attackPlayer(target);
			break;
		default: 
			console.log("monster is dead");
			reportMonsterDeath(); 
	}
}

function reportMonsterDeath(){	
	let monster_healthbar = "#monster_" + space;
	let monsterIdButton= "#attack_" + space;
	$(':button').prop('disabled',true);
	$("#combatlog").append("<span class=attacksuccess> The "+ target.name+" dies.</span><br>");
	$(monster_healthbar).html("<img src="+target.deadimg+">");
	$(monsterIdButton).prop("disabled",true);
	changeProperty('alive','false');
}

function processMonsterDeath(){
	let middiv = "#div" + space;

	score += points;
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
		spawn_enemy();		
		$(':button').prop('disabled',false);	
		$(':image').prop('disabled',false);						
	},2000);
};

function check(space){
	var points = target.loot;
	console.log("mid-button",midbut);

	if (checkAccuracy()) {
		console.log("ITS A HIT!");
		let critical = (checkCriticalHit() < crit) 
		let damage = findDamageToTarget(weapon, critical);

		dealDamageToTarget(target, damage);
		attackPlayer();

		//MONSTER IS DEAD -- DO CHECKS
			
			
		
			
	} else {
//WE MISSED IT
		$("#combatlog").append("<span class=attacksuccess> You miss hitting the " + target.name + ".</span><br>");
		console.log("THATS A MISS");
	}

	//DISABLE BUTTONS AT THE END OF THE ATTACK
	$(':button').prop('disabled',true);
	$(':image').prop('disabled',true);
	updateScroll();

}

		
// PLAYER TAKES DAMAGE EACH TIME DAMAGE IS GIVEN
function attackPlayer(target){
	
	var hitpoints = playerCharacter.current;
	var hit = Math.random();
	var goal = target.accuracy;
	
	console.log("Initiating Attack Function, Hit:",hit," and goal:",goal);;

	//IF THE ENEMY SUCCEEDS
	if (hit < goal){ 
		var dodgecheck = Math.random();
	//CHECK AGAINST OUR DODGE
		//HIT
		if (playerCharacter.dodge < dodgecheck){
		//DODGE FAIL -- WE GET HIT
		$("#combatlog").append("<span class=enemyattacksuccess> The "+ target.name+" hits you.</span><br>");

			playerCharacter.current -= target.attack;
			hitpoints -= target.attack;
		//	console.log("DODGE FAIL");
			$("#playerhealth").html("");
			for(i=0; i<hitpoints; i++){
				$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
			}
				if (hitpoints <= 0){
				$(':button').prop('disabled',true);
				$("#combatlog").append("<span class=death> The "+ target.name + " kills you.</span><br>");

				return;
			}
	
			} else {
				//DODGE SUCCESS	
			$("#combatlog").append("<span class=dodgesuccess> You avoid the blow from the "+ target.name + ".</span><br>");
	//		console.log("Dodge SUCCESS");
		}
	} else {
		$("#combatlog").append("<span class=dodgesuccess> The "+ target.name + " missed you.</span><br>");
	//	console.log(target.name + " missed!");
	}
	setTimeout(function(){
		$(':button').prop('disabled',false);	
		$(':image').prop('disabled',false);
	}, 1000);

	updateScroll();
	
}

// INVENTORY BUILDER AND MANAGEMENT 
var potioninventory = ['potion', 'potion'];

var inventory = new Array();

$(document).ready(function what() {
	document.getElementById("inventory").innerHTML = inventory.toString();
});

// POTION DRINKING
function potionuse(){
	var now = playerCharacter.current;
	var max = playerCharacter.total;
	var count = playerCharacter.potions;

// if potion in inventory	
	if (playerCharacter.potions > 0) {
		// healing for 2 points of damage, but only if health now isn't at max
		for(i=0;i<4;i++){
			if (now < max){
				playerCharacter.current += 1;
				now = now += 1;
				$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
			} else {
			}
		}
		playerCharacter.potions -= 1;
	} else {
	}
}
function potion_count(){
	var count = potioninventory.find(function(potion){
	});
}
// LOOT -- NOW BEING USED TO KEEP TRACK OF POINTS
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
	let weaponname = armory[r].name;
	$("#playerweapon").append(weaponname);
	playerCharacter.weaponvalue = r;
	playerCharacter.weaponverb = armory[r].verb;
	document.getElementById("startroom").disabled = false;
	document.getElementById("weaponselection").style.display = "none";
};

function set_weapon(n){


}
// WE GOTTA START THAT ROOM
function roomstart(){
	$(':button').prop('disabled',true);
	$(':image').prop('disabled',true);
	spawn_enemy();

	document.getElementById("startroom").style.display = "none";

	setTimeout(function(){
		$(':button').prop('disabled',false);
		$(':image').prop('disabled',false);
	}, 5000);
}
	

//WE GOTTA END THAT ROOM WHEN WE GOT NO MOAR ENEMIES

function roomend(mid){
	middiv = "#div"+mid;
	$(middiv).html("");
}
//INITIALIZE
function doPlayer(){
	$("#playerscore").html(score);
	var redblocks = playerCharacter.total;
	for(i=0; i<redblocks; i++){
			$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
		}
		stance_draw();
	$("#playerbreather").html("<button type=button onclick=breather()> Find a respite </button>")
}

//ON THE START
$(document).ready(function() {
	doPlayer();
	list_armory();
});

function list_armory(){
	for (var v in armory){
		var weapnum = armory[v].value;
		var weapimg = armory[v].url;
		//console.log(armory[v].name)
		$("#weaponselection").append("<input type=image src="+weapimg+" style='margin:5px' onclick=select_weapon("+weapnum+") value="+weapnum+" >");
	}
}

function stances(choice,stance){
	if (choice === 0) {
		console.log("Stance:default");
	} else if (choice === 1) {
		console.log("stance:defensive");
	} else if (choice === 2) {
		console.log("stance:offensive");
	}
}
	
function breather(){
	var now = playerCharacter.current;
	var max = playerCharacter.total;
	var rest = Math.floor(Math.random() * 3);
	$(':button').prop('disabled',true);	
		// healing for damage, but only if health now isn't at max
	
	if (now < max) {
		$("#combatlog").append("You step away and take a breather.<br>");

		for(i= 0;i < rest; i++){
			if (now < max){
				playerCharacter.current += 1;
				now = now += 1;
				$("#playerhealth").append("<img src='redblock.png' style='margin:1px 1px 1px 1px'>");
				console.log("rest " + rest)
			} else {
				console.log("health full");
			}
		}
		setTimeout(function(){
			attackPlayer(attacker); 
			$(':button').prop('disabled',false);	
		}, 1500)
	} else {
		$("#combatlog").append("You do not need to catch your breath. <br>");
		$(':button').prop('disabled',false);	
	}

	 var attackernumber = Math.floor(Math.random() * 3);	
	 var attacker = monsters_array[attackernumber];
	

}

function spawn_enemy(){
	ns = Math.floor(Math.random() * 5);
	var new_spawn = Object.create(monsters_list[ns]);
	var html = '';
	var thispar = "m" + place;	
	new_spawn.place = place;
	if (ns == 0){
		var a = "An";
	} else {
		var a = "A";
	}
	html += "<p id=monster_"+place+" > <span><input type=image disabled=true src="+new_spawn.healthyimg+" onclick=check("+place+") id=attack_"+place+"></span> </p>" ;
	html += '<p id='+thispar+'>'+ '</p>';
	$("#combatlog").append("<span class=enemyspawn>"+ a + " " + new_spawn.name + " approaches you.</span><br>");
	$("#monstersbox").append('<div class=monsterholder id="div'+ place +'">' + html + "</div>");
	monsters_array.push(new_spawn); 
	monsters_count += 1;
	place += 1;
	check_enemies();
	updateScroll();
}

function check_enemies(){
	if (monsters_count < 3){
		setTimeout(function(){
			spawn_enemy();	
		}, 1500);
	}
}


function stance_draw(){
	for(i=1;i<stances.length;i++){
		var html = '';
		var x = playerCharacter.stance;
		html += "<button onclick=stance_set("+i+") id=stance"+i+">" + stances[i].name + "</button>"
		$("#stanceselect").append(html);
		}
}

function opening_choices(one,two,three){
	
	var dodgeincrease;
	var totalincrease;
	var critincrease;
	var damageincrease;

	switch(one){
		case 0:
			dodgeincrease += .1;
			break;
		case 1:
			totalincrease += 1;
			break;
		case 2:
			critincrease += .1;
			break;
		default:
			break;
	}
	switch(two){
		case 0:
			dodgeincrease += .1;
			break;
		case 1:
			totalincrease += 1;
			break;
		case 2:
			critincrease += .1;
			break;
		default:
			break;
	}
	switch(three){
		case 0:
			damageincrease += 1;
			break;
		case 1:
			dodgeincrease += .1;
			break;
		default:
			break;
		}

	playerCharacter.dodge += dodgeincrease;
	playerCharacter.total += totalincrease;
	playerCharacter.crit += critincrease;
	playerCharacter.damage += damageincrease;	
}

function stance_set(next){
	
	if (playerCharacter.stance === next){
			return;
	}
	
	var old = playerCharacter.stance
	
		// REMOVE OLD STANCE MODIFIERS
		switch (old){
	case 1:
		
		console.log("leaving defensive stance");
		playerCharacter.dodge -= stances[1].dodge;
		playerCharacter.crit -= stances[1].crit;
		break;
	case 2:
		
		console.log("leaving offensive stance");
		playerCharacter.dodge -= stances[2].dodge;
		playerCharacter.crit -= stances[2].crit;
		break;
	case 3: 

		console.log("leaving reckless stance");
		playerCharacter.dodge -= stances[3].dodge;
		playerCharacter.crit -= stances[3].crit;
		break;
	default:	
		console.log("cannot leave old stance");
	}

	//ADD NEW STANCE
	switch (next){
	case 1:
		$("#playerstance").html("Defensive");
		console.log("defensive stance activated");
	//	playerCharacter.dodge += stances[1].dodge;
	//	playerCharacter.crit += stances[1].crit;
		playerCharacter.stance = 1;
		break;
	case 2:
		$("#playerstance").html("Offensive");
		console.log("Offensive stance activated");
//		playerCharacter.dodge += stances[2].dodge;
//		playerCharacter.crit += stances[2].crit;
		playerCharacter.stance = 2;
		break;
	case 3: 
		$("#playerstance").html("Reckless");
		console.log("reckless stance activated");
//		playerCharacter.dodge += stances[3].dodge;
//		playerCharacter.crit += stances[3].crit;
		playerCharacter.stance = 3;
		break;
	default:	
		console.log("no stance chosen");
	}

	$("#playercrit").html(playerCharacter.crit);
	$("#playerdodge").html(playerCharacter.dodge);

}

function updateScroll(){
	var box = document.getElementById("combatlog");
	box.scrollTop = box.scrollHeight;
}