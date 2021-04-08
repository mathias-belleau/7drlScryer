import world from "./state/ecs"
import {grid, display, divHelp, displayHelp} from "./lib/canvas.js";
import {render, SetEntityToRender} from "./systems/render"
import * as components from "./state/component"
import { times } from "lodash";
import {readCacheSet} from "./state/cache"
import {toLocId} from "./lib/grid"
import * as AI from "./systems/ai"

import * as Hunt from "./state/scenario"
import * as Target from "./systems/target"
import * as Projectile from "./systems/projectile"
import * as Unit from "./systems/units"
import * as Message from "./state/messagelog"
import * as Battle from "./systems/battle"
import * as Village from "./systems/village"
import * as Town from "./state/town"
//import {makeMap, FetchFreeTile, FetchFreeTileTarget, SpawnScenarioUnits} from "./state/dungeon"
import {makeMap, FetchFreeTile, FetchFreeTileTarget, SpawnScenarioUnits} from "./state/dungeon"

export var gameState = "loading"
export var previousGameState = ""

export function GetGameState(){
  return gameState
}

export function SetGameState(newState){
  gameState=newState
}

export const villagerEntities = world.createQuery({
  all: [components.Appearance, components.IsPlayerControlled],
});

export const playerEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit, components.IsPlayerControlled],
  none: [components.IsDead, components.MultiTileBody]
});

export const hunterEntities = world.createQuery({
  all: [components.Hunter]
})

export const activeHunter = world.createQuery({
  all: [components.ActiveHunter]
})

const dmgTileEntities = world.createQuery({
  all: [components.DmgTile]
})

export const allyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy, components.IsPlayerControlled, components.MultiTileBody]
})

export const friendlyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy, components.MultiTileBody]
})

export const enemyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy],
  none: [components.IsDead, components.MultiTileBody]
})

export const layerItemEntities = world.createQuery({
  all: [components.LayerItem, components.Appearance, components.Position],
  none: [components.IsPlayerControlled]
})

export const UnlockedHunts = world.createQuery({
  all: [components.HuntUnlocked],
})

let userInput = null;

const update = () => {
    if(Battle.GetBattlePhases().includes(gameState)){
      Battle.DoBattlePhase(userInput)
    }else if(Village.GetVillagePhases().includes(gameState)){
      Village.DoVillagePhase(userInput)
    }else if(gameState == "loading") {
      SetupGame()
    }
    userInput = null;
}

export function CheckActiveDead(){
  if(Town.GetActive().has(components.IsDead)){
    if(CheckDefeat()){
      Town.GetNextActive()
    }
  }
}



export const ExamineTargetEnable = (state) => {
  SetPreviousState(state)
}

export const SetPreviousState = (state) => {
  previousGameState = gameState
  gameState = state
}

export const ExamineTargetDisable= () => {
  ReturnPreviousGameState()
  Target.ClearTargetEntities()
  // targetEntity.remove(targetEntity.position)
}

export const ReturnPreviousGameState = () => {
  gameState = previousGameState
}

const Examing = () => {

}

const Targeting = () => {

}

export const PlayerAttemptMove = () => {
  // console.log("MOVEMENT INPUT " + userInput)
  if (userInput === "ArrowUp") {
    Town.GetActive().movement.y = -1
  }
  if (userInput === "ArrowRight") {
    Town.GetActive().movement.x = 1
  }
  if (userInput === "ArrowDown") {
    Town.GetActive().movement.y = 1
  }
  if (userInput === "ArrowLeft") {
    Town.GetActive().movement.x = -1
  }
  console.debug("x: " + Town.GetActive().movement.x + " y: " + Town.GetActive().movement.y)
  Unit.AttemptMove(Town.GetActive())

  render()
}

