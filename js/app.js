
/********************************************************************************** 
* Story: 																		  *
* A premature race of beings mysteriously came into possesion of highly advanced  *
* technologies. Now they travel the galaxy looking to conquer and control new 	  *
* worlds. It's up to you to stop them! 											  *
**********************************************************************************/

// Enemy ships should bounce back and forth from wall to wall drawFireing downwards
// Player can move from left to right using directional pad and drawFire using spacebar
// Regular enemy ships have one life so they die on successful hit from player
// Player also has one life and dies on successful hit from enemy ship (Backlog: make it three lifes after 10 rounds)
// Boss ship starts at 1 life and increases by 1 every wave 
// Boss ship firing speed increases every wave
// Boss ship has random reloads that last 5 seconds 
// Objective: Survive the most rounds

// Randomly add a cromulon head in the background

// Waits for the entire DOM to be ready before it initializes the game
$(document).ready(function() {
	$("<audio></audio>").attr({
    	'src':'audio/start.mp3',
    	'volume':0.1,
    	'autoplay':'autoplay',
    	'id': 'start'
	}).appendTo("body");

	$(document).on("click",()=>{
		$("#start").attr("src", "''");
		$("<audio></audio>").attr({
	    	'src':'audio/level1.mp3',
	    	'volume':0.1,
	    	'autoplay':'autoplay'
		}).appendTo("body");

		$("h1").css("display","block");
		$(".scoreboard").css("display","block");
		$(".modal").css("display","none");
		game.startGame();
		$(document).off("click")
	})	
});

// Global Variables
let $ctx = $("#canvas")[0].getContext("2d");
let enemyFleet;
let player;
let shipRow = 50; // Starting point of enemy ships
let shipSpeed = 1; // Enemy ship speed
let framesPerSecond = 60;
let playerCoordinateX = 150;
let bullet;
let bulletY = 118; // y axis for bullet starting point
let enemyPic;

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
	drawShip(newRow,shipsImage){
		
		$ctx.drawImage(shipsImage,shipRow+newRow,5,17,11);
		
		$ctx.drawImage(shipsImage,shipRow+newRow,17,17,11);
		
		$ctx.drawImage(shipsImage,shipRow+newRow,29,17,11);
	}
	createShips(){ // a. 
		shipRow += shipSpeed;
		for (var i = 0; i <= 162; i+=18) { // creates 30 enemy ships 18px apart from the previous
			enemyPic = new Image(); 
			enemyPic.src = "imgs/ship.png";
			this.drawShip(i,enemyPic); 
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
	drawFire(fire){
		$ctx.drawImage(fire, playerCoordinateX + 8,bulletY,5,15);
	}
	fire(){
		var stopInt = setInterval(()=>{ // This makes the bullet travel 
			player.drawFire(bullet);
	  		bulletY-=1;
	  		$("#canvas").css("box-shadow", "1px 5px 20px #1ddacf");
	  		
	  		if(bulletY == -15){
	  			$("#canvas").css("box-shadow", "1px 5px 20px #1B94FB");
	  			clearInterval(stopInt);
	  			bulletY = 118;
	  		}
	 	},2);
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

		var playerShipImage = new Image(); 
		playerShipImage.src = "imgs/player.png";
		player.drawPlayer(playerShipImage);
	},
	startGame: function(){ // Starts the game
		setInterval(()=>{ // Animates the game at 60 frames per second
			$ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas before drawing a new frame
			this.createCanvas();
		},1000/framesPerSecond) 		
	},
	createCanvas: function(){ 
		$ctx.fillStyle = "transparent"; // https://www.w3schools.com/tags/canvas_fillstyle.asp
		$ctx.fillRect(0,0,canvas.width,canvas.height); //https://www.w3schools.com/tags/canvas_fillrect.asp
		this.createContext(); // Starts the proces of creating the rest of the game's elements
	},
	createContext: function(){ // Creates the enemy fleet and player ship
		this.createFleet(); // The global variable enemyFleet will be your fleet 
		this.createPlayer(); // The global variable player will be your players ship
	}
}

let keys = {37: false, 39: false, 32: false}; // The keys for the keyboard inputs

$(document).keydown(function(e) {
	if (e.which in keys) {
		keys[e.which] = true;
		if (keys[37] && keys[32]){
			player.moveleft();
			player.fire();
		} else if (keys[39] && keys[32]){
			player.moveright();
			player.fire();
		} else if (keys[39]){
			player.moveright();
		} else if (keys[37]){
			player.moveleft();
		} else if (keys[32]){
			player.fire();
		}
	}
}).keyup(function(e) {
    if (e.which in keys) {
        keys[e.which] = false;
    }
})
