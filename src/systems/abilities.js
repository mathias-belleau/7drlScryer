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
        return yahtzee.CheckSingles(GetSelectedDie(entity), ability.abilityAllowedDie.allowed)
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

        var coords = RotateCoords(ability, entity)

        
        //create dmg tiles
        coords.forEach(coord => {
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
        return yahtzee.CheckSingles(GetSelectedDie(entity), ability.abilityAllowedDie.allowed)
    },
    onUse:(ability,entity) => {
        var coords = RotateCoords(ability, entity)
        //do ability
        //for each target create dmg tile
        coords.forEach(coord => {
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

const RotateCoords = (ability, entity) => {
    //do we need to rotate coords?
    var diffX = targetEntity.position.x - entity.position.x  
    var diffY = targetEntity.position.y - entity.position.y;
    var coords = ability.abilityTarget.coords;
    console.log("before rotate")
    console.log(coords)
    console.log("direction")
    if(diffY == -1){
        console.log("up")
    }else if(diffY == 1){
        console.log("down")
        coords = ConvertCoordsDown(coords)
    }else if(diffX == -1){
        console.log("left")
        coords = ConvertCoordsLeft(coords)
    }else if(diffX == 1){
        console.log("right")
        coords = ConvertCoordsRight(coords)
    }
    console.log("after rotate")
    console.log(coords)
    return coords
}

const ConvertCoordsRight = (coords) => {
    var newRight = []
    coords.forEach( (co) => {
        var holder = []
        holder.push(co[1])
        holder.push(co[0])
        holder[0] = holder[0] * -1
        holder[1] = holder[1] * 1
        newRight.push(holder)
    })
    return newRight
}

const ConvertCoordsLeft = (coords) => {
    var newRight = []
    coords.forEach( (co) => {
        var holder = []
        holder.push(co[1])
        holder.push(co[0])
        //holder[0] = holder[0] * -1
        holder[1] = holder[1] * -1
        newRight.push(holder)
    })
    return newRight
}

const ConvertCoordsDown = (coords) => {
    var newRight = []
    coords.forEach( (co) => {
        var holder = []
        holder = [...co]
        holder[0] = holder[0] * -1
        holder[1] = holder[1] * -1
        newRight.push(holder)
    })
    return newRight
}