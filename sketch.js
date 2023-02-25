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
var health = 3;
var healthImg1;
var healthImg2;
var healthImg3;
var healthSprite;
var coinsCollected = 0;
var treasure, treasureImg;
var percent = boxPositions.length/45
var state = "WAIT"
var input, playButton;
var newPlayer;
var database;
var sound;
var soundButton;
var mute = false;
var coin1,coin2,coin3;
var coinClearImg;
var coinFullImg;
var treasureOpenImg;
var bulletRightImg, bulletLeftImg;
var treasure1, treasureClearImg;
var playerCount;
var waitText;
var loading;
var otherCoin1, otherCoin2, otherCoin3;
var otherCoinsCollected;
var opponentNameTxt;
var otherTreasure;
var enterNameText;
var mainFont;
var confettiImg;
var confetti;
var time = 0;
var opponentTime = 0;
var titleFont;
var codeInput;
var gameCodeText;
var createCodeButton;
var gameCode = "";
function preload() {

  titleFont = loadFont("assets/deceptibots-font/Deceptibots-4O6B.otf")

  shooterImg = loadImage("assets/shooter_2.png")
  shooterImg2 = loadImage("assets/shooter_5.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  shooter_shooting2 = loadImage("assets/shooter_4.png")

  bgImg = loadImage("assets/bg.jpeg")

  zombieImg = loadImage("assets/zombie.png")
  zombieImg2 = loadImage("assets/zombie-2.png")

  bulletRightImg = loadImage("assets/bulletRight.png")
  bulletLeftImg = loadImage("assets/bulletLeft.png")

  coinImg = loadAnimation("assets/coin/sprite_0.png","assets/coin/sprite_1.png","assets/coin/sprite_2.png","assets/coin/sprite_3.png","assets/coin/sprite_4.png","assets/coin/sprite_5.png")

  healthImg1 = loadImage("assets/heart_1.png")
  healthImg2 = loadImage("assets/heart_2.png")
  healthImg3 = loadImage("assets/heart_3.png")

  treasureImg = loadImage("assets/treasure.png")
  treasureOpenImg = loadImage("assets/treasureOpen.png")

  sound = loadSound("assets/a-robust-crew.mp3")

  coinClearImg = loadImage("assets/coinTransparent.png")
  coinFullImg = loadImage("assets/coin/sprite_1.png")
  treasureClearImg = loadImage("assets/treasureClear.png")

  confettiImg = loadImage("assets/confetti.gif")

}

function setup() {
  database = firebase.database();

  createCanvas(windowWidth, windowHeight);

  newPlayer = new Players()
  newPlayer.getCount()
  console.log(newPlayer.index)

  zombieGroup = createGroup()
  bulletGroup = createGroup()

  //creating the player sprite
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  position = "Right";
  player.scale = height / 3000;
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)

  opponentNameTxt = createElement('h1')
  opponentNameTxt.position(width* 0.87,height * 0.30)
  opponentNameTxt.style('color','#ffffff')
  opponentNameTxt.hide()

  healthSprite = createSprite(width/2,height/12,40,40)
  healthSprite.addImage(healthImg3)
  healthSprite.scale = 0.3

  coin = createSprite(width/2,height/2,20,20)
  coin.addAnimation("coin",coinImg)
  coin.scale = 0.6
  coin.setCollider("rectangle",0,0,100,100)

  coin1 = createSprite(width/4,height/15)
  coin1.addImage(coinClearImg)
  coin1.scale = 0.5
  coin2 = createSprite(width/4 + 75,height/15)
  coin2.addImage(coinClearImg)
  coin2.scale = 0.5
  coin3 = createSprite(width/4 + 150,height/15)
  coin3.addImage(coinClearImg)
  coin3.scale = 0.5
  treasure1 = createSprite(width/4 + 250,height/15)
  treasure1.addImage(treasureClearImg)
  treasure1.scale = 0.15

  otherCoin1 = createSprite(width * 0.85,height * 0.50)
  otherCoin1.addImage(coinClearImg)
  otherCoin1.scale = 0.5
  otherCoin2 = createSprite(width * 0.90,height * 0.50)
  otherCoin2.addImage(coinClearImg)
  otherCoin2.scale = 0.5
  otherCoin3 = createSprite(width * 0.95,height * 0.50)
  otherCoin3.addImage(coinClearImg)
  otherCoin3.scale = 0.5
  otherCoin1.visible = false;
  otherCoin2.visible = false;
  otherCoin3.visible = false;
  otherTreasure = createSprite(width * 0.90,height*0.67)
  otherTreasure.addImage(treasureClearImg)
  otherTreasure.scale = 0.20
  otherTreasure.visible = false;

  treasure = createSprite(Math.round(random(0,8))* height/7 + width/5,Math.round(random(0,4)) * height/7 + height/4,50,50)
  treasure.addImage(treasureImg)
  treasure.scale = 0.2
  treasure.visible = false;
  treasure.setCollider("rectangle",0,0,500,500)

  moveCoin()

  
  input = createInput()
  input.position(width * 0.50 - input.width,height * 0.40)
  input.size(width/7,height/18)
  input.attribute('placeholder', 'Enter Your Name...');

  //codeInput = createInput()
  //codeInput.position(input.x,height * 0.50)
  //codeInput.size(width/7,height/18)
  //codeInput.attribute('placeholder', 'Enter Game Code...');

  enterNameText = createElement('h1')
  enterNameText.html("Enter Your Name")
  enterNameText.position(input.x - 12, input.y - height * 0.10)
  enterNameText.style('color',"white")
  
  //gameCodeText = createElement('h1')
  //gameCodeText.html("Enter Game Code")
  //gameCodeText.position(input.x - 12,height * 0.40)
  //gameCodeText.style('color',"white")

  //createCodeButton = createButton("New Game")
  //createCodeButton.mousePressed(createNewGame)
  //createCodeButton.position(input.x,input.y + height * 0.30)
  //createCodeButton.size(width/7,height/15)

  playButton = createButton("Play")
  playButton.mousePressed(playSound)
  playButton.position(input.x,height * 0.50)
  playButton.size(width/7,height/15)

  waitText = createElement('h1')
  waitText.hide()
  waitText.style('color','#f2f2f0')
  waitText.position(width * 0.48 - height/8,height * 0.30)

  soundButton = createElement("button","Mute/Unmute")
  soundButton.id('soundControl')
  document.getElementById('soundControl').innerHTML = '<img src="assets/volumeOn.png" />';
  soundButton.position(7 * width/8,height/12)
  soundButton.size(140,140)
  soundButton.style('background-color','#0d0d0d')
  soundButton.style('border','none')
  soundButton.mousePressed(soundChange)
  soundButton.visible = false;
  
  loading = createElement('img')
  loading.style('content','url(assets/loading.gif)')
  loading.position(width * 0.49 - height/8,height * 0.45)
  loading.size(height/4,height/4)
  loading.hide()

  confetti = createElement('img')
  confetti.style("content","url(assets/confetti.gif)")
  confetti.position(0,0)
  confetti.size(width,height)
  confetti.hide()
}

