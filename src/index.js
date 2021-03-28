import world from "./state/ecs"
import {grid, display, divHelp, displayHelp} from "./lib/canvas.js";
import {render, SetEntityToRender} from "./systems/render"
import * as components from "./state/component"
import { times } from "lodash";
import {readCacheSet} from "./state/cache"
import {toLocId} from "./lib/grid"
import * as AI from "./systems/ai"
import {HideHelpMenu} from "./state/helpMenu"
import gameTown from "./state/town"
import * as Hunt from "./state/scenario"
import * as Target from "./systems/target"
import * as Projectile from "./systems/projectile"
//import {makeMap, FetchFreeTile, FetchFreeTileTarget, SpawnScenarioUnits} from "./state/dungeon"
import {makeMap, FetchFreeTile, FetchFreeTileTarget, SpawnScenarioUnits} from "./state/dungeon"
export var gameState = "loading"
export var previousGameState = ""

const playerEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit, components.IsPlayerControlled],
  none: [components.IsDead, components.MultiTileBody]
});

const dmgTileEntities = world.createQuery({
  all: [components.DmgTile]
})

const allyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy, components.IsPlayerControlled, components.MultiTileBody]
})

const enemyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy],
  none: [components.IsDead, components.MultiTileBody]
})

const layerItemEntities = world.createQuery({
  all: [components.LayerItem, components.Appearance, components.Position]
})

let userInput = null;

const update = () => {
    if(gameState == "setup"){
      FetchFreeTileTarget({x:2,y:2},3)
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

      
    }else if (gameState == "gameover") {
    }else {
      SetupGame()
    }
    
}


const processUserInput = () => {
//show help screen
  if(!userInput){
    return;
  }else if(gameState == "PlayerTurnDefend" || gameState == "PlayerTurnAttack"){
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
    //}else if(userInput === "q" || userInput === "w" || userInput === "e" || userInput === "r" || userInput === "t" || userInput === "y") {
    }else if(userInput in gameTown.GetCurrentHunterAbilityMap()){
      //console.log("ability use")
      //var abilityIndex = ConvertSkillHotkey(userInput)

        //hit existing ability key
        let abil = gameTown.GetCurrentHunterAbility(userInput)
        let canUse = abil.abilityFunction.function.canUse(abil,gameTown.GetActive())
        var currentPhase = (gameState == "PlayerTurnDefend") ? "Defend" : "Attack"
        if(canUse.length > 0 && (abil.abilityPhase.phase == "Any" || abil.abilityPhase.phase == currentPhase)){
          //check if ability is instant or targeted
          if(abil.abilityFunction.function.onTarget){
            abil.abilityFunction.function.onTarget(abil, gameTown.GetActive())

          }else {
            abil.abilityFunction.function.onUse(abil, gameTown.GetActive(), Target.GetTargetEntityPos())

          }
        }
      render()
    
    //}else if(userInput === "Q" || userInput === "W" || userInput === "E" || userInput === "R" || userInput === "T" || userInput === "Y") {
    }else if (userInput.length == 1 && userInput.toLowerCase() in gameTown.GetCurrentHunterAbilityMap() ){
  //ability info
      //console.log("ability info")
      //var abilityIndex = ConvertSkillHotkey(userInput)
      SetPreviousState("AbilityInfo")
      //console.log(abilityIndex)
      //console.log(CurrrentActivePlayer.abilityList.abilities[abilityIndex])
      SetEntityToRender(gameTown.GetCurrentHunterAbility(userInput.toLowerCase()))
      render()
    
    }else if(userInput=="Enter"){
      //console.log("Enter")
      if(gameState == "PlayerTurnDefend"){
        PlayerTurnDefend()
        
        gameState = "PlayerTurnAttack"

        CheckDefeat()
      }else if (gameState == "PlayerTurnAttack"){
        //process playerAttack
        ProcessDmgTiles()

        EndTurnProcess(allyEntities.get())
        EndTurnProcess(playerEntities.get())
        CheckVictory()
        
        gameState = "EnemyTurnDefend"
        CheckDefeat()
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
      }else if(userInput === " " && gameState === "targeting"){
        Target.UseAbility()
        // queuedAbility.abilityFunction.function.onUse(queuedAbility, queuedEntity, Target.GetTargetEntityPos())
        ExamineTargetDisable()
        render()
    }
  }else if (gameState === "Help" || gameState == "AbilityInfo" || gameState == "DamageShow" || gameState == "EnemyNumbers" ) {
    if(userInput ==="Escape"){
      HideHelpMenu()
      ReturnPreviousGameState()
      render()
    }else if( gameState == "DamageShow" && userInput == "c"){
      ReturnPreviousGameState()
      render()
    }else if( gameState == "EnemyNumbers" && userInput == "z"){
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


export const ExamineTargetEnable = (state) => {
  SetPreviousState(state)

  //set examine base position to current active player position

  //targetEntity.add(components.Position, {x: gameTown.GetActive().position.x,y: gameTown.GetActive().position.y})
}

const SetPreviousState = (state) => {
  previousGameState = gameState
  gameState = state
}

export const ExamineTargetDisable= () => {
  ReturnPreviousGameState()
  Target.ClearTargetEntities()
  // targetEntity.remove(targetEntity.position)
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
    Target.UpdateTargetEntities(0,-1)
  } else if (userInput === "ArrowRight") {
    Target.UpdateTargetEntities(1,0)
  } else if (userInput === "ArrowDown") {
    Target.UpdateTargetEntities(0,1)
  } else if (userInput === "ArrowLeft") {
    Target.UpdateTargetEntities(-1,0)
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
    console.log("dmg tile id")
    console.log(entity.id)
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))

    getEntitiesAtLoc.forEach( (eId) => {
      //check if this is a unit
      var entityAtLoc = world.getEntity(eId);
      //console.log(entityAtLoc)
      if(entityAtLoc.layerUnit && !(entityAtLoc.has(components.MultiTileBody))){
        entityAtLoc.fireEvent("take-damage", {amount: entity.dmgTile.dmg})
      }else if(entityAtLoc.has(components.MultiTileBody)){
        var headEnt = world.getEntity(entityAtLoc.multiTileBody.headID)
        headEnt.fireEvent("take-damage", {amount: entity.dmgTile.dmg})
      }
    });
    toDestroy.push(entity)
  });

  toDestroy.forEach( (ent) =>{
    world.destroyEntity(ent.id)
  })

  //clear projectiles too 
  Projectile.ClearProjectiles() 
}

