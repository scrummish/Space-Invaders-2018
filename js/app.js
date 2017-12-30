
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
	$("<audio></audio>").attr({
    	'src':'audio/start.mp3',
    	'autoplay':'autoplay',
    	'id': 'start'
	}).appendTo("body");

	$(".background").on("click",()=>{
		$("#start").attr("src", "''");
		$("<audio></audio>").attr({
	    	'src':'audio/level1.mp3',
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
let keys = {37: false, 39: false, 32: false}; // The keys for the keyboard inputs
let scoreCounter = 0; // Keeps track of the amount of enemies you shot down
let enemiesPast = 0; // Keeps track of the enemies who have gone past the player
let enemies = []; // Array containing spawned enemy ships
let magazine = []; // Contains fired lasers

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
		var bullet = new Laser(magazine.length);
		magazine.push(bullet);
		bullet.laserFx();
		bullet.drawFire(bullet);
	}
}

class Enemy { 
	constructor(){
		this.picture = new Image(); 
  		this.picture.src = "imgs/ship5.png";
		this.active = true;
	 	this.age = Math.floor(Math.random() * 128);
	 	this.x = Math.floor(Math.random() * 270); // Spawns ships at random locations on x coordinate
	 	this.y = 0;
	 	this.width = 30;
  		this.height = 20;
		this.xVelocity = 0;
		this.yVelocity = 1;
	}
	inBounds() {
    	return this.x >= 0 && this.x <= 800 &&
      	this.y >= 0 && this.y <= 600;
  	}
	draw() {
    	$ctx.drawImage(this.picture, this.x, this.y , this.width, this.height);
  	}
	explode() {
    	this.active = false;
  	}	
	update() {
    	this.x += this.xVelocity;
    	this.y += this.yVelocity;
    	this.xVelocity = 1 * Math.sin(this.age * Math.PI / 64); // Makes them wobble around 
    	this.age++;
    	this.active = this.active && this.inBounds();
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
		this.width = 5;
		this.height = 15;
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
	laserFx(){
		let $music = $("<audio></audio>").attr({
	    	'src':'audio/laser.mp3',
	    	'autoplay':'autoplay',
		})
		$music[0].volume = 0.1;
		$music.appendTo("body");
	}
}

let game = {
	createPlayer: function(){ // Creates a new player ship
		player = new Player(); 

		var playerShipImage = new Image(); 
		playerShipImage.src = "imgs/player.png";
		player.drawPlayer(playerShipImage);
	},
	startGame: function(){ // Starts the game
		setInterval(()=>{ // Animates the game at 60 frames per second
			update();
			draw();
			this.createContext();
		},1000/framesPerSecond) 		
	},
	createContext: function(){ // Creates the enemy fleet and player ship
		this.createPlayer(); // The global variable player will be your players ship
	},
	collides: function(a, b) { // Algorithm for checking if two squared objects collide
	  	return a.x < b.x + b.width &&
	         a.x + a.width > b.x &&
	         a.y < b.y + b.height &&
	         a.y + a.height > b.y;
	},
	handleCollisions: function() {
	  magazine.forEach(function(bullet) {
	    enemies.forEach(function(enemy) {
	      if (game.collides(bullet, enemy)) {
	        enemy.explode();
	        scoreCounter++;
	      }
	    })
	  });

	  enemies.forEach(function(enemy) {
	    if (game.collides(enemy, player)) {
	      enemy.explode();
	      player.explode();
	    }
	  });
	}
}

function update() {
	var enemy = new Enemy();
  	enemies.forEach(function(enemy) {
    	enemy.update();
  	})
  	enemies = enemies.filter(function(enemy) {
    	return enemy.active;
  	})
  	if(Math.random() < 0.01) { // Frequency of ships spawning
   		enemies.push(enemy);
  	}
  	game.handleCollisions();
  	$("#place-holder").text(scoreCounter);
}

function draw() {
	$ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the entire canvas before drawing a new frame
  	enemies.forEach(function(enemy) {
    enemy.draw();
  })
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
