import {
    display,
    displayMsg,
    grid
  } from "../lib/canvas";

import * as components from "../state/component"

import world from "../state/ecs"
import { readCacheSet } from "../state/cache";
import {toCell, toLocId} from "../lib/grid"
import {CurrrentActivePlayer, gameState} from "../index"
import * as Target from "./target"
import gameTown from "../state/town"
import {DrawHelpMenu,ShowAbilityInfo,ShowMessageLog} from "../state/helpMenu"
import * as Projectile from "./projectile";
import * as Message from "../state/messagelog"
import { Display } from "rot-js";

const slowDmgEntities = world.createQuery({
    all: [components.Position, components.SlowAttack]
  });
  
  const fastDmgEntities = world.createQuery({
    all: [components.Position, components.FastAttack]
  });

const layerMapEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerMap]
  });
  
   const layerUnitEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit]
  });

  const layerItemEntities = world.createQuery({
    all: [components.LayerItem, components.Appearance, components.Position]
  })

   const allyEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit],
    none: [components.IsEnemy, components.IsPlayerControlled, components.MultiTileBody]
  })
  
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
    layerItemEntities.get().forEach(entity => {
        DrawChar(entity,
            entity.position.x+grid.map.x,
            entity.position.y+grid.map.y)
    })
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
    var active = gameTown.GetActive();
    var hunters = gameTown.GetHunters()
    var displayedActive = 0 //if true add 10 to y
    DrawText("#########",grid.activePlayer.x, grid.activePlayer.y-1)
    for(var x =0;x < hunters.length; x++){
        if(hunters[x] == active.id){
            var text = "Active:"
                DrawText(text,grid.activePlayer.x,grid.activePlayer.y +x )
                DrawChar(gameTown.GetActive(),
                    grid.activePlayer.x+ text.length,
                    grid.activePlayer.y+x)
        
                DrawText("Hp:"+gameTown.GetActive().health.current.toString(),grid.activePlayer.x,grid.activePlayer.y+1 +x)
                DrawText("Stam:"+gameTown.GetActive().stamina.current.toString()+"/"+gameTown.GetActive().stamina.max.toString(),grid.activePlayer.x,grid.activePlayer.y+2+x)
                DrawText("StamRgn:"+(Math.max(0,gameTown.GetActive().stamina.regen - gameTown.GetActive().stamina.used)).toString(),grid.activePlayer.x,grid.activePlayer.y+3+x)
                DrawText("Move:"+gameTown.GetActive().movement.movement.toString(),grid.activePlayer.x,grid.activePlayer.y+4+x)
                DrawText("Dodge:"+gameTown.GetActive().movement.dodge.toString(),grid.activePlayer.x,grid.activePlayer.y+5+x)
        
                DrawText("-Armour-",grid.activePlayer.x,grid.activePlayer.y+6+x)
                DrawText(gameTown.GetActive().armour.weight,grid.activePlayer.x,grid.activePlayer.y+7+x)
                DrawText("Amount: "+gameTown.GetActive().armour.amount,grid.activePlayer.x,grid.activePlayer.y+8+x)
                DrawText(GetArmourString(gameTown.GetActive()),grid.activePlayer.x,grid.activePlayer.y+9+x)
            //this is active hunter do normal display
            displayedActive = 10
        }else {
            var hunt = gameTown.GetVillager(hunters[x])
            //do quick display
            var text = "#"
            text += "%c{"+hunt.appearance.color +"}"+hunt.appearance.char + "%c{} "
            text += "%c{red}"+hunt.health.current+"%c{} "
            text += "%c{white}"+hunt.stamina.current+"%c{} "
            text += "%c{green}"+hunt.armour.amount+"%c{}#"
            DrawText(text, grid.activePlayer.x, grid.activePlayer.y + x + displayedActive)

        }
    }
    DrawText("#########",grid.activePlayer.x, grid.activePlayer.y+14)
    // if(gameTown.GetActive()){
    //    
}
const GetArmourString = (entity) => {
    var armString = "Arm:"
    if(entity.has(components.Armour) && entity.armour.weight != "None"){
        var armourRating = entity.armour.weight;
        entity.armourDie.forEach( armDie => {
            if(armourRating == "Light" && armDie.number >= 6){
                armString+= "%c{green}"+armDie.number.toString() + "%c{}"
            }else if(armourRating == "Medium" && armDie.number >= 5){
                armString+= "%c{green}"+armDie.number.toString() + "%c{}"
            }else if(armourRating == "Heavy" && armDie.number >= 4){
                armString+= "%c{green}"+armDie.number.toString() + "%c{}"
            }else{
                armString+= "%c{}"+armDie.number.toString() + "%c{}"
            }
        })
            
    }
    return armString

}
const renderPhase = () => {
    for(var x = 0; x<20;x++){
        display.draw(grid.phaseMenu.x + x, grid.phaseMenu.y, " ")
    }
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
            DrawText((x+1).toString()+"|"+" "+"|", grid.dieMenu.x+ ( (x%4) * 5) , grid.dieMenu.y + Math.floor(x/4))
            //console.log(CurrrentActivePlayer.die[x].number)
            display.draw(2+grid.dieMenu.x + ( (x%4) * 5), grid.dieMenu.y + Math.floor(x/4), gameTown.GetActive().die[x].number.toString(), "black", color)
        }
    }
}
//x = 0 = 0
//x = 1 = 0
//x = 2 = 5
//x = 3 = 5
//x = 4 = 10
//x = 5 = 10
//x = 6 = 15
//x = 7 = 15

