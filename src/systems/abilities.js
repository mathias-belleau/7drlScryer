import world from "../state/ecs";
import * as yahtzee from "./yahtzee"
import {gameState, targetEntity, SetQueuedAbility, ExamineTargetEnable, SetQueuedEntity} from "../index"
import { readCacheSet } from "../state/cache";
import {toLocId} from "../lib/grid"
import * as components from "../state/component"


export const Ability = {
    canUse: (ability,entity) => {
        //console.log('canUse')
        return yahtzee.CheckSingles(GetSelectedDie(entity))
    },
    onUse: (ability, entity) => {
        console.log('used')
        console.log(ability)
        console.log(ability.abilityPhase.phase)
        GetSelectedDie(entity)
        entity.fireEvent("gain-movement", 3)
        entity.fireEvent("exhaust-selected")
        
    },
    
}

export const AbilityMove = {
    canUse: (ability,entity) => {
        return yahtzee.CheckSingles(GetSelectedDie(entity))
    },
    onUse: (ability, entity) => {
        entity.fireEvent("gain-movement", 3);
        entity.fireEvent("exhaust-selected")
    },
}

export const AbilityDodge = {
    canUse: (ability,entity) => {
        return yahtzee.CheckDoubles(GetSelectedDie(entity))
    },
    onUse: (ability, entity) => {
        entity.fireEvent("gain-dodge", 1);
        entity.fireEvent("exhaust-selected")
    },
}

export const AbilitySwordJab = {
    canUse: (ability,entity) => {
        return yahtzee.CheckSingles(GetSelectedDie(entity))
    },
    onUse:(ability,entity) => {
        //get target!
        // var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:targetEntity.position.x,y:targetEntity.position.y}))
        // //apply atk to each tile within this attacks coords
        // console.log(getEntitiesAtLoc)
        // getEntitiesAtLoc.forEach(eid => {
        //     var fetchedEnt = world.getEntity(eid)
        //     console.log(fetchedEnt)
        //     if(fetchedEnt.has(components.LayerMap)){
        //         //this is our map tile ?
        //     }             
        // });

        //do ability
        //for each target create dmg tile
        console.log(ability)
        console.log(ability.abilityTarget.coords)
        ability.abilityTarget.coords.forEach(coord => {
            console.log(coord)
            var newDmgTile =  world.createEntity()
            newDmgTile.add(components.Position, {x:targetEntity.position.x + coord[0],y:targetEntity.position.y + coord[1]} )
            newDmgTile.add(components.FastAttack)
            newDmgTile.add(components.DmgTile)
        })
        entity.fireEvent("exhaust-selected")
        //set gamestate back
    }, 
    onTarget: (ability,entity) => {
        //set gameState to targeting
        //console.log(queuedAbility)
        SetQueuedAbility(ability)
        SetQueuedEntity(entity)
        //queuedAbility = ability
        ExamineTargetEnable("targeting")
    }
}

export const AbilitySwordSwing = {
    canUse: (ability,entity) => {
        return yahtzee.CheckSingles(GetSelectedDie(entity))
    },
    onUse:(ability,entity) => {
       
        //do ability
        //for each target create dmg tile
        ability.abilityTarget.coords.forEach(coord => {
            console.log(coord)
            var newDmgTile =  world.createEntity()
            newDmgTile.add(components.Position, {x:targetEntity.position.x + coord[0],y:targetEntity.position.y + coord[1]} )
            newDmgTile.add(components.SlowAttack)
            newDmgTile.add(components.DmgTile)
        })
        entity.fireEvent("exhaust-selected")
    }, 
    onTarget: (ability,entity) => {
        SetQueuedAbility(ability)
        SetQueuedEntity(entity)
        //queuedAbility = ability
        ExamineTargetEnable("targeting")
    }
}

const GetSelectedDie = (entity) => {
    let dieList = []
    for(var x = 0;x < entity.die.length; x++){
        if(entity.die[x].selected && !entity.die[x].exhausted){
            dieList.push(entity.die[x].number)
        }
    }

    dieList.sort()
    var counts = {};
    dieList.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    //console.log(counts)
    return counts;
}

