
/********************************************************************************** 
* Story: 																		  *
* A premature race of beings mysteriously came into possesion of highly advanced  *
* technologies. Now they travel the galaxy looking to conquer and control new 	  *
* worlds. It's up to you to stop them! 											  *
**********************************************************************************/


// Player can move from left to right using directional pad and fire using spacebar
// Regular enemy ships have one life so they die on successful hit from player

// Objective: Survive the most rounds without letting a set amount of enemies pass you.

// Incomplete: Refresh to restart notice

// Backlog: Add effect when ship collides with player
// Backlog: Randomly add a cromulon head in the background "show me what you got"
// Backlog: remove laser streaks after winning

// Waits for the entire DOM to be ready before it initializes the game
$(document).ready(function() {
	$music[0].play(); 
	$background.on("click",()=>{
		$music.attr("src","audio/level1.mp3"); 
		$music[0].load(); 
		$music[0].play();
		game.level1(); // Preps game for first level
		game.startGame(); // Starts the game at its current level
		$background.off("click"); // Removes the click listener on the element with the background class
	});
	$ctx.clearRect(0, 0, canvas.width, canvas.height);	
});

// Global Variables
let $background = $(".background");
let $ctx = $("#canvas")[0].getContext("2d");
let $music = $("<audio>").attr({"src":"audio/start.mp3", "preload":"auto"});
let player; // Represents the players ship instance
let framesPerSecond = 60; // Timing at which animations will run
let playerCoordinateX = 150; // x axis for player
let bulletY = 118; // y axis for bullet starting point
let scoreCounter = 0; // Keeps track of the amount of enemies you shot down
let enemiesPassed = 5; // Amount of enemies allowed to pass before game over
let lifePoints = 9; // Amount of damage allowed to take before game over
let keyboardKeys = {}; // Object to hold the event listener keys pressed
let enemyFleetArray = []; // Array containing spawned enemy ships
let firedLaserArray = []; // Contains fired lasers
let firedBossLaserArray = []; // Contains lasers fired by boss ship
let dificulty = .5; // Used to adjust the speed at which the enemies fly
let stopGame; // Used to stop the game after winning or losing
let clearMe; // Used to clear canvas after winning or losing
let lvl1Boss; // Represents the 1st boss instance
let bossLife = 5000; // Life points for the level 1 boss
let bossX = 80; // X axis for boss ship
let shipSpeed = 1; // Boss ship speed

