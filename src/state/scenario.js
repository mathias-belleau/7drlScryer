//list of all the scenarios as well as their handler
//and hunts
import world from "./ecs"
import * as components from "../state/component"


export var HuntList = {}
var CurrentHunt
var CurrentHuntPhase = 0

export const GetCurrentHunt = () => {
    return CurrentHunt
}

export const GetCurrentScenario = () => {
    return CurrentHunt.huntScenarios.scenarios[CurrentHuntPhase]
}

export const StartNextScenario = () => {
    CurrentHuntPhase++;
    return CurrentHuntPhase >= CurrentHunt.huntScenarios.scenarios.length //is this the final scenario?
}

export const StartHunt = (huntName) => {
    CurrentHunt = HuntList[huntName]
    console.log(CurrentHunt)
}

export const SetupHunts = () => {
    var newHunt = world.createPrefab("Hunt")
    var scenarios = []
    console.log(newHunt)
    for(var x = 0; x< newHunt.huntScenarios.scenarios.length;x++){
        let newScen = world.createPrefab(newHunt.huntScenarios.scenarios[x])
        console.log(newScen)
        scenarios.push(newScen)
        console.log(scenarios)
    }

    newHunt.huntScenarios.scenarios = scenarios
    console.log(newHunt.huntScenarios.scenarios)
    HuntList["Hunt"] = newHunt
}

export const UnlockHunt = (huntName) => {
    HuntList[huntName].add(components.HuntUnlocked)
}

