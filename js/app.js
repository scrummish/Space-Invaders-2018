
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

// Waits for the entire DOM to be ready before it initializes the game
$(document).ready(function() {
	game.startGame();
});

// let $panImage = $("<img>").attr("src", "imgs/800x600.png").attr("id","space-img");
// $("body").append($panImage); // used to play around with adding a background image


// Global Variables
let ctx;
let enemyFleet;
let player;
let shipRow = 50; // Starting point of enemy ships
let shipSpeed = 1; // Enemy ship speed
let framesPerSecond = 60;
let playerCoordinateX = 138;

// Class for the ship
class Ship {
	constructor(ID, health){ 
		this.health = health; 
		this.Id = ID;
		this.alive = true; // Might not need this. Call destroy function when enemy ship is shot
	}
	shoot(){ // add firepower property that shoots 2 rounds per second
		console.log("shoot");
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
		ctx.fillStyle = "#1B94FB";
		ctx.fillRect(shipRow+newRow,5,15,9);
		ctx.fillStyle = "#1ddacf";
		ctx.fillRect(shipRow+newRow,17,15,9);
		ctx.fillStyle = "#AA56FF";
		ctx.fillRect(shipRow+newRow,29,15,9);
	}
	createShips(){ // a. creates 24 enemy ships and b. stores them in order to manipulate them as neccessary (kill etc)
		
		// for (var i = 0; i < 12; i++) { // NOTE! Start with one when you test it
			// let enemySpawn = new Ship(this.availableShips.length, 1); // a.
			// this.availableShips.push(enemySpawn); // b.
			// let $currentCell = $("<div>").addClass("cell"); // Creates a cell for the ship
			// $("#ship-container").append($currentCell); // Appends the new cell
			// let $ship = $("<img>").attr("src", "imgs/ship.png").attr("id", enemySpawn.Id); // Adds the ship image
			// $currentCell.append($ship); // Appends the ship image to the cell
		// }

		shipRow+=shipSpeed;
		for (var i = 0; i <= 162; i+=18) {
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
	drawPlayer(){
		ctx.fillStyle = "yellow";
		ctx.fillRect(playerCoordinateX,130,20,12);
	}
	moveright(){
		console.log(playerCoordinateX + " right test");
		if(playerCoordinateX <= 268){
			playerCoordinateX += 10;
		}	
	}
	moveleft(){
		console.log(playerCoordinateX + " left test");
		if(playerCoordinateX >= 8 ){
			playerCoordinateX -= 10;
		}
	}
}

// Game Object
let game = {
	createFleet: function(){ // Calling this function creates a new wave of enemies
		enemyFleet = new Fleet();
		enemyFleet.createShips();
	},
	createPlayer: function(){ // Creates a new player ship
		player = new Player(); 
		player.drawPlayer();
	},
	startGame: function(){ // Starts the game
		setInterval(()=>{ // Animates the enemy ships at 60 frames per second
			this.createCanvas();
		},1000/framesPerSecond) 
		
	},
	createCanvas: function(){ 
		ctx = canvas.getContext("2d"); // Global variable to draw the game with
		ctx.fillStyle = "black"; // https://www.w3schools.com/tags/canvas_fillstyle.asp
		ctx.fillRect(0,0,canvas.width,canvas.height); //https://www.w3schools.com/tags/canvas_fillrect.asp
		this.createContext(); // Starts the proces of creating the rest of the game's elements
	},
	createContext: function(){ // Creates the enemy fleet and player ship
		this.createFleet(); // The global variable enemyFleet will be your fleet 
		this.createPlayer(); // The global variable player will be your players ship
	}
}

$("body").on("keydown",function(e) {
  if(e.keyCode == 37) { // left
    player.moveleft();
  }
  else if(e.keyCode == 39) { // right
    player.moveright();
  }
});