// Objects:
let game = {
	startGame: function(){ // Starts the game
		stopGame = setInterval(()=>{ // Animates the game at 60 frames per second
			$ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas before drawing a new frame
			this.createContext(); // After canvas is cleared from the previous frame, it draws the next updated frame
			game.gameOver(); // Checks to see if game is over
			if (clearMe === true){ // If game is over this executes
				$ctx.clearRect(0, 0, canvas.width, canvas.height);
				$(document).off("keydown");
			}
		},1000/framesPerSecond);	
	},
	createContext: function(){ // Draws everything onto the canvas and checks if anything collided
  		$("#score").text(scoreCounter); // Updates players score
  		$("#life-points").text(lifePoints); // Updates players life points
  		$("#enemy-points").text(enemiesPassed); // Updates amount of enemies that have passed the player
		this.createEnemy(); // Creates enemy fleets
		this.createPlayer(); // Creates players ship
		game.handleCollisions(); // Checks if anything worth checking has collided
	},
	createPlayer: function(){ // Creates a new player ship
		player = new Player(playerCoordinateX,130,20,12,"imgs/player.png"); // Instantiates a player object from the Player class
		player.draw(); // Draws the instantiated ship
	},
	createEnemy: function(){
		var enemy = new Enemy(Math.floor(Math.random() * 270),0,40,8,"imgs/small-enemy.png"); // Instantiates an enemy object from the Enemy class at a random x coordinate
  		enemyFleetArray.forEach(function(enemy) { // Iterates through the array containing all the created enemy ships and runs a method on each one
    		enemy.update(); // Updates each enemy ship to its new position for the current frame
  		});
  		enemyFleetArray = enemyFleetArray.filter(function(enemy) { // Filters the array containing all the created enemy ships
    		return enemy.active; // Retains any enemy ships where the active property equals true
  		});
  		if(Math.random() < 0.015) { // This equation determines if the created ship will go into play
   			enemyFleetArray.push(enemy); // If equation is true, the created enemy ship is put into play
  		};
  		enemyFleetArray.forEach(function(enemy) { // Calls the draw method on each ship in play
    		enemy.draw();
  		});
  		game.level1Boss.activate(); // Check to see if the boss should be activated
	},
	activateBoss: function(){
			lvl1Boss = new Boss(bossX,0,150,35,"imgs/somers-boss.png");
			lvl1Boss.update();
			lvl1Boss.draw();
			game.handleBossCollisions();    	
	},
	collides: function(a, b) { // Algorithm for checking if two squared objects collide
	  	return a.x < b.x + b.width && // Returns true if all those conditions are met
	           a.x + a.width > b.x &&
	           a.y < b.y + b.height &&
	           a.y + a.height > b.y;
	},
	handleBossCollisions: function(){
		firedLaserArray.forEach(function(currentShot) { // Iterates through lasers and check to see if they hit the boss
	    	if (game.collides(lvl1Boss, currentShot)) {
	     		bossLife--;
	    	};
	  	});
	  	firedBossLaserArray.forEach(function(laser){
			if (game.collides(laser,player)){
				firedBossLaserArray.splice(0,2);
				lifePoints--;
			};
		});
	},
	handleCollisions: function() {
		firedLaserArray.forEach(function(bullet) { // Iterates through the fired lasers one by one
	    	enemyFleetArray.forEach(function(enemy) { // Iterates through all the active enemy ships and checks them against the current laser 
		      	if (game.collides(bullet, enemy)) { // Checks if any enemy ship has collided with the current laser 
			        enemy.die();
			        scoreCounter++;
			        if(scoreCounter === 150){
			        	$music.attr("src","audio/boss.mp3"); 
						$music[0].load(); 
						$music[0].play();
			        }
			        if (scoreCounter >= 150){
			        	dificulty = 2;
			        	$background.css(
  							"animation", "20s scroll infinite linear reverse"
			        	);
			        } else if (scoreCounter >= 100){
			        	dificulty = 2.2;
			        	$background.css(
  							"animation", "5s scroll infinite linear reverse"
			        	);
			        } else if (scoreCounter >= 75){
			        	dificulty = 2;
			        	$background.css(
  							"animation", "10s scroll infinite linear reverse"
			        	);
			        } else if (scoreCounter >= 50){
			        	dificulty = 1.5;
			        	$background.css(
  							"animation", "15s scroll infinite linear reverse"
			        	);
			        } else if (scoreCounter >= 25){
			        	dificulty = 1;
			        	$background.css(
  							"animation", "20s scroll infinite linear reverse"
			        	);
			        }
		      	};
	    	});
	  	});
	  	enemyFleetArray.forEach(function(enemy) { // Iterates through each enemy ship
	    	if (game.collides(enemy, player)) {
	     		enemy.die(); // If the enemy ship being checked has collided with the player it calls this method on that ship
		 		lifePoints--;  
	    	};
	  	});
	  	enemyFleetArray.forEach(function(enemy) { // Iterates through each enemy ship
	    	if (game.collides(enemy, game.enemyVictoryPoint)) { // Checks if enemy ship being checked has collided with the coordinates that determine it has gone passed the player
	      		enemy.die();
	      		enemiesPassed--;
	    	};
	  	});
	},
	gameOver: function(){
		if(enemiesPassed <= -1 || lifePoints <= -1){
			clearInterval(stopGame);
			$("#game-over").css("display","block");
			clearMe = true; // Used to clear the canvas from any ships	
		}	
	},
	winner: function(){
		clearInterval(stopGame);
		$("#winner").css("display","block");
		clearMe = true; // Used to clear the canvas from any ships		
	},
	level1: function(){
		$("h1").css("display","block");
		$(".scoreboard").css("display","block");
		$(".life").css("display","block");
		$(".enemy-invasion").css("display","block");
		$(".modal").css("display","none");
	},
	playerMovement: function(){
		for (var direction in keyboardKeys){
			if (direction == 39){
				player.moveright();
			} 
			if (direction == 37){
				player.moveleft();
			} 
		}
	},
	playerShooting: function(){
		for (var direction in keyboardKeys){
			if (direction == 32){
				player.shoot();
			}
		}
	},
	enemyVictoryPoint: { // If an enemy ship collides with the enemyVictoryPoint object, it means they went passed the player and successfully invaded the planet your protecting
		x: 0,
		y: 147,
		width: 300,
		height: 2,
	},
	level1Boss: {
		activate: function(){
			if(scoreCounter >= 150 && bossLife >= 0){ // If Boss is alive(boss being alive is important, we dont want boss fire with no boss on screen) and 150 minion ships have been destroyed
  				game.activateBoss();
  				lvl1Boss.shoot();
  			}
  			if (bossLife <= 0 && bossLife >= -30){ // If Boss is defeated
  				game.winner();
  			}
		}
	}
}	  		

// Classes: 
class Ship {
	constructor(x,y,width,height,image){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.picture = new Image();
		this.picture.src = image;
	}
	draw(){
		$ctx.drawImage(this.picture, this.x, this.y , this.width, this.height);
	}
}

class Enemy extends Ship{ 
	constructor(x,y,width,height,image){
		super(x,y,width,height,image);
		this.xVelocity = 0;
		this.yVelocity = dificulty;
		this.active = true;
	}
	inBounds() { // returns true if enemy ship is within the height and width of the canvas
    	return this.x >= 0 && this.x <= 800 &&
      	this.y >= 0 && this.y <= 600;
  	}
	die() {
    	this.active = false;
  	}	
	update() {
    	this.x += this.xVelocity; // Updates the current enemys ships new x position in the new frame
    	this.y += this.yVelocity; // Updates the current enemys ships new y position in the new frame
    	this.active = this.active && this.inBounds(); // Active property is only true if both remains inbound and another action hasnt changed the active property to false
  	}
}

