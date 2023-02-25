class Players{
    constructor(){
        this.rank = null
        this.coins = null
        this.index = null
        this.name = null
    }
    addPlayers(name,count){
        console.log(name)
        database.ref("/").update({
            playerCount : count
        })
        this.index = playerCount
      
        database.ref("/player" + this.index).set({
            name: name,
            coins: 0,
            treasureCollected: false,
            won: false
        })
      
    }
    
    updateCoins(coinTotal){
        database.ref("/player" + this.index).update({
            coins : coinTotal
        })
    }
    updateTime(value){
      database.ref("/player" + this.index).update({
        time : value
      })
    }
    checkLive(){
      var otherIndex = 0;
      switch(this.index){
        case 1 : otherIndex = 2
          break;
        case 2 : otherIndex = 1
          break;
      }
      database.ref("/player" + otherIndex + "/time").on("value",function(data){
        console.log(data.val())
        if(opponentTime != data.val()){
          opponentTime = data.val();
        }else if(opponentTime === data.val()){
          setTimeout(function(){
            database.ref("/player" + otherIndex + "/time").on("value", function(data){
              if(opponentTime === data.val()){
                gameOver("disconnect")
                zombieGroup.destroyEach()
                newPlayer.resetPlayerCount()
              }
            })
          },3000)
        }
      })
    }
    createGameCode(){
      if(gameCode.length < 5){
      for(var i = 0; i < 6; i++){
        gameCode = gameCode + Math.round(random(0,9.5))
      }
    }
      return gameCode;
    }
    getCount(){     
        database.ref("/playerCount").on("value",function(data){
            playerCount = data.val()
        })
    }
    resetPlayerCount(){
      database.ref("/").update({
        playerCount: 0,
      })
    }
  updateTreasure(){
    database.ref("/player" + this.index).update({
      treasureCollected : true
    })
  }
  updateOpponent(){
    var otherIndex = 0;
    switch(this.index){
      case 1 : otherIndex = 2
        break;
      case 2 : otherIndex = 1
        break;
    }
    database.ref("/player" + otherIndex + "/name").on("value",function(data){
      opponentNameTxt.html(`${data.val()}'s Stats`)
    })
    database.ref("/player" + otherIndex + "/treasureCollected").on("value",function(data){
      if(data.val() === true){
        otherTreasure.addImage(treasureImg)
        gameOver('treasure')
      }
    })
    database.ref("/player" + otherIndex + "/coins").on('value',function(data){
      switch(data.val()){
        case 0 : 
          otherCoin1.addImage(coinClearImg)
          otherCoin2.addImage(coinClearImg)
          otherCoin3.addImage(coinClearImg)
          break;
        case 1 : 
          otherCoin1.addImage(coinFullImg)
          otherCoin2.addImage(coinClearImg)
          otherCoin3.addImage(coinClearImg)
          break;
        case 2 : 
          otherCoin1.addImage(coinFullImg)
          otherCoin2.addImage(coinFullImg)
          otherCoin3.addImage(coinClearImg)
          break;
        case 3 : 
          otherCoin1.addImage(coinFullImg)
          otherCoin2.addImage(coinFullImg)
          otherCoin3.addImage(coinFullImg)
          break;
      }
    })
  }

}