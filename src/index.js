import "./lib/canvas.js";
import world from "./state/ecs";
import * as ROT from "rot-js";
import {render,SetEntityToRender} from "./systems/render"
import {makeMap,FetchFreeTile} from "./state/dungeon"
import * as components from "./state/component"
import { times } from "lodash";
import { Tile } from "./state/prefab.js";
import {readCacheSet} from "./state/cache"
import {toLocId} from "./lib/grid"
import * as Abilities from "./systems/abilities"
import * as AI from "./systems/ai"
import {HideHelpMenu} from "./state/helpMenu"

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
  all: [components.Position, components.Appearance, components.LayerUnit, components.IsPlayerControlled],
  none: [components.IsDead]
});

const allyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy]
})

const enemyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy],
  none: [components.IsDead]
})

const dmgTileEntities = world.createQuery({
  all: [components.DmgTile]
})

const update = () => {
    if(gameState == "setup"){
      gameState = "EnemyTurnDefend"
    }else if(gameState == "EnemyTurnDefend") {

      
      //EnemyDefendTurn()

      gameState = "EnemyTurnAttack"
      render()
      //set to playerturndefend
      //check win/lose  
    }else if(gameState == "EnemyTurnAttack"){
      EnemyAttackTurn()
      //fire end turn for all enemy units
      EndTurnProcess(enemyEntities.get())

      gameState = "PlayerTurnDefend"
      render()
    }else if(gameState == "PlayerTurnDefend") {
      processUserInput()
      //set to playerturnattack
      //check win/lose
    }else if(gameState == "PlayerTurnAttack") {
      processUserInput()
      //set to enemy turn
      //check win/lose

      //fire endTurn for all player units
      
    }else if(gameState=="examine" || gameState =="targeting" || gameState == "Help" || gameState == "AbilityInfo" || gameState == "DamageShow" || gameState == "EnemyNumbers"){
      processUserInput()
      //render entities under current reticle

      
    }
    
}


const processUserInput = () => {
//show help screen
  if(gameState == "PlayerTurnDefend" || gameState == "PlayerTurnAttack"){
    if(userInput === "?") {
      SetPreviousState("Help")
      render()
//select next player
    }else if (userInput === "n") {
      //change active player to next
      console.log('input: ' + userInput)
      CurrrentActivePlayer = GetNextActivePlayer()

      render()

//die select
    }else if(userInput === "1" || userInput === "2" || userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6" || userInput === "7" || userInput === "8" || userInput === "9") {
      console.log("dice swap")
      //select die
      if(userInput - 1 < CurrrentActivePlayer.die.length) {
        console.log(CurrrentActivePlayer.die[userInput-1])
        if(!CurrrentActivePlayer.die[userInput-1].exhausted){
          CurrrentActivePlayer.die[userInput-1].selected = !CurrrentActivePlayer.die[userInput-1].selected
        }
        render()
        
      }
      

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
      var abilityIndex = ConvertSkillHotkey(userInput)

      //check if ability exists
      if(abilityIndex < CurrrentActivePlayer.abilityList.abilities.length){
        //hit existing ability key
        let abil = CurrrentActivePlayer.abilityList.abilities[abilityIndex]
        let canUse = abil.abilityFunction.function.canUse(abil,CurrrentActivePlayer)
        var currentPhase = (gameState == "PlayerTurnDefend") ? "Defend" : "Attack"
        if(canUse.length > 0 && (abil.abilityPhase.phase == "Any" || abil.abilityPhase.phase == currentPhase)){
          //check if ability is instant or targeted
          if(abil.abilityFunction.function.onTarget){
            abil.abilityFunction.function.onTarget(abil, CurrrentActivePlayer)

          }else {
            abil.abilityFunction.function.onUse(abil, CurrrentActivePlayer, GetTargetEntityPos())

          }
        }
      }
      render()
    
    }else if(userInput === "Q" || userInput === "W" || userInput === "E" || userInput === "R" || userInput === "T" || userInput === "Y") {
  //ability info
      console.log("ability info")
      var abilityIndex = ConvertSkillHotkey(userInput)
      SetPreviousState("AbilityInfo")
      console.log(abilityIndex)
      console.log(CurrrentActivePlayer.abilityList.abilities[abilityIndex])
      SetEntityToRender(CurrrentActivePlayer.abilityList.abilities[abilityIndex])
      render()
    
    }else if(userInput=="Enter"){
      console.log("Enter")
      if(gameState == "PlayerTurnDefend"){
        PlayerTurnDefend()
        gameState = "PlayerTurnAttack"
      }else if (gameState == "PlayerTurnAttack"){
        //process playerAttack
        ProcessDmgTiles()

        EndTurnProcess(allyEntities.get())
        gameState = "EnemyTurnDefend"
      }

      render()
    }else if (userInput === 'x') {
      //set examine mode
      ExamineTargetEnable("examine")

      render()
    }else if (userInput === 'c') {
      SetPreviousState("DamageShow")
      render()
    }else if (userInput === 'z') {
      SetPreviousState("EnemyNumbers")
      render()
    }else if (userInput === 'p') {
      //used for testing
      console.log(CurrrentActivePlayer)
      
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
        queuedAbility.abilityFunction.function.onUse(queuedAbility, queuedEntity, GetTargetEntityPos())
        ExamineTargetDisable()
        render()
    }
  }else if (gameState === "Help" || gameState == "AbilityInfo" || gameState == "DamageShow" || gameState == "EnemyNumbers" ) {
    if(userInput ==="Escape"){
      HideHelpMenu()
      ReturnPreviousGameState()
      render()
    }
  }
    userInput = null
}

