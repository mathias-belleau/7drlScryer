import {GetSelectedDie, GetAllDie} from "./abilities"
import {readCacheSet} from "../state/cache"
import world from "../state/ecs"
import * as components from "../state/component"
import {AiPathfind,CheckStraightLine} from "./pathfinding"
import {toLocId} from "../lib/grid"

export const DoAiTurnDefend = (entity) => {
    var abilitiesCanUse = []
    //for each defense ability check if we can use
    var stamina = entity.stamina.current;
    
    console.log("AI usable stamina")
    console.log(entity)
    console.log(stamina)

    entity.abilityList.abilities.forEach( abil => {
        //split the dice counts, if any return true add to can use and continue
        console.log(abil.abilityStaminaCost)
        if( (abil.abilityPhase.phase == "Any" || abil.abilityPhase.phase == "Defend") && stamina >= abil.abilityStaminaCost.amount){
            //we have enough to use this
            abilitiesCanUse.push(abil)
        }
    })
    console.log("ai usable abilities")
    console.log(abilitiesCanUse)
    ChooseAiDefend(entity, abilitiesCanUse)

}

export const DoAiTurnAttack = (entity) => {

    var abilitiesCanUse = []
    //for each defense ability check if we can use
    var stamina = entity.stamina.current;
    
    console.log("AI usable stamina")
    console.log(entity)
    console.log(stamina)

    entity.abilityList.abilities.forEach( abil => {
        //split the dice counts, if any return true add to can use and continue
        if( (abil.abilityPhase.phase == "Any" || abil.abilityPhase.phase == "Attack") && abil.abilityStaminaCost.amount <= entity.stamina.current){
            //we have enough to use this
            abilitiesCanUse.push(abil)
        }
    })
    console.log("ai usable abilities")
    console.log(abilitiesCanUse)
    ChooseAiAttack(entity, abilitiesCanUse)
    console.log("pathfinding")
    //AiPathfind(entity)
    // var attackUsed = 0
    //for each attack ability, check if we can use

    //check if we are in range to use?
        //if not in range
            //attempt move?
        //if in range && attackUsed == 0
            //use attack on target
            //attackUsed = 1
}

var blockers = []

const ChooseAiDefend = (entity, abilityList) => {
    console.log(entity)
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))
    var fastHere = false
    var slowHere = false
    getEntitiesAtLoc.forEach( eid => {
        var entity = world.getEntity(eid);
    //check if we are on a fast tile
        if(entity.has(components.FastAttack)){
            fastHere = true
    //check if we are on a tile with slow attack
        }else if(entity.has(components.SlowAttack)) {
            slowHere = true
        }
    })
    var moved = false
    if(fastHere){
        //check if dodge in usable
        var dodge
        abilityList.forEach( abil => {
            if(abil.description.name == "dodge") {
                dodge = abil
            }
        })
        if(dodge){
            //we have dodge so we should use it!
            StaminaCost(entity, dodge.abilityStaminaCost.amount)
            dodge.abilityFunction.function.onUse(dodge, entity)
            moved = true
        }
    }else if(slowHere){
        //check if we can move
        var move 
        abilityList.forEach(abil => {
            if(abil.description.name == "move"){
                move = abil
            }
        })
        //if move
        if(move){
            //use it!
            StaminaCost(entity, dodge.abilityStaminaCost.amount)
            move.abilityFunction.function.onUse(move, entity)
            moved = true
        }

        //then move
            //moved = true
    }

    if( (fastHere || slowHere) && !moved) {
        //check if we have any block skills
    }
 
}

const ChooseAiAttack = (entity,abilityList) => {
    //get closest target for now
    // var target = AiPathfind(entity)
    var attacked = false
    abilityList.shuffle()
    //abilityList.shuffle()
    console.log("Doing mob attack: ")
    for(var x = 0; x < 2;x ++){
        var target = AiPathfind(entity)
        abilityList.forEach( abil => {
            console.log(target.toString())
            console.log(target.length)
        
            if(target.length >= 1 && target.length <= abil.abilityRange.range && !attacked && CheckStraightLine(target, {x:entity.position.x,y:entity.position.y})){
                //we are in range
                console.log("In Range")
                
                var targ = target.pop()
                console.log(targ.toString())

                abil.abilityFunction.function.onUse(abil, entity, {x:targ[0],y:targ[1]})

                //use stamina up
                entity.fireEvent("use-stamina",abil.abilityStaminaCost.amount)
                entity.fireEvent("ai-use-stamina",abil.abilityStaminaCost.amount)
                attacked = true
            }
        })
        if(target.length > 1 && !attacked){
            //move towards enemy
            console.log("Not In Range so we move")
            if(target.length > 1){
                MoveForward(entity, target)

                //use 1 stamina
                entity.fireEvent("use-stamina",1)
                entity.fireEvent("ai-use-stamina",1)
            }
        }
    }    
}

const MoveForward = (entity, target) => {
    //DEBUG: give +1 movement
    entity.fireEvent("gain-movement", 2)

    //find nearest player

    var y = entity.movement.movement
    for(var x = 0; x < y;x++){
        if(target && target.length > 1){
            console.log("remaining target")
            console.log(target.toString())
            //did we find a target? walk towards the last
            var nextStep = target.pop()
            console.log("Next Step" + nextStep.toString())
            
            //convert to a step from position
            entity.movement.x = nextStep[0] - entity.position.x
            entity.movement.y =  nextStep[1] - entity.position.y 
            entity.fireEvent("attempt-move")
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
    //console.log(counts)
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