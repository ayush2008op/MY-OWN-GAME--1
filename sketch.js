/*This game is made by Ayush Dinda.
This game is base on p5.js
This is a rocket game.*/

//define variables
var spaceship, spaceship_img, spaceship2_img;
var bubble, bubble_img;
var gamestate;
var health;
var spawnEdge;
var bubbles;
var shot;
var shot_Img;
var shots;
var shotData;
var score;

function preload(){
  //load all the images
  spaceship_img = loadImage("./assets/Spaceship.png");
  spaceship2_img = loadImage("./assets/Spaceship2.png");
  bubble_img = loadImage("./assets/Bubble.png");
  shot_Img = loadImage("./assets/bullet.png")
  bg_img = loadImage("./assets/space.gif")
}

function setup() {
  //create canvas
  var canvas = createCanvas(800,600);
  
  //first game state
  gamestate = "waiting";
  health = 10;
  bubbles = new Group();
  shots = new Group();
  score = 0;
  //delay of the shots
  shotData = [false, 0];
  
  //create sprites
  spaceship = createSprite(400,200,10,10);
  spaceship.addAnimation("spaceship", spaceship_img, spaceship2_img);
  spaceship.pause();
  spaceship.scale = 0.2;
  spaceship.setCollider("rectangle", 0, 0, 80, 70);
  
  shot = createSprite(1000,1000,50,50);
  shots.add(shot);
}

function draw() {
  //set background
  background(150);
  image(bg_img,0,0)
  //draw sprites
  drawSprites();
  
  //things that happen during gameplay
  if(gamestate === "playing"){
    //movement
    movement();
    
    //generate obstacles
    generateObstacles();
    
    //spaceship collision with objects
    collision();
    
    //shooting
    shooting();
    
    //cheching the death
    deathCheck();
  }
  
  //display text
  displayText();
    
  //switch gamestates
  switchGamestates();
}

function movement(){
  //move the spaceship
  if(keyDown("up")){
     spaceship.addSpeed(0.2, spaceship.rotation - 90);
     spaceship.setFrame(1);
    
  }else if(keyDown("down")){
    spaceship.addSpeed(0.15, spaceship.rotation + 90);
    spaceship.setFrame(0);
  }else{
    spaceship.setFrame(0);
  }
  
  //rotate the spaceship
  if(keyDown("left")){
     spaceship.rotation-=7.5;
  }else if(keyDown("right")){
      spaceship.rotation+=7.5;
  }
  
  //reduce the speed of the spaceship automatically
  spaceship.setSpeed(spaceship.getSpeed() * 0.985)
  
  //if the SpaceShip goes out of the screen it teleports to other side
  if(spaceship.y > 650){
     spaceship.y = -30;
  }else if(spaceship.y < -650){
      spaceship.y = 630;
  }
  
  if(spaceship.x > 750){
     spaceship.x = -30;
  }else if(spaceship.x < -550){
      spaceship.x = 530;
  }
}

function reset(){
  gamestate = "waiting";
  health = 10;
  score = 0;
  shotData = [false, 0];
  spaceship.x = 200;
  spaceship.y = 200;
  spaceship.rotation = 0;
  spaceship.setSpeed(0,spaceship.rotation);
}

function displayText(){
  //spaceship health (color depends on health)
  if(health >= 10){
    fill(3, 252, 57);
  }else if(health >= 5){
    fill(235, 252, 3);
  }else if(health >= 2){
    fill(252, 111, 3);
  }else{
    fill(255, 0, 0);
  }
    
  textSize(20);
  
  //health
  if(gamestate === "playing"){
    if(health === 10){
      text(health, spaceship.x - 17, spaceship.y + 40);
    }else{
      text(health, spaceship.x - 10.5, spaceship.y + 40);
    }
    
    fill("white");
    text("Score: " + score, 5, 20);
  }
  
  //display how to play
  if(gamestate === "waiting"){
     fill("white");
     textSize(15);
     text("           How To Play:\nUse the Arrow Keys To Move\n         Dodge the debris\n         Shoot with space\n            Hit P To Start", 308, 250);
  }
  //gamestate over
  if(gamestate === "over"){
    fill("black");
    textSize(30);
     text("Game Over!", 120, 200);
    textSize(20);
    text(" Final Score: " + score + "\nHit R to restart", 130, 230);
  }
}

