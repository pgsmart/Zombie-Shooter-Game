var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg, zombieGroup;
var bullet, bulletGroup;
var zombieImg2, shooter_shooting2;
var shooterImg2;
var position;
var boxPositions = [];
var zombiePositions = [];
var coinImg;
var coin;
function preload() {

  shooterImg = loadImage("assets/shooter_2.png")
  shooterImg2 = loadImage("assets/shooter_5.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  shooter_shooting2 = loadImage("assets/shooter_4.png")

  bgImg = loadImage("assets/bg.jpeg")

  zombieImg = loadImage("assets/zombie.png")
  zombieImg2 = loadImage("assets/zombie-2.png")

  coinImg = createImg("assets/coin.gif")
}

function setup() {


  createCanvas(windowWidth, windowHeight);

  zombieGroup = createGroup()
  bulletGroup = createGroup()

  moveCoin()

  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  position = "Right";
  player.scale = height / 3000;
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)

}

function draw() {
  background(0);
  rectMode(CENTER)

  image(bgImg, 0, 0, windowWidth, windowHeight)


  //moving the player up and down and making the game mobile compatible using touches
  if (keyDown("UP_ARROW") || touches.length > 0) {
    player.y = player.y - 30
  }
  if (keyDown("DOWN_ARROW") || touches.length > 0) {
    player.y = player.y + 30
  }

  if (keyDown("LEFT_ARROW")) {
    player.x = player.x - 30;
    player.addImage(shooterImg2)
    position = "Left"
  }

  if (keyDown("RIGHT_ARROW")) {
    player.x = player.x + 30;
    player.addImage(shooterImg)
    position = "Right"
  }

  if (frameCount % 200 === 0) {
    var randomNumber = Math.round(random(1, 2))
    if (randomNumber === 1) {
      zombie = createSprite(0, player.y, 50, 50);
      zombie.addImage(zombieImg2)
      zombie.scale = height / 6000;
      zombie.velocityX = 5;
      zombie.setCollider("rectangle", 0, 0, 500, 1000)
      zombieGroup.add(zombie)
      zombie.debug = true;
    } else if (randomNumber === 2) {
      zombie = createSprite(displayWidth - 100, player.y, 50, 50)
      zombie.addImage(zombieImg)
      zombie.scale = height / 6000;
      zombie.velocityX = -5;
      zombie.setCollider("rectangle", 0, 0, 500, 1000)
      zombieGroup.add(zombie)
      zombie.debug = true;
    }
  }

  //release bullets and change the image of shooter to shooting position when space is pressed
  if (keyWentDown("space")) {
    if (position === "Left") {
      player.addImage(shooter_shooting2)
      bullet = createSprite(player.x - 30, player.y, 20, 20)
      bullet.velocityX = -6;
      bulletGroup.add(bullet);
    } else if (position === "Right") {
      player.addImage(shooter_shooting)
      bullet = createSprite(player.x + 30, player.y, 20, 20)
      bullet.velocityX = 6;
      bulletGroup.add(bullet);
    }
  }

  //player goes back to original standing image once we stop pressing the space bar
  else if (keyWentUp("space")) {
    if (position === "Right") {
      player.addImage(shooterImg)
    } else if (position === "Left") {
      player.addImage(shooterImg2)
    }
  }

  if (bulletGroup.collide(zombieGroup)) {
    bulletGroup.destroyEach()
    zombieGroup.destroyEach()
  }
  createBricks();
  colorBoxes();
  for (var i = 0; i < zombieGroup.length; i++) {
    zombieBoxes(i);
  }
  for (var i = 0; i < zombiePositions.length; i++) {
    var place = zombiePositions[i]
    var rectColor = color(255, 0, 0)
    rectColor.setAlpha(40)
    fill(rectColor)
    rect(place[0] * height / 7 + width / 5, place[1] * height / 7 + height / 4, height / 7, height / 7)
  }
  drawSprites();

  //Progress Bar
  var percent = (boxPositions.length) / 45
  noFill()
  strokeWeight(5)
  rect(width / 2, height / 7, width / 2 + width / 350, height / 30 + width / 350)
  noStroke()
  fill(45, 224, 114)
  rect(width / 4 + (percent * width / 2) / 2, height / 7, percent * width / 2, height / 30, 20)

  textSize(20)
  fill(255, 255, 255)
  text("Collected: " + boxPositions.length + "/45", width / 5, 100)
  text(Math.round(percent * 100) + "%", width / 4 + (percent * width / 2) - width / 44, height / 7 + height / 180)
}
function moveCoin() {
  var x = 1
  var y = 4
  coinImg.position((x * (height/6)), (y * (height/6)))
  console.log((x * (height/6)))
}

function zombieBoxes(value) {
  var positions = []
  var count = 0;

  boxX = (Math.round((zombieGroup.get(value).x) / (height / 6))) - 3
  boxY = Math.round((zombieGroup.get(value).y) / (height / 6)) - 1

  positions.push(boxX)
  positions.push(boxY)

  if (positions[0] > -1 && positions[1] > -1 && positions[0] < 9 && positions[1] < 5) {
    for (var a = 0; a < zombiePositions.length; a++) {
      if (JSON.stringify(positions) === JSON.stringify(zombiePositions[a])) {
        count += 1;
      }
    }

    for (var i = 0; i < boxPositions.length; i++) {
      if (JSON.stringify(positions) === JSON.stringify(boxPositions[i])) {
        boxPositions.splice(i, 1)
      }
    }
    if (count === 0) {
      zombiePositions.push(positions)
    }
  }
  positions = []
}

function colorBoxes() {
  var positions = [];
  var count = 0;
  var boxX = (Math.round((player.x) / (height / 6))) - 2
  var boxY = Math.round(player.y / (height / 6)) - 1

  positions.push(boxX)
  positions.push(boxY)
  console.log(positions[0] + "," + positions[1])

  if (positions[0] > -1 && positions[1] > -1 && positions[0] < 9 && positions[1] < 5) {
    for (var i = 0; i < boxPositions.length; i++) {
      if (JSON.stringify(positions) === JSON.stringify(boxPositions[i])) {
        count += 1;
      }
    }

    if (count === 0) {
      boxPositions.push(positions)
      //console.log(boxPositions)
    }
  }

  for (var i = 0; i < zombiePositions.length; i++) {
    if (JSON.stringify(positions) === JSON.stringify(zombiePositions[i])) {
      zombiePositions.splice(i, 1)
    }
  }

  for (var i = 0; i < boxPositions.length; i++) {
    var place = boxPositions[i]
    var rectColor = color(0, 255, 255)
    rectColor.setAlpha(40)
    fill(rectColor)
    rect(place[0] * height / 7 + width / 5, place[1] * height / 7 + height / 4, height / 7, height / 7)
  }

  count = 0;
}

function createBricks() {
  for (var i = 0; i < 9; i++) {
    for (var a = 0; a < 5; a++) {
      noFill();
      stroke(255, 255, 255)
      rect(i * height / 7 + width / 5, a * height / 7 + height / 4, height / 7, height / 7)
    }
  }
}
