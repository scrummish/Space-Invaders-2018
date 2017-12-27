
/********************************************************************************** 
* Story: 																		  *
* A premature race of beings mysteriously came into possesion of highly advanced  *
* technologies. Now they travel the galaxy looking to conquer and control new 	  *
* worlds. It's up to you to stop them! 											  *
**********************************************************************************/

// Enemy ships should bounce back and forth from wall to wall shooting downwards
// Player can move from left to right using directional pad and shoot using spacebar
// Regular enemy ships have one life so they die on successful hit from player
// Player also has one life and dies on successful hit from enemy ship (Backlog: make it three lifes after 10 rounds)
// Boss ship starts at 1 life and increases by 1 every wave 
// Boss ship firing speed increases every wave
// Boss ship has random reloads that last 5 seconds 
// Objective: Survive the most rounds

// Randomly add a cromulon head in the background

// Waits for the entire DOM to be ready before it initializes the game
$(document).ready(function() {
	game.startGame();
});

// Global Variables
let $ctx = $("#canvas")[0].getContext("2d");
let enemyFleet;
let player;
let shipRow = 50; // Starting point of enemy ships
let shipSpeed = 1; // Enemy ship speed
let framesPerSecond = 60;
let playerCoordinateX = 0;
let bullet;
let bulletY = 118; // y axis for bullet starting point

// Class for the ship
class Ship {
	constructor(ID, health){ 
		this.health = health; 
		this.Id = ID;
		this.alive = true; // Might not need this. Call destroy function when enemy ship is shot
	}
	destroyMe(){
		// Removes ship from the window, but cell remains in order to keep every ship in position
		console.log("destroyed");
	}
	movement(){ // Provide functionality for ships to move back and forth 
		console.log("test movement function");
	}
}

// Class that creates an entire fleet of ships
class Fleet {
	constructor(){
		// this.availableShips = []; // currently not using this with canvas
	}
	drawShip(newRow){
		$ctx.fillStyle = "#1B94FB";
		$ctx.fillRect(shipRow+newRow,5,15,9);
		$ctx.fillStyle = "#1ddacf";
		$ctx.fillRect(shipRow+newRow,17,15,9);
		$ctx.fillStyle = "#AA56FF";
		$ctx.fillRect(shipRow+newRow,29,15,9);
	}
	createShips(){ // a. 
		shipRow += shipSpeed;
		for (var i = 0; i <= 162; i+=18) { // creates 30 enemy ships 18px apart from the previous
			this.drawShip(i); 
		}
		if (shipRow < 0){ // This is the perimeter 
			shipSpeed = -shipSpeed; // Makes it bounce off the left side
		}
		if((shipRow + 680) > 800){ // This is the perimeter 
			shipSpeed = -shipSpeed; // Makes it bounce off the right side
		}
	}
}

class Player {
	drawPlayer(ship){
		$ctx.drawImage(ship, playerCoordinateX,130,20,12);
		bullet = new Image(); 
		bullet.src = "imgs/bullet.png";
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
	shoot(fire){
		$ctx.drawImage(fire, playerCoordinateX + 8,bulletY,5,15);
		// let newBullet = new laserShot();
		// newBullet.drawBullet();
	}
}

// class laserShot {
// 	// constructor(fire){
// 	// 	this.bullet = fire;
// 	// }
// 	makeBullet(){
// 		laser = new Image();
// 		laser.src = "imgs/bullet.png"
// 	}
// 	drawBullet(fire){
// 		$ctx.drawImage(fire, playerCoordinateX + 8,bulletY,5,15);
// 	}
// }

// Game Object
let game = {
	createFleet: function(){ // Calling this function creates a new wave of enemies
		enemyFleet = new Fleet();
		enemyFleet.createShips();
	},
	createPlayer: function(){ // Creates a new player ship
		player = new Player(); 

		var playerShipImage = new Image(); 
		playerShipImage.src = "imgs/player.png";
		player.drawPlayer(playerShipImage);
	},
	startGame: function(){ // Starts the game
		setInterval(()=>{ // Animates the enemy game at 60 frames per second
			this.createCanvas();
		},1000/framesPerSecond) 		
	},
	createCanvas: function(){ 
		$ctx.fillStyle = "black"; // https://www.w3schools.com/tags/canvas_fillstyle.asp
		$ctx.fillRect(0,0,canvas.width,canvas.height); //https://www.w3schools.com/tags/canvas_fillrect.asp
		this.createContext(); // Starts the proces of creating the rest of the game's elements
	},
	createContext: function(){ // Creates the enemy fleet and player ship
		this.createFleet(); // The global variable enemyFleet will be your fleet 
		this.createPlayer(); // The global variable player will be your players ship
	}
}
let keys = {37: false, 39: false, 32: false};

$(document).keydown(function(e) {
	if (e.which in keys) {
		keys[e.which] = true;
		if (keys[37] && keys[32]){
			player.moveleft();
			shootbeam();
		} else if (keys[39] && keys[32]){
			player.moveright();
			shootbeam();
		} else if (keys[39]){
			player.moveright();
		} else if (keys[37]){
			player.moveleft();
		} else if (keys[32]){
			shootbeam();
		}
	}
}).keyup(function(e) {
    if (e.which in keys) {
        keys[e.which] = false;
    }
})

function shootbeam(){
	var stopInt = setInterval(()=>{ // This makes the bullet travel 
		player.shoot(bullet);
  		bulletY-=1;
  		$("#canvas").css("box-shadow", "1px 5px 20px #1ddacf");
  		
  		if(bulletY == -15){
  			$("#canvas").css("box-shadow", "1px 5px 20px #1B94FB");
  			clearInterval(stopInt);
  			bulletY = 118;
  		}
 	},2);				  	
}