class Player extends Ship{
	constructor(x,y,width,height,image){
		super(x,y,width,height,image);
	}
	moveright(){
		if(playerCoordinateX <= 273){ 
			playerCoordinateX += 2; // If condition is met, player moves on the x axis 
		} 	
	}
	moveleft(){
		if(playerCoordinateX >= 4 ){
			playerCoordinateX -= 2; // If condition is met, player moves on the x axis 
		}
	}
	shoot(){
		if (clearMe !== true){ // This is to make sure the player cant continue to shoot after game ends
			var bullet = new Laser(playerCoordinateX + 8, bulletY,"imgs/bulletpurple.png",5,15); // Creates an instance of a laser
			firedLaserArray.push(bullet); // Pushes laser into an array
			bullet.laserFx(); // Adds a shooting sound effect
			bullet.drawFire(bullet); // Creates the laser
		}
	}
}

class Boss extends Ship{
	constructor(x,y,width,height,image){
		super(x,y,width,height,image);
	}
	shoot(){
		if (clearMe !== true){ // This is to make sure the boss cant continue to shoot after game ends
	  		let randomLaser = Math.floor(Math.random() * 100) + 1; 
	  		if(randomLaser == 5){ // Makes it so the boss doesnt shoot a countinous stream of lasers
	  			var bullet = new BossLaser(bossX + 22,20,"imgs/boss-shot.png",15,30); // Creates an instance of a laser
				firedBossLaserArray.push(bullet); // Pushes laser into an array
				bullet.drawFire(bullet); // Creates the laser

				var bullet1 = new BossLaser(bossX + 113,"imgs/boss-shot.png",15,30); // Creates an instance of a laser
				firedBossLaserArray.push(bullet1); // Pushes laser into an array
				bullet1.drawFire(bullet1); // Creates the laser
	  		};
  		}
	}
	update(){
		bossX+=shipSpeed;
		this.draw();
		if (bossX < 0){ // This is the perimeter 
		 	shipSpeed = -shipSpeed; // Makes it bounce off the left side
		}
		if((bossX + 645) > 800){ // This is the perimeter 
		 	shipSpeed = -shipSpeed; // Makes it bounce off the right side
		}this.draw();
	}
}

class Laser { 
	constructor(x,y,image,width,height){
		this.x = x; 
		this.y = y;
		this.picture = new Image(); 
		this.picture.src = image;
		this.width = width;
		this.height = height;
	}
	drawLaser(){
		$ctx.drawImage(this.picture, this.x, this.y, this.width, this.height);
	}
	drawFire(charge){	
		var stopInt = setInterval(()=>{ // This makes the bullet travel 
			charge.drawLaser(); // Redraws the laser shot with its updated y coordinate
	  		this.y-=1;
	  		$("#canvas").css("box-shadow", "1px 5px 20px #AA56FF"); // changes the canvas borders color to match the color of the laser to emphasize the power of the laser shot
	  		if(this.y == -15){
	  			$("#canvas").css("box-shadow", "1px 5px 20px #1B94FB"); // Returns the canvas broders original color once the laser shot is out of the view
	  			firedLaserArray.splice(0,1); // Removes the laser from the array
	  			clearInterval(stopInt); // stops the laser from traveling
	  		}
	 	},1); // Change the speed the laser travels here
	}
	laserFx(){ // Adds a sound effect when shooting a laser
		let $laserSound = $("<audio></audio>").attr({
	    	'src':'audio/laser.mp3',
	    	'autoplay':'autoplay',
		});
		$laserSound[0].volume = 0.1;
		$laserSound.appendTo("body");
	}
}

class BossLaser extends Laser{ // Prototype for laser shots, extend it from the players laser when u have time
	constructor(x,y,image,width,height){
		super(x,y,image,width,height)
	}
	drawFire(charge){	
		var stopInt = setInterval(()=>{ // This makes the bullet travel 
			charge.drawLaser(); // Redraws the laser shot with its updated y coordinate
	  		this.y+=1;
	  		// $("#canvas").css("box-shadow", "1px 5px 20px #00b8ff"); // changes the canvas borders color to match the color of the laser to emphasize the power of the laser shot
	  		if(this.y == -400){
	  			// $("#canvas").css("box-shadow", "1px 5px 20px #1B94FB"); // Returns the canvas broders original color once the laser shot is out of the view
	  			firedLaserArray.splice(0,1); // Removes the laser from the array
	  			clearInterval(stopInt); // stops the laser from traveling
	  		}
	 	},3); // Change the speed the laser travels here
	}
}

setInterval(game.playerMovement,7);
setInterval(game.playerShooting,100);

$(document).keydown(function(e){
	keyboardKeys[e.keyCode] = true; // Takes the code of the key used to trigger the keydown listener and adds it as a property of the keys array
})
$(document).keyup(function(e) {
    delete keyboardKeys[e.keyCode]; // On keyup it deletes that key which was pressed from the array
});

$ctx.clearRect(0, 0, canvas.width, canvas.height);
