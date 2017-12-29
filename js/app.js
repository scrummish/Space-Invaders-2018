
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

	$(".background").on("click",()=>{
		$("#start").attr("src", "''");
		$("<audio></audio>").attr({
	    	'src':'audio/level1.mp3',
	    	'volume':0.1,
	    	'autoplay':'autoplay'
		}).appendTo("body");
		$(".background").css("background-image", "url("+"'https://static.tumblr.com/a7a24e42e205f391e40d7d439332ce3f/3wg7a5d/f7Woohmiu/tumblr_static_tumblr_static__640.gif'"+")")

		$("h1").css("display","block");
		$(".scoreboard").css("display","block");
		$(".modal").css("display","none");
		game.startGame();
		$(".background").off("click")
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
let bulletY = 118; // y axis for bullet starting point
let enemyPic;
let magazine = []; // Contains fired lasers
let fleetArray = []; // Contains enemy ships

class Player {
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
		var bullet = new Laser(magazine.length);
		magazine.push(bullet);
		bullet.drawFire(bullet);
	}
}

class Laser { // Prototype for laser shots
	constructor(id){
		this.x = playerCoordinateX + 8; // Players x axis and 8 pixels to center the shot
		this.y = bulletY;
		this.picture = new Image(); 
		this.picture.src = "imgs/bullet.png";
		this.id = id;
		this.active = true;
	}
	drawLaser(){
		$ctx.drawImage(this.picture, this.x, this.y, 5, 15);
	}
	drawFire(charge){	
		var stopInt = setInterval(()=>{ // This makes the bullet travel 
			charge.drawLaser();
	  		this.y-=1;
	  		$("#canvas").css("box-shadow", "1px 5px 20px #1ddacf");
	  		
	  		if(this.y == -15){
	  			$("#canvas").css("box-shadow", "1px 5px 20px #1B94FB");
	  			clearInterval(stopInt);
	  			this.active = false;
	  		}
	 	},3);
	}
}

// enemy ship once destroyed should no longer be repawned in the new frame
// gotta keep track of enemy ship to know which one to not respawn 

class EnemyShip{ // Prototype for enemy ships 
	constructor(id){
		this.x = shipRow;
		this.y = 5;
		this.width = 25;
		this.height = 10;
		this.picture = new Image(); 
		this.picture.src = "imgs/ship5.png";
		this.id = id;
		this.alive = true;
	}
	drawShip(i,z){
		$ctx.drawImage(this.picture, this.x + i, this.y + z, this.width, this.height);
		
		if (shipRow < 0){ // This is the perimeter 
			shipSpeed = -shipSpeed; // Makes it bounce off the left side
		}
		if((shipRow + 705) > 800){ // This is the perimeter 
			shipSpeed = -shipSpeed; // Makes it bounce off the right side
		}
	}
}

class Fleet{
	createShipObj(){	
		shipRow += shipSpeed; // Changes the placement of the ships every frame making it look like they are moving
		for (var z = 0; z <= 30; z+=15) {
			for (var i = 0; i <= 180 ; i+=30) {
				let newShip1 = new EnemyShip(fleetArray.length,0);
				fleetArray.push(newShip1); 
				newShip1.drawShip(i,z);
			}
		}
	}
}

// Game Object
let game = {
	createFleet: function(){ // Calling this function creates a new wave of enemies
		let enemyFleet = new Fleet();
		enemyFleet.createShipObj();	
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