const EndTurnProcess = (entities) => {
  //console.log('ending turn for ')
  var ents = [...entities]
  for(var x = 0;x < ents.length;x++){
    ents[x].fireEvent('turn-end');
  }

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
      //rest
      // RestPhase()
      StartScenario()
    }else{
      console.log("finished")
    }
    //true go to town
  }
}

const CheckDefeat = () => {
  var stillAlive = false
  for(var x = 0; x < playerEntities.get().length;x++){
    if(playerEntities.get()[x].health.current > 0 && !playerEntities.get()[x].has(components.IsDead)){
      stillAlive = true
    }
  }

  if(!stillAlive){
    gameState = "gameover"
  }
}

const RestPhase = (entity) => {
  entity.stamina.current = entity.stamina.max;
  //entity.fireEvent("roll-dice")
  entity.fireEvent('turn-end', entity);
}

const CleanUpPostBattle = () => {
  //remove all the items on the ground
  layerItemEntities.get().forEach(item => {
    world.destroyEntity(item.id)
  })

  //we need to delete all enemies
  enemyEntities.get().forEach(enem => { 
    world.destroyEntity(enem.id)
  })
  //delete allies that aren't permanent?
  allyEntities.get().forEach( ally => {
    world.destroyEntity(ally.id)
  })
  //remove position from all alies

  var hunters = gameTown.GetHunters()
  for(var x = 0; x<hunters.length;x++){
    if(gameTown.GetVillager(hunters[x]).has(components.Position)){
      gameTown.GetVillager(hunters[x]).remove(gameTown.GetVillager(hunters[x]).position)
      RestPhase(gameTown.GetVillager(hunters[x]))
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
      SpawnScenarioUnits(enem[0], true)
    });
  })

  //make ally
  currScenario.scenarioBattle.allies.forEach( ally => {
    times(ally[1], () => {
      SpawnScenarioUnits(ally[0],false)
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

// SetupGame()

export const SpawnUnits =(ability, entity) =>{
  var freeTile = FetchFreeTileTarget({x:entity.position.x,y:entity.position.y},4)
  if(!freeTile){
      return
  }
  //create a new prefab and attach duration to it
  SpawnScenarioUnits(ability.abilitySummon.prefab, entity.has(components.IsEnemy), freeTile)
}


const gameLoop = () => {
    update();

    requestAnimationFrame(gameLoop);
  };
  
requestAnimationFrame(gameLoop);
  