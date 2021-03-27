import world from "../state/ecs"
import * as yahtzee from "./yahtzee"
import { ExamineTargetEnable} from "../index"
import { readCacheSet } from "../state/cache";
import {toLocId} from "../lib/grid"
import * as components from "../state/component"
import * as Target from "./target"
import * as Projectile from "./projectile"
// import {FetchFreeTile, FetchFreeTileTarget} from "../state/dungeon"

export const Ability = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        //console.log('canUse')
        return yahtzee.CheckSingles(dice)
    },
    onUse: (ability, entity, target= null) => {
        // console.log('used')
        // console.log(ability)
        // console.log(ability.abilityPhase.phase)
        GetSelectedDie(entity)
        entity.fireEvent("gain-movement", 3)
        entity.fireEvent("exhaust-selected")
        
    },
    
}



export const AbilityDoNothing = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        //console.log('canUse')
        return yahtzee.CheckSingles(dice)
    },
    onUse: (ability, entity, target= null) => {
        return;
    },
    
}

export const AbilityMove = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        return yahtzee.CheckSingles(dice)
    },
    onUse: (ability, entity,target = null) => {
        //get selected die
        var selected = GetSelectedDie(entity)
        var toGain = 0
        for(var x = 1; x< 7;x++){
            if(selected[x] && selected[x] == 1){
                toGain = x
            }
        }
        entity.fireEvent("gain-movement", toGain);
        entity.fireEvent("exhaust-selected")
    },
}

export const AbilityDodge = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        return yahtzee.CheckDoubles(dice)
    },
    onUse: (ability, entity,target= null) => {
        entity.fireEvent("gain-dodge", 1);
        entity.fireEvent("exhaust-selected")
    },
}

export const AbilityShieldRaise = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        return yahtzee.CheckSingles(dice)
    },
    onUse: (ability, entity,target = null) => {
        entity.fireEvent("gain-armour", {armourAmt: 1})
        entity.fireEvent("exhaust-selected")
    },
}

export const AbilitySwordJab = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckDoubles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:GenericSlowAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilitySwordSwing = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckSingles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:GenericSlowAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilitySpearThrust = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckSingles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:(ability,entity,target= null) => {
        var coords = RotateCoords(ability, entity,target)
        //do ability
        //for each target create dmg tile
        coords.forEach(coord => {
            //console.log(coord)
            var newDmgTile =  world.createEntity()
            newDmgTile.add(components.Position, {x:entity.position.x + coord[0],y:entity.position.y + coord[1]} )
            newDmgTile.add(components.SlowAttack)
            newDmgTile.add(components.DmgTile)
        })
        entity.fireEvent("exhaust-selected")
        if(ability.has(components.AbilityEndsTurn)){
            entity.add(components.IsTurnEnd)
        }
    }, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilityDoubleAxeSwing = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckDoubles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:GenericSlowAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilityFlameHands = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckStraight(dice, 3)
    },
    onUse:GenericSlowAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}


export const AbilitySummonGoblin = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckStraight(dice, 3)
    },
    onUse:GenericSummon
   
}

export const AbilityAxeDecapitate = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckDoubles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:GenericFastAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilityBowShot = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckDoubles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:GenericProjectile, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilityOgreSmash = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckDoubles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:GenericSlowAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

export const AbilityOgreRockThrow = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckDoubles(dice, ability.abilityAllowedDie.allowed)
    },
    onUse:(ability,entity,target) => {
        GenericSlowAttack(ability,entity,target);
        entity.abilityList.abilities[0][1] = 0
    }, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    }
}

function GenericProjectile(ability,entity,target = null){
    var coords = RotateCoords(ability,entity,target);

    //for each target coords make a projectile
    // coords.forEach(coord => {
        var newPath = Projectile.CreateNewPath(ability,entity, target)
    // 

    entity.fireEvent("exhaust-selected")
    if(ability.has(components.AbilityEndsTurn)){
        entity.add(components.IsTurnEnd)
    }
}

function GenericSlowAttack(ability,entity,target= null) {
    var coords = RotateCoords(ability, entity,target)
    //do ability
    //for each target create dmg tile
    coords.forEach(coord => {
        //console.log(coord)
        var newDmgTile =  world.createEntity()
        newDmgTile.add(components.Position, {x:entity.position.x + coord[0],y:entity.position.y + coord[1]} )
        newDmgTile.add(components.SlowAttack)
        newDmgTile.add(components.DmgTile, {dmg: ability.abilityDamage.dmg})
    })
    entity.fireEvent("exhaust-selected")
    if(ability.has(components.AbilityEndsTurn)){
        entity.add(components.IsTurnEnd)
    }
}

