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
export var previousGameState = ""

var queuedAbility = "hi"
var queuedEntity = "hi"
export const SetQueuedAbility = (abil) => {
  queuedAbility = abil
}
export const SetQueuedEntity = (ent) => {
  queuedEntity = ent
}

export var targetEntity = world.createEntity("targetEntity")
targetEntity.add(components.Appearance, {char: 'X', color: "black", background: "green"})

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
      render()
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
      
    }else if(gameState=="examine" || gameState =="targeting"){
      processUserInput()
      //render entities under current reticle

      
    }
    
}


const processUserInput = () => {
  if(gameState == "PlayerTurnDefend" || gameState == "PlayerTurnAttack"){
//select next player
    if (userInput === "n") {
      //change active player to next
      console.log('input: ' + userInput)
      CurrrentActivePlayer = GetNextActivePlayer()

      render()

//die select
    }else if(userInput === "1" || userInput === "2" || userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6" || userInput === "7" || userInput === "8" || userInput === "9" || userInput === "0") {
      console.log("dice swap")
      //select die
      console.log(CurrrentActivePlayer.die[userInput-1])
      if(!CurrrentActivePlayer.die[userInput-1].exhausted){
        CurrrentActivePlayer.die[userInput-1].selected = !CurrrentActivePlayer.die[userInput-1].selected
      }
      render()

//movement
    }else if (userInput === "ArrowUp") {
      PlayerAttemptMove()
    }else if (userInput === "ArrowRight") {
      PlayerAttemptMove()
    }else if (userInput === "ArrowDown") {
      PlayerAttemptMove()
    }else if (userInput === "ArrowLeft") {
      PlayerAttemptMove()
    
//ability use
    }else if(userInput === "q" || userInput === "w" || userInput === "e" || userInput === "r" || userInput === "t" || userInput === "y") {
      console.log("ability use")
      var abilityIndex = 0;
      switch (userInput) {
        case "q":
          abilityIndex = 0
          break;
        case "w":
          abilityIndex = 1
          break;
        case "e":
          abilityIndex = 2
          break;
        case "r":
          abilityIndex = 3
          break;
        case "t":
          abilityIndex = 4
          break;
        case "y":
          abilityIndex = 5
          break;
        default:
          break;
      }

      //check if ability exists
      if(abilityIndex < CurrrentActivePlayer.abilityList.abilities.length){
        //hit existing ability key
        let abil = CurrrentActivePlayer.abilityList.abilities[abilityIndex]
        let canUse = abil.abilityFunction.function.canUse(abil,CurrrentActivePlayer)
        if(canUse){
          //check if ability is instant or targeted
          if(abil.abilityFunction.function.onTarget){
            abil.abilityFunction.function.onTarget(abil, CurrrentActivePlayer)

          }else {
            abil.abilityFunction.function.onUse(abil, CurrrentActivePlayer)

          }
        }
      }
      render()
    }else if(userInput=="Enter"){
      console.log("Enter")
      if(gameState == "PlayerTurnDefend"){
        gameState = "PlayerTurnAttack"
      }else if (gameState == "PlayerTurnAttack"){
        EndTurnProcess(allyEntities.get())
        gameState = "EnemyTurn"
      }

      render()
    }else if (userInput === 'x') {
      //set examine mode
      ExamineTargetEnable("examine")

      render()
    }else if (userInput === 'p') {
      //used for testing
      console.log(CurrrentActivePlayer)
      //CurrrentActivePlayer.abilityList.abilities[0].function.onUse()
      console.log(CurrrentActivePlayer.abilityList.abilities[0])
      let abil = CurrrentActivePlayer.abilityList.abilities[0]
      abil.abilityFunction.function.onUse(abil, CurrrentActivePlayer)
      render()
    }
  }else if (gameState === "examine" || gameState === "targeting") {
      if (userInput === "Escape") {
        ExamineTargetDisable()
        render()
      }else if (userInput === "ArrowUp" || userInput === "ArrowRight" || userInput === "ArrowDown" || userInput === "ArrowLeft") {
        TargetMove()
        render()
      }else if(userInput === "Enter" && gameState === "targeting"){
        //activate the queued ability
        console.log(queuedAbility)
        queuedAbility.abilityFunction.function.onUse(queuedAbility, queuedEntity)
        ExamineTargetDisable()
        render()
    }
  }
    userInput = null
}


export const ExamineTargetEnable = (state) => {
  previousGameState = gameState
  gameState = state

  //set examine base position to current active player position
  targetEntity.add(components.Position, {x: CurrrentActivePlayer.position.x,y: CurrrentActivePlayer.position.y})
}

export const ExamineTargetDisable= () => {
  gameState = previousGameState
  targetEntity.remove(targetEntity.position)
}

const Examing = () => {

}

const Targeting = () => {

}

const PlayerAttemptMove = () => {
  // player.add(Move, { x: 0, y: -1 }); u

  // player.add(Move, { x: 1, y: 0 }); r

  // player.add(Move, { x: 0, y: 1 }); d

  // player.add(Move, { x: -1, y: 0 }); l

  if (userInput === "ArrowUp") {
    CurrrentActivePlayer.movement.y = -1
  }
  if (userInput === "ArrowRight") {
    CurrrentActivePlayer.movement.x = 1
  }
  if (userInput === "ArrowDown") {
    CurrrentActivePlayer.movement.y = 1
  }
  if (userInput === "ArrowLeft") {
    CurrrentActivePlayer.movement.x = -1
  }

  CurrrentActivePlayer.fireEvent("attempt-move")

  render()
}

const TargetMove = () => {
  if (userInput === "ArrowUp") {
    targetEntity.position.y += -1
  } else if (userInput === "ArrowRight") {
    targetEntity.position.x += 1
  } else if (userInput === "ArrowDown") {
    targetEntity.position.y += 1
  } else if (userInput === "ArrowLeft") {
    targetEntity.position.x += -1
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
  