function draw() {
  background(0);
  rectMode(CENTER)

  image(bgImg, 0, 0, windowWidth, windowHeight)

  if(playerCount === 2 && state === "WAIT"){
    state = "PLAY"
    startGame();
  }

  if(sound.isPlaying() === true){
    document.getElementById('soundControl').innerHTML = '<img src="assets/volumeOff.png" />'
  }else{
    document.getElementById('soundControl').innerHTML = '<img src="assets/volumeOn.png" />'
  }

  if(state === "PLAY"){

  time += 1;
  newPlayer.updateTime(time)

  //newPlayer.checkLive()

  //moving the player up and down and making the game mobile compatible using touches
  if (keyDown("UP_ARROW") && player.y > height / 4 && state === "PLAY") {
    player.y = player.y - 20
  }
  if (keyDown("DOWN_ARROW") && player.y < height * 8/10 && state === "PLAY") {
    player.y = player.y + 20
  }

  if (keyDown("LEFT_ARROW") && player.x > width / 5 && state === "PLAY") {
    player.x = player.x - 20;
    player.addImage(shooterImg2)
    position = "Left"
  }

  if (keyDown("RIGHT_ARROW") && player.x < 8/10 * width && state === "PLAY") {
    player.x = player.x + 20;
    player.addImage(shooterImg)
    position = "Right"
  }

  if(player.collide(zombieGroup)){
    health -= 1;
    zombieGroup.destroyEach()
    player.velocityX = 0;
  }

  if(player.collide(coin)){
    if(coinsCollected < 2){
      moveCoin();
    }else{
      coin.destroy()
    }
    coinsCollected += 1;
    newPlayer.updateCoins(coinsCollected)
  }

  if(coinsCollected === 3 && percent > 0.70){
    treasure.visible = true;
  }else{
    treasure.visible = false;
  }

  if(player.collide(treasure) && treasure.visible === true){
    state = "WON"
    newPlayer.updateTreasure()
    treasure.addImage(treasureOpenImg)
    treasure.scale = 0.5
    treasure1.addImage(treasureImg)
    setTimeout(gameWon,3000)
    confetti.show()
    zombieGroup.destroyEach()
  }

  switch(health){
    case 2 : healthSprite.addImage(healthImg2)
    break;
    case 1 : healthSprite.addImage(healthImg1)
    break;
    case 0 : 
    healthSprite.visible = false;
    gameOver('heart')
    break;
  }

  if (frameCount % 200 === 0 && state === "PLAY") {
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
      bullet = createSprite(player.x - 30, player.y - 20, 20, 20)
      bullet.addImage(bulletLeftImg)
      bullet.scale = 0.1
      bullet.velocityX = -6;
      bulletGroup.add(bullet);
    } else if (position === "Right") {
      player.addImage(shooter_shooting)
      bullet = createSprite(player.x + 30, player.y - 20, 20, 20)
      bullet.addImage(bulletRightImg)
      bullet.scale = 0.1
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

  //Set coin tracker on top
  switch(coinsCollected){
    case 1 : 
    coin1.addImage(coinFullImg)
    coin2.addImage(coinClearImg)
    coin3.addImage(coinClearImg)
    break;
    case 2 : 
    coin1.addImage(coinFullImg)
    coin2.addImage(coinFullImg)
    coin3.addImage(coinClearImg)
    break;
    case 3 : 
    coin1.addImage(coinFullImg)
    coin2.addImage(coinFullImg)
    coin3.addImage(coinFullImg)
    break;
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
  percent = boxPositions.length/45;
  noFill()
  strokeWeight(5)
  rect(width / 2, height / 7, width / 2 + width / 350, height / 30 + width / 350)
  noStroke()
  fill(45, 224, 114)
  rect(width / 4 + (percent * width / 2) / 2, height / 7, percent * width / 2, height / 30, 20)

  textSize(20)
  fill(255, 255, 255)
  text(Math.round(percent * 100) + "%", width / 4 + (percent * width / 2) - width / 44, height / 7 + height / 180)
}

  if(state === "WAIT"){
  var backBoxColor = color(52, 155, 235)
  backBoxColor.setAlpha(150)
  fill(backBoxColor)
  rect(input.x + height * 0.145,height * 0.50, width * 0.25, height * 0.65)
  }
}

function startGame(){
  waitText.hide()
  loading.hide()
  newPlayer.updateOpponent()
  otherCoin1.visible = true;
  otherCoin2.visible = true;
  otherCoin3.visible = true;
  soundButton.visible = true;
  otherTreasure.visible = true;
  opponentNameTxt.show()
  bgImg = loadImage("assets/background.jpg")
}

function gameWon(){
  swal(
    {
      title : "You Won!",
      imageUrl : "/assets/treasure.png",
      imageSize : "150x150",
      text : "Congrats! You collected the treasure!",
      confirmButtonText: "Play Again!"
    },
    function(isConfirm){
      if(isConfirm === true){
        location.reload()
      }
    }
  )
  setTimeout(function(){
    newPlayer.resetPlayerCount()
  },3000)
}

function playSound(){
 // database.ref("/gameCodes").on("value",function(data){
    //var codes = data.val()
    //var enteredCode = codeInput.value()
    //if(codes.includes(enteredCode.toString())){
      //console.log("YES")
    //}else{
      //console.log("NO")
   //  })
  playerCount += 1;
  newPlayer.addPlayers(input.value(),playerCount)
  sound.play()
  input.hide()
  playButton.hide()
  enterNameText.hide()
  waitText.html(`<center>Welcome ${input.value()}! <br><br> Waiting for another <br>player to join.<center>`)
  waitText.show()
  loading.show() 
}

function soundChange(){
console.log(sound.isPlaying())
if(sound.isPlaying() === true){
  sound.pause()
}else{
  sound.play()
}
}

function createNewGame(){
  newPlayer.createGameCode()
  codeInput.attribute("value",gameCode);
}

function extraPlayer(){
  swal(
    {
      title : "Uh-Oh!",
      imageUrl : "/assets/gameOverHeart.png",
      imageSize : "150x150",
      text : "There are already 2 players playing. Try another time.",
      confirmButtonText: "Check Again!"
    },
    function(isConfirm){
      if(isConfirm === true){
        location.reload()
      }
    }
  )
}

function gameOver(how){
  var txt,img;
  switch(how){
    case 'heart': 
    txt = "You ran out of hearts. Better luck next time!",
    img = "assets/gameOverHeart.png"
      break;
    case 'treasure': 
    txt = "The other player won first. Better luck next time!",
    img = "assets/gameOver.png"
      break;
    case 'disconnect': 
    txt="The other player has disconnected. Please refresh the page to play again.",
    img="assets/wifi.png"
  }
  swal(
    {
      title : "Game Over!",
      imageUrl : img,
      imageSize : "150x150",
      text : txt,
      confirmButtonText: "Play Again!"
    },
    function(isConfirm){
      if(isConfirm === true){
        location.reload()
      }
    }
  )
}


function moveCoin() {
  var x = Math.round(random(0,8)) 
  var y = Math.round(random(0,4))
  coin.x = x * height/7 + width/5
  coin.y = y * height/7 + height/4
}

function zombieBoxes(value) {
  var positions = []
  var count = 0;

  boxX = (Math.round((zombieGroup.get(value).x + 24) / (height / 6))) - 3
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
  var boxX = (Math.round((player.x + 24) / (height / 6))) - 2
  var boxY = Math.round(player.y / (height / 6)) - 1

  positions.push(boxX)
  positions.push(boxY)

  if (positions[0] > -1 && positions[1] > -1 && positions[0] < 9 && positions[1] < 5) {
    for (var i = 0; i < boxPositions.length; i++) {
      if (JSON.stringify(positions) === JSON.stringify(boxPositions[i])) {
        count += 1;
      }
    }

    if (count === 0) {
      boxPositions.push(positions)
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