function GenericFastAttack(ability,entity,target= null) {
    var coords = RotateCoords(ability, entity,target)
    //do ability
    //for each target create dmg tile
    coords.forEach(coord => {
        //console.log(coord)
        var newDmgTile =  world.createEntity()
        newDmgTile.add(components.Position, {x:entity.position.x + coord[0],y:entity.position.y + coord[1]} )
        newDmgTile.add(components.FastAttack)
        newDmgTile.add(components.DmgTile, {dmg: ability.abilityDamage.dmg})
    })
    entity.fireEvent("exhaust-selected")

    if(ability.has(components.AbilityEndsTurn)){
        entity.add(components.IsTurnEnd)
    }
}

function GenericSummon(ability,entity,target=null){
    return
    // for(var x = 0; x < ability.abilitySummon.amount; x++){
    //     //get free tile near summoner
    //     var freeTile = FetchFreeTileTarget({x:entity.position.x,y:entity.position.y},4)
    //     if(!freeTile){
    //         continue;
    //     }
    //     //create a new prefab and attach duration to it
    //     SpawnScenarioUnits(ability.abilitySummon.prefab, entity.has(components.IsEnemy), freeTile)
    // }
    
}

export const GetSelectedDie = (entity) => {
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

export const GetAllDie = (entity) => {
    let dieList = []
    //console.log("AI DICE")
    for(var x = 0;x < entity.die.length; x++){
        if(!entity.die[x].exhausted){
            dieList.push(entity.die[x].number)
        }
    }

    dieList.sort()
    //console.log(dieList.toString())
    var counts = {};
    dieList.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    //console.log(counts)
    return counts;
}

export const RotateCoords = (ability, entity, target) => {
    //do we need to rotate coords?
    var diffX = target.x - entity.position.x  
    var diffY = target.y - entity.position.y;
    var coords = []
    if(ability.has(components.AbilityProjectile) ){
        coords = [...ability.abilityProjectile.path];
    }else{
        coords = [...ability.abilityTarget.coords];
    }
    var multi = (entity.has(components.MultiTileHead)) ? 1 : 0;
    var newCoords = [...coords]
    //console.log("before rotate")
    //console.log(coords)
    //console.log("direction")
    if(diffY <= -1){
        //console.log("up")
    }else if( (diffY >= 1 && !entity.has(components.MultiTileHead) ) || (entity.has(components.MultiTileHead) && diffY >= 2)){
        //console.log("down")
        newCoords = ConvertCoordsDown(coords,multi)
    }else if(diffX <= -1){
        //console.log("left")
        newCoords = ConvertCoordsLeft(coords,multi)
    }else if( (diffX >= 1 && !entity.has(components.MultiTileHead)) || (entity.has(components.MultiTileHead) && diffX >= 2)){
        //console.log("right")
        newCoords = ConvertCoordsRight(coords,multi)
    }
    //console.log("after rotate")
     console.log(coords)
    return newCoords
}

export const RotateCoordsDirection = (ability, entity, target) => {
    //do we need to rotate coords?
    var diffX = target.x - entity.position.x  
    var diffY = target.y - entity.position.y;
    var coords = []
    if(ability.has(components.AbilityProjectile) ){
        coords = [...ability.abilityProjectile.path];
    }else{
        coords = [...ability.abilityTarget.coords];
    }
    var multi = (entity.has(components.MultiTileHead)) ? 1 : 0;
    var newCoords = [...coords]
    //console.log("before rotate")
    //console.log(coords)
    //console.log("direction")
    if(diffY <= -1){
        return "up"
    }else if( (diffY >= 1 && !entity.has(components.MultiTileHead) ) || (entity.has(components.MultiTileHead) && diffY >= 2)){
        //console.log("down")
        return "down"
    }else if(diffX <= -1){
        //console.log("left")
        return "left"
    }else if( (diffX >= 1 && !entity.has(components.MultiTileHead)) || (entity.has(components.MultiTileHead) && diffX >= 2)){
        //console.log("right")
        return "right"
    }
}

const ConvertCoordsRight = (coords, multi = 0) => {
    var newRight = []
    coords.forEach( (co) => {
        var holder = []
        holder.push(co[1])
        holder.push(co[0])
        holder[0] = holder[0] * -1
        holder[0] += multi
        holder[1] = holder[1] * 1
        newRight.push(holder)
    })
    return newRight
}

const ConvertCoordsLeft = (coords, multi = 0) => {
    var newRight = []
    coords.forEach( (co) => {
        var holder = []
        holder.push(co[1])
        holder.push(co[0])
        //holder[0] = holder[0] * -1
        holder[1] = holder[1] * -1
        holder[1] += multi
        newRight.push(holder)
    })
    return newRight
}

const ConvertCoordsDown = (coords, multi = 0) => {
    var newRight = []
    coords.forEach( (co) => {
        var holder = []
        holder = [...co]
        holder[0] = holder[0] * -1
        holder[1] = holder[1] * -1
        holder[1] += multi
        holder[0] += multi
        newRight.push(holder)
    })
    return newRight
}