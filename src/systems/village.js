import {enemyEntities, GetGameState, SetGameState} from "../index"
import {RenderTownCenter,RenderVillager} from "./renderTown"
import gameTown from "../state/town"

const VillagePhases = ["townCenter","villager","crafting","chooseHunt","loadingTown"]

export function GetVillagePhases(){
    return VillagePhases
}

var currentSelectIndex = 0
export function GetCurrentIndex(){
    return currentSelectIndex
}
export function SetCurrentIndex(index){
    currentSelectIndex = index
}
export function ChangeCurrentIndex(amount, max){
    currentSelectIndex += amount
    if(currentSelectIndex >= max){
        currentSelectIndex = 0
    } else if(currentSelectIndex < 0) {
        currentSelectIndex = max -1
    }
}
export function DoVillagePhase(userInput){
    if(GetGameState() == "townCenter"){
        ProcessTownCenterInput(userInput)
    }else if (GetGameState() == "villager"){
        ProcessVillagerInput(userInput)
    }else if(GetGameState() == "crafting"){

    }else if (GetGameState() == "chooseHunt"){

    }else if (GetGameState() == "loadingTown"){
        RenderTownCenter()
        SetGameState("townCenter")
    }
}

export const villageOptions = ["a: villagers", "b: crafting", "c: go hunt"]
function ProcessTownCenterInput(userInput){
    if(!userInput){
        return
    }else if(userInput == "ArrowDown"){
        ChangeCurrentIndex(1, villageOptions.length)
        RenderTownCenter()
    }else if(userInput == "ArrowUp"){
        ChangeCurrentIndex(-1, villageOptions.length)
        RenderTownCenter()
    }else if(userInput == "a" || userInput == "b" || userInput == "c" || userInput == "Enter"){
        if(userInput == "a"){
            currentSelectIndex = 0
        } else if (userInput == "b"){
            currentSelectIndex = 1
        } else if (userInput == "c"){
            currentSelectIndex = 2
        }

        if(currentSelectIndex == 0){
            //look at villagers
            console.log("look at villagers")
            RenderVillager()
            SetGameState("villager")
        }else if (currentSelectIndex == 1){
            //look at crafting
            console.log("look at crafting")
        }else if (currentSelectIndex == 2){
            // look at hunts
            console.log("look at hunts")
        }else {
            console.error("how'd we get here?")
        }
    }
}

function ProcessVillagerInput(userInput){
    if(!userInput){
        return;
    }else if(userInput == "ArrowUp"){
        ChangeCurrentIndex(-1, gameTown.GetVillagers().length)
    }else if (userInput == "ArrowDown"){
        ChangeCurrentIndex(1, gameTown.GetVillagers().length)
    }else if (userInput == "Enter"){
        //swap hunter in and out
        var huntersEID = gameTown.GetHunters()
        var villagerEID = gameTown.GetVillagers()
        var villagersNotHunting = villagerEID.filter(eid => !huntersEID.includes(eid))
        var selectedVill
        if(currentSelectIndex < huntersEID.length){
            selectedVill = huntersEID[currentSelectIndex]
        }else {
            selectedVill = villagersNotHunting[currentSelectIndex - huntersEID.length]
        }
        if(huntersEID.includes(selectedVill)){
            //remove from hunters
            gameTown.RemoveHunter(selectedVill)
            ChangeCurrentIndex(-1, gameTown.GetVillagers().length)
        } else{
            //add to hunters
            huntersEID.push(selectedVill)
            ChangeCurrentIndex(1, gameTown.GetVillagers().length)

        }
    }else if(userInput == "Escape" || userInput == "Backspace"){
        SetGameState("loadingTown")
    }
    RenderVillager()
}