import {
    display,
    grid
  } from "../lib/canvas";

import * as components from "../state/component"

import world from "../state/ecs";
import { readCacheSet } from "../state/cache";
import {toCell, toLocId} from "../lib/grid"
import {CurrrentActivePlayer, gameState, targetEntity} from "../index"
import gameTown from "../state/town"
import {DrawHelpMenu,ShowAbilityInfo} from "../state/helpMenu"

const layerMapEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerMap]
  });

  const layerUnitEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit]
  });

  const slowDmgEntities = world.createQuery({
    all: [components.Position, components.SlowAttack]
  });

  const fastDmgEntities = world.createQuery({
    all: [components.Position, components.FastAttack]
  });

  const enemyEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy],
    none: [components.IsDead, components.MultiTileBody]
  })


const clearDisplay = () => {
    display.clear()
    //clearCanvas(grid.map.x - 1, grid.map.y, grid.map.width + 1, grid.map.height);
    
};
let EntityToRender =""

export const SetEntityToRender = (entity) => {
    EntityToRender = entity
}

const renderMap = () => {
    layerMapEntities.get().forEach((entity) => {
        DrawChar(entity,
            entity.position.x+grid.map.x,
            entity.position.y+grid.map.y)
    });
}

const renderEnemyQuickBar = () => {
    var count = 1
    enemyEntities.get().forEach( entity => {
        var text = "" + count
        text += "%c{"+entity.appearance.color+"} "+entity.description.name + " " + entity.health.current
        DrawText(text, grid.enemies.x, grid.enemies.y + count - 1)
        count++;
    })
}

const RenderDamageNumbers = () => {
    var dmgTiles = []
    dmgTiles.push.apply(dmgTiles, slowDmgEntities.get());
    dmgTiles.push.apply(dmgTiles, fastDmgEntities.get());
    //console.log(dmgTiles)
    var dmgCount = []
    dmgTiles.forEach( dmg => {
        var toLoc = toLocId({x:dmg.position.x,y:dmg.position.y})
        if(!dmgCount[toLoc]) {
            dmgCount[toLoc] = 0
        }
         dmgCount[toLoc] += dmg.dmgTile.dmg
    })
    //console.log(dmgCount)
    for (const [key, value] of Object.entries(dmgCount)) {
        //console.log(`${key}: ${value}`);
        var pos = toCell(key)
        display.draw(grid.map.x+pos.x, grid.map.y + pos.y, value)
      }
}

const RenderEnemyNumbers = () => {
    var count = 1
    enemyEntities.get().forEach( entity  => {
        display.draw(grid.map.x+entity.position.x, grid.map.y+entity.position.y, count.toString())
        count++
    })
}

const renderObjects = () => {

}


const renderUnits = () => {
    // //console.log(layerUnitEntities.get())
    layerUnitEntities.get().forEach((entity) => {
        DrawChar(entity,
            entity.position.x+grid.map.x,
            entity.position.y+grid.map.y)
    })
}

const renderActivePlayer = () => {
    if(gameTown.GetActive()){
        var text = "Active:"
        DrawText(text,grid.activePlayer.x,grid.activePlayer.y )
        DrawChar(gameTown.GetActive(),
            grid.activePlayer.x+ text.length,
            grid.activePlayer.y)

        DrawText("Hp:"+gameTown.GetActive().health.current.toString(),grid.activePlayer.x,grid.activePlayer.y+1)
        DrawText("Stam:"+gameTown.GetActive().stamina.current.toString()+"/"+gameTown.GetActive().stamina.max.toString(),grid.activePlayer.x,grid.activePlayer.y+2)
        DrawText("StamRgn:"+(Math.max(0,4 - gameTown.GetActive().stamina.used)).toString(),grid.activePlayer.x,grid.activePlayer.y+3)
        DrawText("Move:"+gameTown.GetActive().movement.movement.toString(),grid.activePlayer.x,grid.activePlayer.y+4)
        DrawText("Dodge:"+gameTown.GetActive().movement.dodge.toString(),grid.activePlayer.x,grid.activePlayer.y+5)
    }
}

const renderPhase = () => {
    DrawText(gameState, grid.phaseMenu.x,grid.phaseMenu.y)
}

const renderDieMenu = () => {
    if(gameTown.GetActive()){
        for(var x = 0; x < gameTown.GetActive().die.length; x++){
            ////console.log(CurrrentActivePlayer.die[x])
            //  1|3|
            //get color
            var color = "white"
            if(gameTown.GetActive().die[x].selected){
                color = "green"
            }else if(gameTown.GetActive().die[x].exhausted){
                color = "grey"
            }
            //display.draw(2+grid.dieMenu.x + (x*5), grid.dieMenu.y-1,'_')    
            DrawText((x+1).toString()+"|"+" "+"|", grid.dieMenu.x+ (x*5), grid.dieMenu.y)
            //console.log(CurrrentActivePlayer.die[x].number)
            display.draw(2+grid.dieMenu.x + (x*5), grid.dieMenu.y, gameTown.GetActive().die[x].number.toString(), "black", color)
        }
    }
}

