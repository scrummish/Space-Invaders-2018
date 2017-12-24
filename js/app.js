
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

// Global Variables
let $canvas;
let canvasContext;
let enemyFleet;
let player;
let testing = 0;

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
		this.availableShips = [];
	}
	createShips(){ // a. creates 24 enemy ships and b. stores them in order to manipulate them as neccessary (kill etc)
		let x = 0;
		for (var i = 0; i < 11; i++) { // NOTE! Start with one when you test it
			let enemySpawn = new Ship(this.availableShips.length, 1); // a.
			this.availableShips.push(enemySpawn); // b.

			canvasContext.fillStyle = "#1B94FB";
			canvasContext.fillRect(x+testing,5,15,9);
			canvasContext.fillStyle = "#1ddacf";
			canvasContext.fillRect(x+testing,17,15,9);
			canvasContext.fillStyle = "#AA56FF";
			canvasContext.fillRect(x+testing,29,15,9);
			x+=18;


			// let $currentCell = $("<div>").addClass("cell"); // Creates a cell for the ship
			// $("#ship-container").append($currentCell); // Appends the new cell
			// let $ship = $("<img>").attr("src", "imgs/ship.png").attr("id", enemySpawn.Id); // Adds the ship image
			// $currentCell.append($ship); // Appends the ship image to the cell
		}
		console.log(testing);
		testing+=1
		console.log(testing);
	}
}

// Class inheritance for the players ship 
class Player { 
	constructor(){ // fix this use super and extend the class!!!
		// super(health);
		this.Id = "player-ship";
		this.health = 1;
	}
	movement(){ // Provide functionality for player to move back and forth using directionals
		
		console.log("test player movement function");
	}
	shoot(){ // holding spacebar shoots 5 bullets per second
		console.log("shoot");
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
		canvasContext.fillStyle = "yellow";
		canvasContext.fillRect(0,134,20,12);
		// let $player = $("<img>").attr("src", "imgs/player.png").attr("id", player.Id); // Adds the ship image & ID
		// $("#screen").append($player); // Appends the players ship image to the 
	},
	startGame: function(){ // Starts the game
		setInterval(()=>{ // Animates the enemy ships at 5 frames per second
			this.createCanvas();
			console.log("testing");
		},1000/60)
		
	},
	createCanvas: function(){ 
		$canvas = $("#canvas"); // The global variable representing the gameboard where you will draw your game onto
		canvasContext = canvas.getContext("2d"); // Global variable to draw the game with
		
		// Draws the background of the game
		canvasContext.fillStyle = "black"; // https://www.w3schools.com/tags/canvas_fillstyle.asp
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		canvasContext.fillRect(0,0,canvas.width,canvas.height); //https://www.w3schools.com/tags/canvas_fillrect.asp
		
		this.createContext(); // Starts the proces of creating the rest of the game's elements
	},
	createContext: function(){ // Creates the enemy fleet and player ship
		// this.createFleet(); // The global variable enemyFleet will be your fleet 
		this.createPlayer(); // The global variable player will be your players ship
	}
}
// $("body").on("keydown",function(e) {
//   if(e.keyCode == 37) { // left
//     $("#player-ship").stop().animate({
//       left: "-=150"
//     }, 100);
//   }
//   else if(e.keyCode == 39) { // right
//     $("#player-ship").stop().animate({
//       left: "+=150"
//     }, 100);
//   }
// });