const abilityHotkeys = ['q','w','e','r','t','y']

const renderAbilityMenu = () => {

    var activeHunter = gameTown.GetActive()
    var abilMap = gameTown.GetCurrentHunterAbilityMap()
    var DefIndex =0
    var AtkIndex = 0
    for (const [key, value] of Object.entries(abilMap)) {
        var color = "gray"
        var currAbility = activeHunter.abilityGrabBagList.abilities[value]
        if(gameTown.GetActive().abilityGrabBagList.abilities[value].abilityFunction.function.canUse(
            gameTown.GetActive().abilityGrabBagList.abilities[value],
            gameTown.GetActive()).length > 0) {
                color = "white"
        }

        let smlName = gameTown.GetActive().abilityGrabBagList.abilities[value].abilitySmallName.smallName
        DrawText("Def:",grid.abilityMenu.x, grid.abilityMenu.y)
        DrawText("Atk:",grid.abilityMenu.x, grid.abilityMenu.y+1)
        
        if(currAbility.abilityPhase.phase == "Attack"){
            //display in first row
            DrawText(key+"[%c{"+color+"}"+smlName+"%c{}]",grid.abilityMenu.x + (AtkIndex*7) +4, grid.abilityMenu.y+1)
            AtkIndex++;
        }else {
            DrawText(key+"[%c{"+color+"}"+smlName+"%c{}]",grid.abilityMenu.x + (DefIndex*7) +4 , grid.abilityMenu.y)
            DefIndex++;
        }
    }

}

const renderProjectiles = () =>{
    var projectileList = Projectile.GetProjectileList()
    projectileList.forEach(pathList => {
        console.log(pathList)
        pathList.paths.forEach(path =>{
            if(!path.has(components.Invisible)){
                DrawChar(path,
                    path.position.x + grid.map.x,
                    path.position.y + grid.map.y)
            }
        })
    })
}

const renderTarget = () => {
    //get the position of the targetEntity
    //get entities at position
    //for now just draw x at position
    //console.log(targetEntity)
    Target.GetTargetEntities().forEach(targEnt => {
        if(targEnt.isDestroyed){
            return;
        }
        DrawChar(targEnt,
            targEnt.position.x + grid.map.x,
            targEnt.position.y+grid.map.y)
    })
 

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

const renderMessageLog = () =>{
    displayMsg.clear()
    console.log(displayMsg)
    var msgs = Message.GetLogs(5);
    for(var y = 0; y < msgs.length; y++){
        displayMsg.drawText(grid.messageLog.x, grid.messageLog.y + y, msgs[y])
    }
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
    }else if(gameState == "MessageLog"){
        ShowMessageLog()
    }else if (gameState == "AbilityInfo"){
        ShowAbilityInfo(EntityToRender)
    }else if (gameState == "EnemyNumbers"){
        renderPhase()
        RenderEnemyNumbers()
    }else if ( gameState == "DamageShow"){
        renderPhase()
        RenderDamageNumbers()
    }else {
        clearDisplay()
        renderMessageLog()
        renderMap()
        renderObjects()
        renderUnits()
        renderActivePlayer()
        renderDieMenu()
        renderAbilityMenu()
        renderPhase()
        renderBorder()
        renderEnemyQuickBar()

        renderProjectiles()

        renderSlowAttacks()
        renderFastAttacks()

        //console.log(gameState)
        if(gameState === "examine" || gameState === "targeting" ) {
            //console.log("need to show target")
            renderTarget()
        }
    }
}