const abilityHotkeys = ['q','w','e','r','t','y']

const renderAbilityMenu = () => {
    //for each ability make a button max of 3 char name 
    // q[mv] w[atk] e[dg]
    
    //if can use set to green?
    //if already used set to grey
    // console.log(gameTown.GetActive())
    for(var x = 0; x < gameTown.GetActive().abilityGrabBagList.abilities.length;x++){
        var color = "gray"
        var currentPhase = (gameState == "PlayerTurnDefend") ? "Defend" : "Attack"
        if( (gameTown.GetActive().abilityGrabBagList.abilities[x].abilityPhase.phase == "Any" || gameTown.GetActive().abilityGrabBagList.abilities[x].abilityPhase.phase == currentPhase)
         && gameTown.GetActive().abilityGrabBagList.abilities[x].abilityFunction.function.canUse(
            gameTown.GetActive().abilityGrabBagList.abilities[x],
            gameTown.GetActive()).length > 0){
            color = "white"
        }



        let smlName = gameTown.GetActive().abilityGrabBagList.abilities[x].abilitySmallName.smallName
        DrawText(abilityHotkeys[x]+"[%c{"+color+"}"+smlName+"%c{}]",grid.abilityMenu.x + (x*7), grid.abilityMenu.y)
    }
}

const renderTarget = () => {
    //get the position of the targetEntity
    //get entities at position
    //for now just draw x at position
    //console.log(targetEntity)
    DrawChar(targetEntity, 
        targetEntity.position.x+grid.map.x,
        targetEntity.position.y+grid.map.y)

    // draw the actual target coords
    
}

const renderSlowAttacks = () => {
    slowDmgEntities.get().forEach(slow => {
    //check if unit exists on this tile.
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:slow.position.x,y:slow.position.y}))
        var gotUnit = false
        var floor
        getEntitiesAtLoc.forEach(eid => {
            var ents = world.getEntity(eid)
            if(ents.has(components.LayerUnit)){
                gotUnit = true
                display.draw(slow.position.x + grid.map.x,
                    slow.position.y + grid.map.y,
                    ents.appearance.char,
                    ents.appearance.color, "yellow")
            }else if(ents.has(components.LayerMap)){
                floor = ents
            }

            if(!gotUnit && floor){
                display.draw(slow.position.x + grid.map.x, 
                    slow.position.y + grid.map.y, 
                    floor.appearance.char, 
                    floor.appearance.color, "yellow")
            }
        })
    //if yes draw that tile with yellow background

    //just draw the tile with yellow background    
    })
    
}

const renderFastAttacks = () => {
    fastDmgEntities.get().forEach(fast => {
    //check if unit exists on this tile.
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:fast.position.x,y:fast.position.y}))
        var gotUnit = false
        var floor
        getEntitiesAtLoc.forEach(eid => {
            var ents = world.getEntity(eid)
            if(ents.has(components.LayerUnit)){
                gotUnit = true
                display.draw(fast.position.x + grid.map.x,
                    fast.position.y + grid.map.y,
                    ents.appearance.char,
                    ents.appearance.color, "red")
            }else if(ents.has(components.LayerMap)){
                floor = ents
            }

            if(!gotUnit && floor){
                display.draw(fast.position.x + grid.map.x, 
                    fast.position.y + grid.map.y, 
                    floor.appearance.char, 
                    floor.appearance.color, "red")
            }
        })
    //if yes draw that tile with yellow background

    //just draw the tile with yellow background    
    })
    
}

export const DrawText = (text, x, y) => {
    display.drawText(x,y,text)
}

//x,y are offsets fetched from grid
export const DrawChar = (entity, x, y) => {
    // display.draw(grid.map.x + 5,  grid.map.y + 4, "@");
    display.draw(x, y,entity.appearance.char, entity.appearance.color, entity.appearance.background || "black")
}

export const renderBorder = () => {
    display.draw(0,0,'O')
    display.draw(0,grid.height-1,'O')
    display.draw(grid.width-1,0,'O')
    display.draw(grid.width-1,grid.height-1,'O')
}

export const render = () => {
    if(gameState == "Help"){
        DrawHelpMenu()
    }else if (gameState == "AbilityInfo"){
        ShowAbilityInfo(EntityToRender)
    }else if (gameState == "EnemyNumbers"){
        RenderEnemyNumbers()
    }else if ( gameState == "DamageShow"){
        RenderDamageNumbers()
    }else {
        clearDisplay()
        renderMap()
        renderObjects()
        renderUnits()
        renderActivePlayer()
        renderDieMenu()
        renderAbilityMenu()
        renderPhase()
        renderBorder()
        renderEnemyQuickBar()

        renderSlowAttacks()
        renderFastAttacks()

        //console.log(gameState)
        if(gameState === "examine" || gameState === "targeting" ) {
            //console.log("need to show target")
            renderTarget()
        }
    }
}