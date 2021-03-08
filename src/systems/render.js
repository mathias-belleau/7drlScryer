import {
    display,
    grid
  } from "../lib/canvas";

import {Appearance,Health,LayerMap,Position,
    LayerUnit} from "../state/component"

import world from "../state/ecs";

import {CurrrentActivePlayer, gameState} from "../index"

const layerMapEntities = world.createQuery({
    all: [Position, Appearance, LayerMap]
  });

  const layerUnitEntities = world.createQuery({
    all: [Position, Appearance, LayerUnit]
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
        var text = "Active: "
        DrawText(text,grid.activePlayer.x,grid.activePlayer.y )
        DrawChar(CurrrentActivePlayer,
            grid.activePlayer.x+ text.length,
            grid.activePlayer.y)
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
                color == "grey"
            }
            //display.draw(2+grid.dieMenu.x + (x*5), grid.dieMenu.y-1,'_')    
            DrawText((x+1).toString()+"|"+" "+"|", grid.dieMenu.x+ (x*5), grid.dieMenu.y)
            //console.log(CurrrentActivePlayer.die[x].number)
            display.draw(2+grid.dieMenu.x + (x*5), grid.dieMenu.y, CurrrentActivePlayer.die[x].number.toString(), "black", color)
        }
    }
}

export const DrawText = (text, x, y) => {
    display.drawText(x,y,text)
}

//x,y are offsets fetched from grid
export const DrawChar = (entity, x, y) => {
    // display.draw(grid.map.x + 5,  grid.map.y + 4, "@");
    display.draw(x, y,entity.appearance.char, entity.appearance.color)
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
    renderPhase()
    renderBorder()
}