function switchGamestates(){
  //start the game
  if(keyDown("P") && gamestate === "waiting"){
    gamestate = "playing"
  }
  if(keyDown("R") && gamestate === "over"){
     reset();
  }
}

function generateObstacles(){
  //every set amount of frames generate a new chunk of space junk
  if(frameCount % 20 === 0){
     spawnEdge = Math.round(random(1,4));
     //1 = top, 2 = right, 3 = bottom, 4 = left
     if(spawnEdge === 1){
      bubble = createSprite(random(1,600),0,10,10);
      bubble.addImage("bubble", bubble_img);
      bubble.velocityX = random(-5,5);
      bubble.velocityY = random(2,7);
      bubble.scale = 0.1;
      bubble.lifetime = 450/bubble.velocityY;
      bubble.setCollider("circle", 0, 0, 105);
      bubbles.add(bubble);
      bubbles.debug = true
    }else if(spawnEdge === 2){
      bubble = createSprite(400,random(1,600),10,10);
      bubble.addImage("bubble", bubble_img);
      bubble.velocityX = random(-2,-7);
      bubble.velocityY = random(-5,5);
      bubble.scale = 0.1;
      bubble.lifetime = 450/bubble.velocityX;
      bubble.setCollider("circle", 0, 0, 105);
      bubbles.add(bubble);
      bubbles.debug = true
    }else if(spawnEdge === 3){
      bubble = createSprite(random(1,600),400,10,10);
      bubble.addImage("bubble", bubble_img);
      bubble.velocityX = random(-5,5);
      bubble.velocityY = random(-2,-7);
      bubble.scale = 0.1;
      bubble.lifetime = 450/bubble.velocityY;
      bubble.setCollider("circle", 0, 0, 105);
      bubbles.add(bubble);
      bubbles.debug = true
    }else{
      bubble = createSprite(400,random(1,600),10,10);
      bubble.addImage("bubble", bubble_img);
      bubble.velocityX = random(2,7);
      bubble.velocityY = random(-5,5);
      bubble.scale = 0.1;
      bubble.lifetime = 450/bubble.velocityX;
      bubble.setCollider("circle", 0, 0, 105);
      bubbles.add(bubble);
      bubbles.debug = true
    }
  }
}

function collision(){
  
  if(bubbles.isTouching(spaceship)){
        health-=2;
      }
  
  //have bullets destroy bubbles
  for(var x = 0; x < shots.length; x++){
    for(var y = 0; y < bubbles.length; y++){
      console.log(shots.length);
      if(shots.get(x).collide(bubbles.get(y))){
         bubbles.get(y).destroy();
         shots.get(x).destroy();
         score+=100;
      }
    }
  }
}
//shooting of missiles
function shooting(){
  if(keyDown("space") && shotData[0] === false){
    shot = createSprite(spaceship.x, spaceship.y, 5, 12);
    shot.addImage("shot",shot_Img)
    shot.scale = 0.05
    shot.rotation = spaceship.rotation;
    shot.addSpeed(6, spaceship.rotation - 90);
    shot.depth = 0;
    shot.lifetime = 450/6;
    shots.add(shot);
    
    shotData[0] = true;
  }
  if(shotData[0] === true && shotData[1] < 10){
    shotData[1]++;
  }else{
    shotData[1] = 0;
    shotData[0] = false;
  }
}

//function deathcheck
function deathCheck(){
  if(health <= 0){
    health = 0;
    gamestate = "over";
  }
}

function gameWin(){
  if(score === 1500){
    shots.invisible = true;
    spaceship.invisible = true;
    bubble.invisible = true;
    text("You Win",200,200)
  }
}