const ConvertSkillHotkey = (hotkey) => {
  switch (userInput) {
    case "q":
    case "Q":
      return 0
    case "w":
    case "W":
      return 1
    case "e":
    case "E":
      return 2
    case "r":
    case "R":
      return 3
    case "t":
    case "T":
      return 4
    case "y":
    case "Y":
      return 5
    default:
      return 0
  }
}

const GetTargetEntityPos = () => {
  if(targetEntity.has(components.Position)){
    return {x:targetEntity.position.x,y:targetEntity.position.y}
  }else {
    return {x:0,y:0}
  }
}

export const ExamineTargetEnable = (state) => {
  SetPreviousState(state)

  //set examine base position to current active player position
  targetEntity.add(components.Position, {x: CurrrentActivePlayer.position.x,y: CurrrentActivePlayer.position.y})
}

const SetPreviousState = (state) => {
  previousGameState = gameState
  gameState = state
}

export const ExamineTargetDisable= () => {
  ReturnPreviousGameState()
  targetEntity.remove(targetEntity.position)
}

const ReturnPreviousGameState = () => {
  gameState = previousGameState
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
    targetEntity.position.y = CurrrentActivePlayer.position.y + -1
    targetEntity.position.x = CurrrentActivePlayer.position.x
  } else if (userInput === "ArrowRight") {
    targetEntity.position.x = CurrrentActivePlayer.position.x + 1
    targetEntity.position.y = CurrrentActivePlayer.position.y
  } else if (userInput === "ArrowDown") {
    targetEntity.position.y = CurrrentActivePlayer.position.y + 1
    targetEntity.position.x = CurrrentActivePlayer.position.x
  } else if (userInput === "ArrowLeft") {
    targetEntity.position.x = CurrrentActivePlayer.position.x + -1
    targetEntity.position.y = CurrrentActivePlayer.position.y
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

    times(6, () => {
      emptyTile = FetchFreeTile();
      world.createPrefab("Goblin").add(components.Position, {x: emptyTile.position.x, y: emptyTile.position.y})
    });

    emptyTile = FetchFreeTile();
    world.createPrefab("Orc Warrior").add(components.Position, {x: emptyTile.position.x, y: emptyTile.position.y})
}

const EnemyDefendTurn = () => {
  //loop through all enemies and do their turn
  enemyEntities.get().forEach( enem => {
    AI.DoAiTurnDefend(enem)
  })
  //process playerAttack
  ProcessDmgTiles()
}

const EnemyAttackTurn = () => {
  console.log("enemy attacks")
  enemyEntities.get().forEach( enem => {
    AI.DoAiTurnAttack(enem)
  })
}

const PlayerTurnDefend = () => {
  //wait for player input and process, but only allow defensive abilities

  //proccess enemyAttack
  ProcessDmgTiles()
}

const PlayerTurnAttack = () => {
  //wait for player input and process, but only allow offensive abilities 
}

const ProcessDmgTiles = () => {
  console.log("process dmg")
  //for each dmgtile
  console.log(dmgTileEntities.get())
  //dont remove from an array while iterating over it
  var toDestroy = []
  dmgTileEntities.get().forEach( (entity) => {
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))

    getEntitiesAtLoc.forEach( (eId) => {
      //check if this is a unit
      var entityAtLoc = world.getEntity(eId);
      console.log(entityAtLoc)
      if(entityAtLoc.layerUnit){
        entityAtLoc.fireEvent("take-damage", {amount: entity.dmgTile.dmg})
      }
    });
    toDestroy.push(entity)
  });

  toDestroy.forEach( (ent) =>{
    ent.destroy()
  })
  console.log(dmgTileEntities.get())
  console.log("end process dmg")
}

const EndTurnProcess = (entities) => {
  console.log('ending turn for ')
  entities.forEach( (entity) => {
    console.log(entity)
    entity.fireEvent('turn-end', entity);
  });

}

makeMap()
setupTestFight()
FetchFreeTile()
render()



const gameLoop = () => {
    update();

    requestAnimationFrame(gameLoop);
  };
  
requestAnimationFrame(gameLoop);
  