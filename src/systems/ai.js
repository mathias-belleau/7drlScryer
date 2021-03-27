import {GetSelectedDie, GetAllDie, RotateCoords} from "./abilities"
import {readCacheSet} from "../state/cache"
import world from "../state/ecs"

import * as components from "../state/component"
import {AiPathfind,CheckStraightLine} from "./pathfinding"
import {toLocId} from "../lib/grid"


export const DoAiTurnAttack = (entity) => {
    
    //for each attack ability check if we can use
    if(entity.abilityGrabBagList.abilities.length > 0){
        var abilitiesToUse = entity.abilityGrabBagList.abilities.pop()
        console.log(abilitiesToUse.description)
        ChooseAiAttack(entity,abilitiesToUse)
    }
}

const ChooseAiAttack = (entity,abilityToUse) => {
    //get closest target for now
    // var target = AiPathfind(entity)
    var attacked = false

    console.log("Doing mob attack: ")
    for(var x = 0; x < 2;x ++){
        var target = AiPathfind(entity)
        if(!target || target.length == 0){
            return;
        }

        var noAlly = true;
        const entityIsEnemy = entity.has(components.IsEnemy)

        for(var coord = 0; coord < target.length; coord++){
            var entitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:target[coord][0],y:target[coord][1]}))
            entitiesAtLoc = Array.from(entitiesAtLoc)
            for(var ents = 0;ents < entitiesAtLoc.length;ents++){
                
                var entityAtLoc = world.getEntity(entitiesAtLoc[ents])
                // console.log(entityAtLoc)
                // console.log(entityAtLoc.has(components.IsEnemy))
                if(entityAtLoc.has(components.LayerUnit) && entityAtLoc.has(components.IsEnemy) == entityIsEnemy && entity.id != entitiesAtLoc[ents]){
                    noAlly = false
                }
            }
        }

        //no longer need?  && CheckStraightLine(target, {x:entity.position.x,y:entity.position.y}) 
        //make sure we are not standing on top of target
        // make sure we are in range
        // we haven't already attacked
        // check if this is a straight line to remove diag attacks
        //check that no allies are in the path of target?
        var checkRange = CheckInRange(abilityToUse, entity, target) ;
        if(target.length >= 1 && checkRange
            && !attacked
            && noAlly
            ){
            //we are in range
            console.log("In Range")
            
            //var targ = target.pop()
            // console.log(targ.toString())

            abilityToUse.abilityFunction.function.onUse(abilityToUse, entity, {x:target[0][0],y:target[0][1]})

            attacked = true
        }
        if(target.length > 1 && !attacked){
            //move towards enemy
            console.log("Not In Range so we move")
            
            if(target.length > 1 ){
                MoveForward(abilityToUse, entity, target)
            }
        }
    }    
}

const CheckInRange = (ability, entity, target) => {
    var coords = RotateCoords(ability,entity,{x:target[0][0], y:target[0][1]})
    //if (target[0] - all the coords == entity.x we are in range!)
    for(var x = 0; x < coords.length; x++){
        if(entity.position.x == target[0][0] - coords[x][0] && entity.position.y == target[0][1] - coords[x][1]) {
            return true
        }
    }
    return false
}

const MultiTileTargetCoords = [ [0,-1], [1,-1], [-1,0], [-1,1], [2,0], [2,1], [0,2], [1,2] ]
const CheckMultiTileMove = (entity, target) => {
    for(var x = 0; x < MultiTileTargetCoords.length; x++){
        if(target[0][0] == MultiTileTargetCoords[x][0] + entity.position.x && target[0][1] == MultiTileTargetCoords[x][1] + entity.position.y){
            return true
        }
    }
    return false
}

const MoveForward = (ability, entity, target) => {
    //DEBUG: give +1 movement
    entity.fireEvent("gain-movement", 2)

    //find nearest player

    var y = entity.movement.movement
    for(var x = 0; x < y;x++){
        if(ability.has(components.AbilityProjectile) && CheckInRange(ability, entity, target)){
            continue;
        }
        if(target && target.length > 1  && !(entity.has(components.MultiTileHead) && CheckMultiTileMove(entity,target))){
            //console.log("remaining target")
            //console.log(target.toString())
            //did we find a target? walk towards the last
            var nextStep = target.pop()
            //console.log("Next Step" + nextStep.toString())
            
            //convert to a step from position
            entity.movement.x = nextStep[0] - entity.position.x
            entity.movement.y = nextStep[1] - entity.position.y 
            var handled = entity.fireEvent("attempt-move")
            if(handled){
                //use 1 stamina
                // entity.fireEvent("use-stamina",1)
                // entity.fireEvent("ai-use-stamina",1)
            }

        }
    }
}

const StaminaCost = (entity, amount) => {
    entity.fireEvent("use-stamina", amount)
}

const SelectDie = (entity, amount) => {

}

const GetDie = (entity) => {
    let dieList = []
    for(var x = 0;x < entity.die.length; x++){
        if(!entity.die[x].exhausted){
            dieList.push(entity.die[x].number)
        }
    }

    dieList.sort()
    var counts = {};
    dieList.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    ////console.log(counts)
    return counts;
}

Object.defineProperty(Array.prototype, 'shuffle', {
    value: function() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
        return this;
    }
});