import {
    display,
    displayMsg,
    grid
  } from "../lib/canvas";
import * as components from "../state/component"

import world from "../state/ecs"
import { readCacheSet } from "../state/cache";
import {toCell, toLocId} from "../lib/grid"

import gameTown from "../state/town"
import * as Message from "../state/messagelog"
import * as Village from "./village"

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

    var villagerEID = gameTown.GetVillagers()
    var huntersEID = gameTown.GetHunters()

    display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y,"Hunters")
    for(var x = 0; x< huntersEID.length; x++){
        var vill = gameTown.GetVillager(huntersEID[x])
        display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y + x + 1, "%c{"+vill.appearance.color+"}"+vill.appearance.char)

        if(index == x){
            RenderVillagerExamine(vill)
        }
    }

    display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y + huntersEID.length+2,"Villagers")
    var villagersNotHunting = villagerEID.filter(eid => !huntersEID.includes(eid))
    for(var x = 0; x< villagersNotHunting.length; x++){
        
        var vill = gameTown.GetVillager(villagersNotHunting[x])
        display.drawText(grid.town.villagerMenu.x, grid.town.villagerMenu.y + x + 3 + huntersEID.length, "%c{"+vill.appearance.color+"}"+vill.appearance.char)

        if(index == x + huntersEID.length){
            RenderVillagerExamine(vill)
        }
    }

}

const RenderVillagerExamine = (villager) =>{
    display.drawText(grid.town.villagerInfo.x, grid.town.villagerInfo.y,  "%c{"+villager.appearance.color+"}"+villager.appearance.char)
}