export const TargetMove = () => {
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


export const EnemyAttackTurn = () => {
  //console.log("enemy attacks")
  enemyEntities.get().forEach( enem => {
    AI.DoAiTurnAttack(enem)
  })
}

export const AllyAttackTurn = () => {
  allyEntities.get().forEach( ally => {
    AI.DoAiTurnAttack(ally)
  })
}

export const PlayerTurnDefend = () => {
  //wait for player input and process, but only allow defensive abilities

  //proccess enemyAttack
  ProcessDmgTilesProjectiles()

  //process ally turns
  AllyAttackTurn()

  //check if active player is dead
  CheckActiveDead()
}

export const PlayerTurnAttack = () => {
  //wait for player input and process, but only allow offensive abilities 
}

export function ProcessDmgTilesProjectiles() {
  ProcessDmgTiles()
  Projectile.ClearProjectiles()
}

export const ProcessDmgTiles = (tilesToProcess = dmgTileEntities.get()) => {
  console.log("process dmg")
  //for each dmgtile
  //console.log(dmgTileEntities.get())
  //dont remove from an array while iterating over it
  var toDestroy = []
  tilesToProcess.forEach( (entity) => {
    ProcessDmgTile(entity)
    toDestroy.push(entity)
  });

  toDestroy.forEach( (ent) =>{
    world.destroyEntity(ent.id)
  })

  
}
export function ProcessDmgTile(entity) {
  console.log("dmg tile id")
    console.log(entity.id)
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))

    getEntitiesAtLoc.forEach( (eId) => {
      //check if this is a unit
      var entityAtLoc = world.getEntity(eId);
      //console.log(entityAtLoc)
      if(entityAtLoc.layerUnit && !(entityAtLoc.has(components.MultiTileBody))){
        Unit.TakeDamage(entityAtLoc, entity.dmgTile.dmg)

        //activate after affect
        //activate after affect
        if(entity.has(components.DmgTileAfterEffect) && entity.dmgTileAfterEffect.ability){
          entity.dmgTileAfterEffect.ability(entity.dmgTileAfterEffect.attacker, entityAtLoc)
        }
      }else if(entityAtLoc.has(components.MultiTileBody)){
        var headEnt = world.getEntity(entityAtLoc.multiTileBody.headID)
        Unit.TakeDamage(headEnt, entity.dmgTile.dmg)

        //activate after affect
        if(entity.has(components.DmgTileAfterEffect) && entity.dmgTileAfterEffect.ability){
          entity.dmgTileAfterEffect.ability(entity.dmgTileAfterEffect.attacker, headEnt)
        }
      }
    });
}
export const StartTurnProcess = (entities) => {
  var ents = [...entities]
  for(var x = 0; x< ents.length;x++){
    Unit.StartTurn(ents[x])
  }
}

export const EndTurnProcess = (entities) => {
  //console.log('ending turn for ')
  var ents = [...entities]
  for(var x = 0;x < ents.length;x++){
    Unit.EndTurn(ents[x])
  }

}

export const CheckVictory = () =>{
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

export function FetchFreeTileTargetDungeon(target, range){
  return FetchFreeTileTarget(target, range)
}

export const CheckDefeat = () => {
  var stillAlive = false
  for(var x = 0; x < playerEntities.get().length;x++){
    if(playerEntities.get()[x].health.current > 0 && !playerEntities.get()[x].has(components.IsDead)){
      stillAlive = true
    }
  }

  if(!stillAlive){
    gameState = "gameover"
    
  }

  return stillAlive
}

export const RestPhase = (entity) => {
  entity.stamina.current = entity.stamina.max;
  Unit.RollDice(entity)
  //entity.fireEvent("roll-dice")
  entity.fireEvent('turn-end', entity);
}

export const CleanUpPostBattle = () => {
  //remove all the items on the ground

  DeleteEntities(layerItemEntities.get())
  DeleteEntities(enemyEntities.get())
  DeleteEntities(allyEntities.get())

  //remove position from all allies

  var hunters = hunterEntities.Get()
  for(var x = 0; x<hunters.length;x++){
    if(Town.GetVillager(hunters[x]).has(components.Position)){
      Town.GetVillager(hunters[x]).remove(Town.GetVillager(hunters[x]).position)
      RestPhase(Town.GetVillager(hunters[x]))
    }
  }
}

function DeleteEntities(entityList) {
  var cloneList = [...entityList]
  for(var x = 0; x < cloneList.length; x++){
    world.destroyEntity(cloneList[x].id)
  }
}

export const StartHunt = (huntName) => {

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
  
  var hunters = hunterEntities.get()
  console.log("hunters going to battle")
  console.log(hunters)
  hunters.forEach( hunter => {
    if(hunter.has(components.IsDead)){
      return;
    }
    console.log("setting up hunter")
    var emptyTile = FetchFreeTile("Left");
    hunter.add(components.Position, {x:emptyTile.position.x,y:emptyTile.position.y})

    //spawn companions
    SpawnCompanions(hunter)
  })


  gameState = "setup"
  render()
}

export function SpawnCompanions(entity){
  if(entity.has(components.Companion)){
      entity.companion.forEach( comp =>{
          var compEnt = world.getEntity(comp.eid)
          if(!compEnt || compEnt.has(components.IsDead)){
              //spawn a new companion and assign id
              var newId = SpawnScenarioUnits(comp.name, false)
              comp.eid = newId
          }else {
              //fully heal it!
              Heal(compEnt,99)
          }
      })
  }
}

export const SetupGame = () => {
  //make hunts
  Hunt.SetupHunts()

  Town.SetupVillage(7)

  //add starting hunt to village
  Hunt.UnlockHunt("Hunt")

  SetGameState("loadingTown")
  //make initial town
  
 
    // StartHunt("Hunt")
}

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
  