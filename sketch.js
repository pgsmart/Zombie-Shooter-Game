var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg, zombieGroup;
var bullet, bulletGroup;
var zombieImg2, shooter_shooting2;
var shooterImg2;
var position;
var boxPositions = [];
function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooterImg2 = loadImage("assets/shooter_5.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  shooter_shooting2 = loadImage("assets/shooter_4.png")

  bgImg = loadImage("assets/bg.jpeg")

  zombieImg = loadImage("assets/zombie.png")
  zombieImg2 = loadImage("assets/zombie-2.png")
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
 // bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
//bg.addImage(bgImg)
//bg.scale = 1.1
 
  
  zombieGroup = createGroup()
  bulletGroup = createGroup()

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
 position = "Right";
   player.scale = 0.25;
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

    var randomNumber = Math.round(random(1,2))
    if(randomNumber === 1){
      zombie = createSprite(0,player.y, 50, 50);
      zombie.addImage(zombieImg2)
      zombie.scale = 0.15;
      zombie.velocityX = 5;
      zombie.setCollider("rectangle",0,0,500,1000)
      zombieGroup.add(zombie)
      zombie.debug = true;
    }else if(randomNumber === 2){
      zombie = createSprite(displayWidth - 100,player.y,50,50)
      zombie.addImage(zombieImg)
      zombie.scale = 0.15;
      zombie.velocityX = -5;
      zombie.setCollider("rectangle",0,0,500,1000)
      zombieGroup.add(zombie)
      zombie.debug = true;
    }
}

function draw() {
  background(0); 

  image(bgImg,0,0,windowWidth,windowHeight)


  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

if(keyDown("LEFT_ARROW")){
  player.x = player.x - 30;
  player.addImage(shooterImg2)
  position = "Left"
}

if(keyDown("RIGHT_ARROW")){
  player.x = player.x + 30;
  player.addImage(shooterImg)
  position = "Right"
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  if(position === "Left"){
    player.addImage(shooter_shooting2)
    bullet = createSprite(player.x - 30,player.y, 20,20)
    bullet.velocityX = -6;
    bulletGroup.add(bullet);
  }else if(position === "Right"){
    player.addImage(shooter_shooting)
    bullet = createSprite(player.x + 30,player.y, 20,20)
    bullet.velocityX = 6;
    bulletGroup.add(bullet);
  }
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  if(position === "Right"){
  player.addImage(shooterImg)
  }else if(position === "Left"){
    player.addImage(shooterImg2)
  }
}

if(bulletGroup.collide(zombieGroup)){
  bulletGroup.destroyEach()
  zombieGroup.destroyEach()
}
createBricks();
colorBoxes();
drawSprites();


}

function colorBoxes(){
  var positions = [];
  var count = 0;
  var boxX = (Math.round((player.x) / (height/6))) - 2
  var boxY = Math.round(player.y / (height/6))

  positions.push(boxX)
  positions.push(boxY)

  for(var i = 0; i < boxPositions.length; i++){
    if(JSON.stringify(positions) === JSON.stringify(boxPositions[i])){
      count += 1;
    }
  }

  if(count === 0){
    boxPositions.push(positions)
    //console.log(boxPositions)
  }
  
  for(var i = 0; i < boxPositions.length; i++){
  var place = boxPositions[i]
  var rectColor = color(0,255,255)
  rectColor.setAlpha(40)
  fill(rectColor)
  rect(place[0] * height/6 + width / 7.5, place[1] * height/6, height/6, height/6)
  }
  count = 0;
}

function createBricks(){
  for(var i = 0; i < 9; i++){
    for(var a = 0; a < 6; a++){
      noFill();
      stroke(255,255,255)
      rect(i * height/6 + width / 7.5, a * height/6, height/6,height/6)
    }
  }
}
