import world from "../state/ecs"
import * as yahtzee from "./yahtzee"
import { ExamineTargetEnable, SpawnUnits, allyEntities, friendlyEntities, enemyEntities, layerItemEntities} from "../index"
import { readCacheSet } from "../state/cache";
import {toLocId} from "../lib/grid"
import * as components from "../state/component"
import * as Target from "./target"
import * as Projectile from "./projectile"
import * as ROT from "rot-js"

import * as Units from "./units"

// import {FetchFreeTile, FetchFreeTileTarget,SpawnScenarioUnits} from "../state/dungeon"

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
        Units.GainMovement(entity, 3)
        Units.ExhaustSelectedStamina(entity)
        
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
        //check weight system
        var allowed = [1,2,3,4,5,6]
        if(entity.has(components.Armour)){
            if(entity.armour.weight == "Light"){
                allowed = [1,2,3,4,5]
            }else if(entity.armour.weight == "Medium"){
                allowed = [1,2,3,4,]
            }else if(entity.armour.weight == "Heavy"){
                allowed = [1,2,3]
            } 
        }
        return yahtzee.CheckSingles(dice, allowed)
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
        Units.GainMovement(entity, toGain)
        Units.ExhaustSelectedStamina(entity)
    },
}

export const AbilityDodge = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
         //check weight system
         var allowed = [1,2,3,4,5,6]
         if(entity.has(components.Armour)){
             if(entity.armour.weight == "Light"){
                 allowed = [1,2,3,4,5]
             }else if(entity.armour.weight == "Medium"){
                 allowed = [1,2,3,4,]
             }else if(entity.armour.weight == "Heavy"){
                 allowed = [1,2,3]
             }
         }
        return yahtzee.CheckDoubles(dice,allowed )
    },
    onUse: (ability, entity,target= null) => {
        // entity.fireEvent("gain-dodge", 1);
        Units.GainDodge(1)
        Units.ExhaustSelectedStamina(entity)
    },
}

export const AbilityShieldRaise = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        return yahtzee.CheckSingles(dice)
    },
    onUse: (ability, entity,target = null) => {
        Units.GainArmour(entity,1)
        Units.ExhaustSelectedStamina(entity)
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
    },
    targets: GenericTargetEnemies
}

export const AbilityMinorBlessing = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckStraight(dice, 3)
    },
    onUse:(ability, entity,target= null) => {
        //find a unit here
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:target.x,y:target.y}))
        getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
        for(var x = 0; x < getEntitiesAtLoc.length; x++){
            var ent = world.getEntity(getEntitiesAtLoc[x])
            if(ent.has(components.Health)){
                Units.Heal(ent, 1)
                Units.GainArmour(ent,1)
            }
        }

        Units.ExhaustSelectedStamina(entity)
        if(ability.has(components.AbilityEndsTurn)){
            entity.add(components.IsTurnEnd)
        }
    }, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    },
    targets: GenericTargetEnemies
}

export const AbilityMajorHeal = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckStraight(dice, 4)
    },
    onUse:(ability, entity,target= null) => {
        //find a unit here
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:target.x,y:target.y}))
        getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
        for(var x = 0; x < getEntitiesAtLoc.length; x++){
            var ent = world.getEntity(getEntitiesAtLoc[x])
            if(ent.has(components.Health)){
                Units.Heal(ent, 3)
            }
        }

        Units.ExhaustSelectedStamina(entity)
        if(ability.has(components.AbilityEndsTurn)){
            entity.add(components.IsTurnEnd)
        }
    }, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    },
    targets: GenericTargetEnemies
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
    },
    targets: GenericTargetEnemies
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
        Units.ExhaustSelectedStamina(entity)
        if(ability.has(components.AbilityEndsTurn)){
            entity.add(components.IsTurnEnd)
        }
    }, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    },
    targets: GenericTargetEnemies
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
    },
    targets: GenericTargetEnemies
}

export const AbilityFlameHands = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckStraight(dice, 4)
    },
    onUse:GenericSlowAttack, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    },
    targets: GenericTargetEnemies
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

export const AbilityAnimateDead = {
    canUse: (ability,entity, dice = GetSelectedDie(entity)) => {
        if(entity.has(components.IsTurnEnd)){
            return false
        }
        return yahtzee.CheckStraight(dice, 3)
    },
    onUse:(ability, entity,target= null) => {
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:target.x,y:target.y}))
        getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
        for(var x = 0; x < getEntitiesAtLoc.length; x++){
            var currentEnt = world.getEntity(getEntitiesAtLoc[x])
            if(currentEnt.has(components.IsDead)){
                //bring back to life
                Units.Reanimate(currentEnt, entity.has(components.IsEnemy))
                return;
            }
            
        }


    }, 
    onTarget: (ability,entity) => {
        Target.SetupTargetEntities(ability,entity)
        ExamineTargetEnable("targeting")
    },
    targets: (ability, entity) => {
        //get a list of all corpse entites
        var possibleTargs = []
        layerItemEntities.get().forEach( item => {
            if(item.appearance.char == '%'){
                //check if any entity on this location is block
                var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:item.position.x,y:item.position.y}))
                getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
                var blocked = false
                for(var x = 0; x < getEntitiesAtLoc.length; x++){
                    var ent = world.getEntity(getEntitiesAtLoc[x])
                    if(ent.has(components.IsBlocking)){
                        blocked = true
                    }
                }
                if(!blocked){
                    possibleTargs.push(item)
                }
            }
        })
        return possibleTargs
    }
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
    },
    targets: GenericTargetEnemies
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
    },
    targets: GenericTargetEnemies
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
    },
    targets: GenericTargetEnemies
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
    },
    targets: GenericTargetEnemies
}

function GenericProjectile(ability,entity,target = null){
    var coords = RotateCoords(ability,entity,target);

    //for each target coords make a projectile
    // coords.forEach(coord => {
        var newPath = Projectile.CreateNewPath(ability,entity, target)
    // 

    Units.ExhaustSelectedStamina(entity)
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
    Units.ExhaustSelectedStamina(entity)
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
    Units.ExhaustSelectedStamina(entity)

    if(ability.has(components.AbilityEndsTurn)){
        entity.add(components.IsTurnEnd)
    }
}

function GenericSummon(ability,entity,target=null){
    for(var x = 0; x < ability.abilitySummon.amount; x++){
        //get free tile near summoner
        SpawnUnits(ability,entity)
    }

    Units.ExhaustSelectedStamina(entity)

    if(ability.has(components.AbilityEndsTurn)){
        entity.add(components.IsTurnEnd)
    }
    
}

//target functions
function GenericTargetEnemies (entity) {
    if(entity.has(components.IsEnemy)){
        return ROT.RNG.shuffle(friendlyEntities.get())
    }else {
        return ROT.RNG.shuffle(enemyEntities.get())
    }
}

//end target functions

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