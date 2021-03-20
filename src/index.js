import "./lib/canvas.js";
import world from "./state/ecs";
import * as ROT from "rot-js";
import {render,SetEntityToRender} from "./systems/render"
import {makeMap,FetchFreeTile} from "./state/dungeon"
import * as components from "./state/component"
import { times } from "lodash";
import {readCacheSet} from "./state/cache"
import {toLocId} from "./lib/grid"
import * as AI from "./systems/ai"
import {HideHelpMenu} from "./state/helpMenu"
import gameTown from "./state/town"
import * as Hunt from "./state/scenario"

export var gameState = "loading"
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

let userInput = null;

const playerEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit, components.IsPlayerControlled],
  none: [components.IsDead]
});

const allyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy, components.IsPlayerControlled]
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
      // console.log('input: ' + userInput)
      gameTown.GetNextActive()

      render()

//die select
    }else if(userInput === "1" || userInput === "2" || userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6" || userInput === "7" || userInput === "8" || userInput === "9") {
      // console.log("dice swap")
      //select die
      if(userInput - 1 < gameTown.GetActive().die.length) {
        // console.log(CurrrentActivePlayer.die[userInput-1])
        if(!gameTown.GetActive().die[userInput-1].exhausted){
          gameTown.GetActive().die[userInput-1].selected = !gameTown.GetActive().die[userInput-1].selected
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
      //console.log("ability use")
      var abilityIndex = ConvertSkillHotkey(userInput)

      //check if ability exists
      if(abilityIndex < gameTown.GetActive().abilityGrabBagList.abilities.length){
        //hit existing ability key
        let abil = gameTown.GetActive().abilityGrabBagList.abilities[abilityIndex]
        let canUse = abil.abilityFunction.function.canUse(abil,gameTown.GetActive())
        var currentPhase = (gameState == "PlayerTurnDefend") ? "Defend" : "Attack"
        if(canUse.length > 0 && (abil.abilityPhase.phase == "Any" || abil.abilityPhase.phase == currentPhase)){
          //check if ability is instant or targeted
          if(abil.abilityFunction.function.onTarget){
            abil.abilityFunction.function.onTarget(abil, gameTown.GetActive())

          }else {
            abil.abilityFunction.function.onUse(abil, gameTown.GetActive(), GetTargetEntityPos())

          }
        }
      }
      render()
    
    }else if(userInput === "Q" || userInput === "W" || userInput === "E" || userInput === "R" || userInput === "T" || userInput === "Y") {
  //ability info
      //console.log("ability info")
      var abilityIndex = ConvertSkillHotkey(userInput)
      SetPreviousState("AbilityInfo")
      //console.log(abilityIndex)
      //console.log(CurrrentActivePlayer.abilityList.abilities[abilityIndex])
      SetEntityToRender(gameTown.GetActive().abilityGrabBagList.abilities[abilityIndex])
      render()
    
    }else if(userInput=="Enter"){
      //console.log("Enter")
      if(gameState == "PlayerTurnDefend"){
        PlayerTurnDefend()
        gameState = "PlayerTurnAttack"
      }else if (gameState == "PlayerTurnAttack"){
        //process playerAttack
        ProcessDmgTiles()

        EndTurnProcess(allyEntities.get())
        EndTurnProcess(playerEntities.get())
        CheckVictory()
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
      //console.log(CurrrentActivePlayer)
      
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
        //console.log(queuedAbility)
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
  targetEntity.add(components.Position, {x: gameTown.GetActive().position.x,y: gameTown.GetActive().position.y})
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
    gameTown.GetActive().movement.y = -1
  }
  if (userInput === "ArrowRight") {
    gameTown.GetActive().movement.x = 1
  }
  if (userInput === "ArrowDown") {
    gameTown.GetActive().movement.y = 1
  }
  if (userInput === "ArrowLeft") {
    gameTown.GetActive().movement.x = -1
  }

  gameTown.GetActive().fireEvent("attempt-move")

  render()
}

const TargetMove = () => {
  if (userInput === "ArrowUp") {
    targetEntity.position.y = gameTown.GetActive().position.y + -1
    targetEntity.position.x = gameTown.GetActive().position.x
  } else if (userInput === "ArrowRight") {
    targetEntity.position.x = gameTown.GetActive().position.x + 1
    targetEntity.position.y = gameTown.GetActive().position.y
  } else if (userInput === "ArrowDown") {
    targetEntity.position.y = gameTown.GetActive().position.y + 1
    targetEntity.position.x = gameTown.GetActive().position.x
  } else if (userInput === "ArrowLeft") {
    targetEntity.position.x = gameTown.GetActive().position.x + -1
    targetEntity.position.y = gameTown.GetActive().position.y
  }
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

const EnemyAttackTurn = () => {
  //console.log("enemy attacks")
  enemyEntities.get().forEach( enem => {
    AI.DoAiTurnAttack(enem)
  })
}

const AllyAttackTurn = () => {
  allyEntities.get().forEach( ally => {
    AI.DoAiTurnAttack(ally)
  })
}

const PlayerTurnDefend = () => {
  //wait for player input and process, but only allow defensive abilities

  //proccess enemyAttack
  ProcessDmgTiles()

  //process ally turns
  AllyAttackTurn()
}

const PlayerTurnAttack = () => {
  //wait for player input and process, but only allow offensive abilities 
}

const ProcessDmgTiles = () => {
  console.log("process dmg")
  //for each dmgtile
  //console.log(dmgTileEntities.get())
  //dont remove from an array while iterating over it
  var toDestroy = []
  dmgTileEntities.get().forEach( (entity) => {
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))

    getEntitiesAtLoc.forEach( (eId) => {
      //check if this is a unit
      var entityAtLoc = world.getEntity(eId);
      //console.log(entityAtLoc)
      if(entityAtLoc.layerUnit){
        entityAtLoc.fireEvent("take-damage", {amount: entity.dmgTile.dmg})
      }
    });
    toDestroy.push(entity)
  });

  toDestroy.forEach( (ent) =>{
    ent.destroy()
  })
  //console.log(dmgTileEntities.get())
  //console.log("end process dmg")
}

const EndTurnProcess = (entities) => {
  //console.log('ending turn for ')
  entities.forEach( (entity) => {
    //console.log(entity)
    entity.fireEvent('turn-end', entity);
  });

}

const CheckVictory = () =>{
  var count = 0
  console.log("check victory")
  enemyEntities.get().forEach(enem => {
    count++
  })
  //did we beat all enemies?
  if(count == 0){
    //still an enemy alive
    console.log("VICTORY")
    var final = Hunt.StartNextScenario()
    //means there are more scenarios
    if(!final){
      console.log("going to next scenario")
      CleanUpPostBattle()
      StartScenario()
    }else{
      console.log("finished")
    }
    //true go to town
  }
}

const CleanUpPostBattle = () => {
  //we need to delete all enemies
  //delete allies that aren't permanent?
  //remove position from all alies

  var hunters = gameTown.GetHunters()
  for(var x = 0; x<hunters.length;x++){
    if(gameTown.GetVillager(hunters[x]).has(components.Position)){
      gameTown.GetVillager(hunters[x]).remove(gameTown.GetVillager(hunters[x]).position)
    }
  }
}

const StartHunt = (huntName) => {

  //set hunt
  Hunt.StartHunt(huntName)

  //fetch the hunt
  Hunt.GetCurrentHunt()
  //fetch the first scenario
  StartScenario()
}

const StartScenario = () => {
  var currScenario = Hunt.GetCurrentScenario();

  //TODO: check if this has dialogue or battle
  //for now assume battle
  //make map
  makeMap()
  //make allies
  //for loop over current huntScenario.allies

  console.log(currScenario)
  //make enemies
  currScenario.scenarioBattle.enemies.forEach(enem => {
    times(enem[1], () => {
      var emptyTile = FetchFreeTile();
      var newEnem = world.createPrefab(enem[0])
      newEnem.add(components.Position, {x: emptyTile.position.x, y: emptyTile.position.y})
      newEnem.add(components.IsEnemy)
    });
  })

  //make ally
  currScenario.scenarioBattle.allies.forEach( ally => {
    times(ally[1], () => {
      var emptyTile = FetchFreeTile();
      var newAlly = world.createPrefab(ally[0])
      newAlly.add(components.Position, {x: emptyTile.position.x, y: emptyTile.position.y})
      newAlly.appearance.color = "blue"
    });
  })

  //for loop over current huntscenario
  //spawn first 4 players in villagers (for now)
  gameTown.SetHunters()
  var hunters = gameTown.GetHunters()
  console.log("hunters going to battle")
  console.log(hunters)
  hunters.forEach( hunter => {
    console.log("setting up hunter")
    console.log(gameTown.GetVillager(hunter))
    var emptyTile = FetchFreeTile();
    gameTown.GetVillager(hunter).add(components.Position, {x:emptyTile.position.x,y:emptyTile.position.y})
  })

  gameState = "setup"
  render()
}


const SetupGame = () => {
  //make hunts
  Hunt.SetupHunts()

  
  //make initial town
  console.log(gameTown)

    StartHunt("Hunt")
  
//   makeMap()
// setupTestFight()
// render()
}

SetupGame()



const gameLoop = () => {
    update();

    requestAnimationFrame(gameLoop);
  };
  
requestAnimationFrame(gameLoop);
  