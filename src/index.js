import "./lib/canvas.js";
import world from "./state/ecs";
import * as ROT from "rot-js";
import {render} from "./systems/render"
import {makeMap,FetchFreeTile} from "./state/dungeon"
import * as components from "./state/component"
import { times } from "lodash";
import { Tile } from "./state/prefab.js";

import * as Abilities from "./systems/abilities"


export var gameState = "setup"
var CurrrentActivePlayerIndex = 0
export var CurrrentActivePlayer
let userInput = null;

const playerEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit, components.IsPlayerControlled]
});

const allyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy]
})

const enemyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy]
})

const update = () => {
    if(gameState == "setup"){
      gameState = "EnemyTurn"
    }else if(gameState == "EnemyTurn") {
      //fire end turn for all enemy units
      EndTurnProcess(enemyEntities.get())

      gameState = "PlayerTurnDefend"
      //set to playerturndefend
      //check win/lose  

      
    }else if(gameState == "PlayerTurnDefend") {
      processUserInput()
      //set to playerturnattack
      //check win/lose
    }else if(gameState == "PlayerTurnAttack") {
      processUserInput()
      //set to enemy turn
      //check win/lose

      //fire endTurn for all player units
      
    }

    render()
    
}






const processUserInput = () => {
  if(gameState == "PlayerTurnDefend" || gameState == "PlayerTurnAttack"){
    if (userInput === "n") {
      //change active player to next
      console.log('input: ' + userInput)
      CurrrentActivePlayer = GetNextActivePlayer()
    }else if(userInput === "1" || userInput === "2" || userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6" || userInput === "7" || userInput === "8" || userInput === "9" || userInput === "0") {
      console.log("dice swap")
      //select die
      console.log(CurrrentActivePlayer.die[userInput-1])
      if(!CurrrentActivePlayer.die[userInput-1].exhausted){
        CurrrentActivePlayer.die[userInput-1].selected = !CurrrentActivePlayer.die[userInput-1].selected
      }
    }else if(userInput=="Enter"){
      console.log("Enter")
      if(gameState == "PlayerTurnDefend"){
        gameState = "PlayerTurnAttack"
      }else if (gameState == "PlayerTurnAttack"){
        EndTurnProcess(allyEntities.get())
        gameState = "EnemyTurn"
      }
    }else if (userInput === 'p') {
      //used for testing
      console.log(CurrrentActivePlayer)
      //CurrrentActivePlayer.abilityList.abilities[0].function.onUse()
      console.log(CurrrentActivePlayer.abilityList.abilities[0])
      let abil = CurrrentActivePlayer.abilityList.abilities[0].properties.function
      abil.onUse(abil, CurrrentActivePlayer)
    }


    userInput = null
  }
}

const GetNextActivePlayer = () => {
  if(CurrrentActivePlayerIndex + 1 >= playerEntities.get().length){
    CurrrentActivePlayerIndex = 0
  }else {
    CurrrentActivePlayerIndex++
  }
  //console.log(playerEntities.get()[CurrrentActivePlayerIndex])
  return playerEntities.get()[CurrrentActivePlayerIndex]
}

document.addEventListener("keydown", (ev) => {
  userInput = ev.key;
});

export const setupTestFight = () => {
    const newPlayer = world.createPrefab("PlayerBeing", {
      appearance: {char: "@", color: "green"}
    });
    var emptyTile = FetchFreeTile();
    newPlayer.add(components.Position, {x:emptyTile.position.x,y:emptyTile.position.y})
    CurrrentActivePlayer = newPlayer

    const newPlayer2 = world.createPrefab("PlayerBeing", {
      appearance: {char: "@", color: "purple"}
    });
    emptyTile = FetchFreeTile();
    newPlayer2.add(components.Position, {x:emptyTile.position.x,y:emptyTile.position.y})

    times(5, () => {
      emptyTile = FetchFreeTile();
      world.createPrefab("Goblin").add(components.Position, {x: emptyTile.position.x, y: emptyTile.position.y})
    });
}

const EnemyTurn = () => {
  //loop through all enemies and do their turn


  //process playerAttack
}

const PlayerTurnDefend = () => {
  //wait for player input and process, but only allow defensive abilities

  //proccess enemyAttack
}

const PlayerTurnAttack = () => {
  //wait for player input and process, but only allow offensive abilities 
}


const EndTurnProcess = (entities) => {
  console.log('ending turn for ')
  entities.forEach( (entity) => {
    console.log(entity)
    entity.fireEvent('turn-end', entity);
  });

}

console.log('test')
makeMap()
setupTestFight()
FetchFreeTile()
render()



const gameLoop = () => {
    update();

    requestAnimationFrame(gameLoop);
  };
  
requestAnimationFrame(gameLoop);
  