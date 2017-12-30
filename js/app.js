
/********************************************************************************** 
* Story: 																		  *
* A premature race of beings mysteriously came into possesion of highly advanced  *
* technologies. Now they travel the galaxy looking to conquer and control new 	  *
* worlds. It's up to you to stop them! 											  *
**********************************************************************************/


// Player can move from left to right using directional pad and fire using spacebar
// Regular enemy ships have one life so they die on successful hit from player

// Objective: Survive the most rounds without letting a set amount of enemies pass you.

// Randomly add a cromulon head in the background

// Waits for the entire DOM to be ready before it initializes the game
$(document).ready(function() {
	game.playAudio(); 
	$background.on("click",()=>{
		game.level1(); // Changes variables to current levels values
		game.startGame(); // Starts the game at its current level
		$background.off("click"); // Removes the click listener on the element with the background class
	});	
});

// Global Variables
let $background = $(".background");
let $song = $("#start");
let $ctx = $("#canvas")[0].getContext("2d");
let player;
let framesPerSecond = 60;
let playerCoordinateX = 150;
let bulletY = 118; // y axis for bullet starting point
let keys = {37: false, 39: false, 32: false}; // The keys for the keyboard inputs
let scoreCounter = 0; // Keeps track of the amount of enemyFleetArray you shot down
let enemiesPassed = 10; // Amount of enemies allowed to pass is 1 less than enemies passed or game over
let damageTaken = 10; // Amount of damage allowed to take is 1 less than damageTaken or else game is over
let enemyFleetArray = []; // Array containing spawned enemy ships
let firedLaserArray = []; // Contains fired lasers

let game = {
	startGame: function(){ // Starts the game
		setInterval(()=>{ // Animates the game at 60 frames per second
			$ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas before drawing a new frame
			this.createContext(); // After canvas is cleared from the previous frame, it draws the next updated frame
		},1000/framesPerSecond); 		
	},
	createContext: function(){ // Draws everything onto the canvas and checks if anything collided
  		$("#score").text(scoreCounter); // Updates players score
		this.createEnemy(); // Creates enemy fleets
		this.createPlayer(); // Creates players ship
		game.handleCollisions(); // Checks if anything worth checking has collided
	},
	createPlayer: function(){ // Creates a new player ship
		player = new Player(); // Instantiates a player object from the Player class
		var playerShipImage = new Image(); // Creates an img object to hold the ships picture
		playerShipImage.src = "imgs/player.png"; // Object recieves desired image
		player.drawPlayer(playerShipImage); // Draws the chosen image to the canvas
	},
	createEnemy: function(){
		var enemy = new Enemy(); // Instantiates an enemy object from the Enemy class
  		enemyFleetArray.forEach(function(enemy) { // Iterates through the array containing all the created enemy ships and runs a method on each one
    		enemy.update(); // Updates each enemy ship to its new position for the current frame
  		});
  		enemyFleetArray = enemyFleetArray.filter(function(enemy) { // Filters the array containing all the created enemy ships
    		return enemy.active; // Retains any enemy ships where the active property equals true
  		});
  		if(Math.random() < 0.01) { // This equation determines if the created ship will go into play
   			enemyFleetArray.push(enemy); // If equation is true, the created enemy ship is put into play
  		};
  		enemyFleetArray.forEach(function(enemy) { // Calls the draw method on each ship in play
    		enemy.draw();
  		});
	},
	collides: function(a, b) { // Algorithm for checking if two squared objects collide
	  	return a.x < b.x + b.width && // Returns true if all those conditions are met
	           a.x + a.width > b.x &&
	           a.y < b.y + b.height &&
	           a.y + a.height > b.y;
	},
	handleCollisions: function() {
		firedLaserArray.forEach(function(bullet) { // Iterates through the fired lasers one by one
	    	enemyFleetArray.forEach(function(enemy) { // Iterates through all the active enemy ships and checks them against the current laser 
		      	if (game.collides(bullet, enemy)) { // Checks if any enemy ship has collided with the current laser 
			        enemy.die();
			        scoreCounter++;
		      	};
	    	});
	  	});
	  	enemyFleetArray.forEach(function(enemy) { // Iterates through each enemy ship
	    	if (game.collides(enemy, player)) {
	     		enemy.die(); // If the enemy ship being checked has collided with the player it calls this method on that ship
		 		damageTaken--;  
	    	};
	  	});
	  	enemyFleetArray.forEach(function(enemy) { // Iterates through each enemy ship
	    	if (game.collides(enemy, game.enemyVictoryPoint)) { // Checks if enemy ship being checked has collided with the coordinates that determine it has gone passed the player
	      		enemy.die();
	      		enemiesPassed++;
	    	};
	  	});
	},
	playAudio: function(){
		$song.attr({
	    	'src':'audio/start.mp3',
	    	'autoplay':'autoplay',
	    	'id': 'start'
		});
	},
	level1: function(){
		$song.attr({
	    	'src':'audio/level1.mp3'
		});
		$("h1").css("display","block");
		$(".scoreboard").css("display","block");
		$(".modal").css("display","none");
	},
	enemyVictoryPoint: { // If an enemy ship collides with the enemyVictoryPoint object, it means they went passed the player and successfully invaded the planet your protecting
		x: 0,
		y: 147,
		width: 300,
		height: 2,
	}
}

