import {
    display,
    displayMsg,
    grid
  } from "../lib/canvas";
import * as components from "../state/component"

import world from "../state/ecs"
import { readCacheSet } from "../state/cache";
import {toCell, toLocId} from "../lib/grid"

import * as Town from "../state/town"
import * as Message from "../state/messagelog"
import * as Village from "./village"
import { hunterEntities, playerEntities,UnlockedHunts,villagerEntities } from "../index.js";

function ClearDisplay(){
    display.clear()
    renderBorder()
}

export const renderBorder = () => {
    display.draw(0,0,'O')
    display.draw(0,grid.height-1,'O')
    display.draw(grid.width-1,0,'O')
    display.draw(grid.width-1,grid.height-1,'O')
}


export const RenderTownCenter = () => {
    ClearDisplay()

    var index = Village.GetCurrentIndex()
    for(var x = 0; x < Village.villageOptions.length;x++){
        var text = (index == x) ? "* " + Village.villageOptions[x] : Village.villageOptions[x]
        display.drawText(grid.town.townMenu.x, grid.town.townMenu.y + x, text)
    }
}

export const RenderVillager = () =>{
    ClearDisplay()
    var index = Village.GetCurrentIndex()

    var villagers = villagerEntities.get()
    var hunters = hunterEntities.get()

    display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y,"Hunters "+hunters.length+"/4")
    for(var x = 0; x< hunters.length; x++){
        var vill = hunters[x]
        var textToDisplay = "%c{"+vill.appearance.color+"}"+vill.appearance.char
        if(index == x){
            textToDisplay = "* " + textToDisplay
        }
        display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y + x + 1, textToDisplay)

        if(index == x){
            RenderVillagerExamine(vill)
        }
    }

    display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y + hunters.length+2,"Villagers")
    for(var x = 0; x< villagers.length; x++){
        
        var vill = villagers[x]

        var textToDisplay = "%c{"+vill.appearance.color+"}"+vill.appearance.char
        if(index == x + hunters.length){
            textToDisplay = "* " + textToDisplay
        }
        display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y + x + 3 + hunters.length,textToDisplay)

        if(index == x + hunters.length){
            RenderVillagerExamine(vill)
        }
    }
}

export function RenderHunts(){
    ClearDisplay()

    var hunts = UnlockedHunts.get();
    for(var x = 0; x < hunts.length; x++){
        display.drawText(grid.town.villagerInfo.x, grid.town.villagerInfo.y, hunts[x].description.name)
    }
}

const RenderVillagerExamine = (villager) =>{
    display.drawText(grid.town.villagerInfo.x, grid.town.villagerInfo.y,  "%c{"+villager.appearance.color+"}"+villager.appearance.char)
}
