import {
    display,
    grid
  } from "../lib/canvas";

import {Appearance,Health,LayerMap,Position,
    LayerUnit,
    SlowAttack,
    FastAttack} from "../state/component"

import world from "../state/ecs";
import { readCacheSet } from "../state/cache";
import {toLocId} from "../lib/grid"
import {CurrrentActivePlayer, gameState, targetEntity} from "../index"

const layerMapEntities = world.createQuery({
    all: [Position, Appearance, LayerMap]
  });

  const layerUnitEntities = world.createQuery({
    all: [Position, Appearance, LayerUnit]
  });

  const slowDmgEntities = world.createQuery({
    all: [Position, SlowAttack]
  });

  const fastDmgEntities = world.createQuery({
    all: [Position, FastAttack]
  });



const clearDisplay = () => {
    display.clear()
    //clearCanvas(grid.map.x - 1, grid.map.y, grid.map.width + 1, grid.map.height);
    
};

const renderMap = () => {
    layerMapEntities.get().forEach((entity) => {
        DrawChar(entity,
            entity.position.x+grid.map.x,
            entity.position.y+grid.map.y)
    });
}



const renderObjects = () => {

}


const renderUnits = () => {
    // console.log(layerUnitEntities.get())
    layerUnitEntities.get().forEach((entity) => {
        DrawChar(entity,
            entity.position.x+grid.map.x,
            entity.position.y+grid.map.y)
    })
}

const renderActivePlayer = () => {
    if(CurrrentActivePlayer){
        var text = "Active:"
        DrawText(text,grid.activePlayer.x,grid.activePlayer.y )
        DrawChar(CurrrentActivePlayer,
            grid.activePlayer.x+ text.length,
            grid.activePlayer.y)

        DrawText("Hp:"+CurrrentActivePlayer.health.current.toString(),grid.activePlayer.x,grid.activePlayer.y+1)
        DrawText("Stam:"+CurrrentActivePlayer.stamina.current.toString()+"/"+CurrrentActivePlayer.stamina.max.toString(),grid.activePlayer.x,grid.activePlayer.y+2)
        DrawText("StamRgn:"+(Math.max(0,4 - CurrrentActivePlayer.stamina.used)).toString(),grid.activePlayer.x,grid.activePlayer.y+3)
        DrawText("Move:"+CurrrentActivePlayer.movement.movement.toString(),grid.activePlayer.x,grid.activePlayer.y+4)
        DrawText("Dodge:"+CurrrentActivePlayer.movement.dodge.toString(),grid.activePlayer.x,grid.activePlayer.y+5)
    }
}

const renderPhase = () => {
    DrawText(gameState, grid.phaseMenu.x,grid.phaseMenu.y)
}

const renderDieMenu = () => {
    if(CurrrentActivePlayer){
        for(var x = 0; x < CurrrentActivePlayer.die.length; x++){
            //console.log(CurrrentActivePlayer.die[x])
            //  1|3|
            //get color
            var color = "white"
            if(CurrrentActivePlayer.die[x].selected){
                color = "green"
            }else if(CurrrentActivePlayer.die[x].exhausted){
                color = "grey"
            }
            //display.draw(2+grid.dieMenu.x + (x*5), grid.dieMenu.y-1,'_')    
            DrawText((x+1).toString()+"|"+" "+"|", grid.dieMenu.x+ (x*5), grid.dieMenu.y)
            //console.log(CurrrentActivePlayer.die[x].number)
            display.draw(2+grid.dieMenu.x + (x*5), grid.dieMenu.y, CurrrentActivePlayer.die[x].number.toString(), "black", color)
        }
    }
}

const abilityHotkeys = ['q','w','e','r','t','y']

const renderAbilityMenu = () => {
    //for each ability make a button max of 3 char name 
    // q[mv] w[atk] e[dg]
    
    //if can use set to green?
    //if already used set to grey
    
    for(var x = 0; x < CurrrentActivePlayer.abilityList.abilities.length;x++){
        var color = "gray"

        if(CurrrentActivePlayer.abilityList.abilities[x].abilityFunction.function.canUse(null, CurrrentActivePlayer)){
            color = "white"
        }

        let smlName = CurrrentActivePlayer.abilityList.abilities[x].abilitySmallName.smallName
        DrawText(abilityHotkeys[x]+"[%c{"+color+"}"+smlName+"%c{}]",grid.abilityMenu.x + (x*7), grid.abilityMenu.y)
    }
}

const renderTarget = () => {
    //get the position of the targetEntity
    //get entities at position
    //for now just draw x at position
    console.log(targetEntity)
    DrawChar(targetEntity, 
        targetEntity.position.x+grid.map.x,
        targetEntity.position.y+grid.map.y)
}

const renderSlowAttacks = () => {
    slowDmgEntities.get().forEach(slow => {
    //check if unit exists on this tile.
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:slow.position.x,y:slow.position.y}))
        var gotUnit = false
        var floor
        getEntitiesAtLoc.forEach(eid => {
            var ents = world.getEntity(eid)
            if(ents.has(LayerUnit)){
                gotUnit = true
                display.draw(slow.position.x + grid.map.x,
                    slow.position.y + grid.map.y,
                    ents.appearance.char,
                    ents.appearance.color, "yellow")
            }else if(ents.has(LayerMap)){
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
            if(ents.has(LayerUnit)){
                gotUnit = true
                display.draw(fast.position.x + grid.map.x,
                    fast.position.y + grid.map.y,
                    ents.appearance.char,
                    ents.appearance.color, "red")
            }else if(ents.has(LayerMap)){
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
    clearDisplay()
    renderMap()
    renderObjects()
    renderUnits()
    renderActivePlayer()
    renderDieMenu()
    renderAbilityMenu()
    renderPhase()
    renderBorder()

    renderSlowAttacks()
    renderFastAttacks()

    console.log(gameState)
    if(gameState === "examine" || gameState === "targeting" ) {
        console.log("need to show target")
        renderTarget()
    }
}