class Player {
	constructor(){
		this.active = true;
		this.x = playerCoordinateX;
		this.y = 130;
		this.width = 20;
		this.height = 12;
	}
	drawPlayer(ship){
		$ctx.drawImage(ship, playerCoordinateX,130,20,12);
	}
	moveright(){
		if(playerCoordinateX <= 273){
			playerCoordinateX += 13;
		} 	
	}
	moveleft(){
		if(playerCoordinateX >= 4 ){
			playerCoordinateX -= 13;
		}
	}
	shoot(){
		var bullet = new Laser(firedLaserArray.length);
		firedLaserArray.push(bullet);
		bullet.laserFx();
		bullet.drawFire(bullet);
	}
}

class Enemy { 
	constructor(){
		this.picture = new Image(); 
  		this.picture.src = "imgs/ship5.png";
		this.active = true;
	 	this.x = Math.floor(Math.random() * 270); // Spawns ships at random locations on x coordinate
	 	this.y = 0;
	 	this.width = 30;
  		this.height = 20;
		this.xVelocity = 0;
		this.yVelocity = 1;
	}
	inBounds() { // returns true if enemy ship is within the height and width of the canvas
    	return this.x >= 0 && this.x <= 800 &&
      	this.y >= 0 && this.y <= 600;
  	}
	draw() {
    	$ctx.drawImage(this.picture, this.x, this.y , this.width, this.height);
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

class Laser { // Prototype for laser shots
	constructor(id){
		this.x = playerCoordinateX + 8; // Players x axis and 8 pixels to center the shot
		this.y = bulletY;
		this.picture = new Image(); 
		this.picture.src = "imgs/bulletpurple.png";
		this.id = id;
		this.active = true;
		this.width = 5;
		this.height = 15;
	}
	drawLaser(){
		$ctx.drawImage(this.picture, this.x, this.y, 5, 15);
	}
	drawFire(charge){	
		var stopInt = setInterval(()=>{ // This makes the bullet travel 
			charge.drawLaser(); // Redraws the laser shot with its updated y coordinate
	  		this.y-=1;
	  		$("#canvas").css("box-shadow", "1px 5px 20px #AA56FF"); // changes the canvas borders color to match the color of the laser to emphasize the power of the laser shot
	  		if(this.y == -15){
	  			$("#canvas").css("box-shadow", "1px 5px 20px #1B94FB"); // Returns the canvas broders original color once the laser shot is out of the view
	  			clearInterval(stopInt); // stops the laser from traveling
	  			// Backlog: Make it so the player can only shoot a certain amount of lasers
	  		}
	 	},3); // Change the speed the laser travels here
	}
	laserFx(){ // Adds a sound effect when player shoots a laser
		let $laserSound = $("<audio></audio>").attr({
	    	'src':'audio/laser.mp3',
	    	'autoplay':'autoplay',
		});
		$laserSound[0].volume = 0.1;
		$laserSound.appendTo("body");
	}
}


$(document).keydown(function(e) {
	if (e.which in keys) {
		keys[e.which] = true;
		if (keys[37] && keys[32]){
			player.moveleft();
			player.shoot();
		} else if (keys[39] && keys[32]){
			player.moveright();
			player.shoot();
		} else if (keys[39]){
			player.moveright();
		} else if (keys[37]){
			player.moveleft();
		} else if (keys[32]){
			player.shoot();
		}
	}
}).keyup(function(e) {
    if (e.which in keys) {
        keys[e.which] = false;
    }
})
