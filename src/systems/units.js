import * as ROT from "rot-js"

import world from "../state/ecs"
import * as components from "../state/component"
import * as Movements from "../systems/movement";
import { random, compact } from "lodash";

export function Init(entity){
    for(var x = 0; x < entity.stamina.max;x++){
        entity.add(components.Die)
    }
    RollDice(entity)

    if(entity.has(components.Armour)){
        for(var x = 0; x < entity.armour.dice;x++){
            entity.add(components.ArmourDie)
          }
          //roll armour die
          RollDiceArmour(entity)
    }

    AbilitySetupGrabBag(entity)
}

export function RollDice(entity){
    for(var x = 0; x < entity.stamina.max; x++){
        entity.die[x].selected = false
        entity.die[x].exhausted = (x>=entity.stamina.current)
        entity.die[x].number = random(1, 6);
    }


}

function RollDiceArmour(entity){
    if(!entity.armour){
        return
    }
    for(var x = 0; x < entity.armour.dice; x++){
        entity.armourDie[x].number = random(1, 6);
      }
    //set armour value
    GetArmourAmount(entity)
}

function GetArmourAmount(entity){
    if(!entity.armour){
        return 0
    }
    //get armour value for next turn
    for(var x = 0; x < entity.armour.dice; x++){
        if(entity.armour.weight == "Light" && entity.armour.entity.armourDie[x].number >= 6){
            entity.armour.amount += 1
        }else if (entity.armour.weight == "Medium" && entity.armour.entity.armourDie[x].number >= 5){
            entity.armour.amount += 1
        }else if (entity.armour.weight == "Heavy" && entity.armour.entity.armourDie[x].number >= 4) {
            entity.armour.amount += 1
        }
      }
}

export function GainArmour(entity, amount){
    entity.armour.amount+= amount
}

export function StartTurn(entity) {
    if(entity.has(components.IsPlayerControlled)){
        
    }else {
        //gain their static movement
        GainMovement(entity,entity.gainMovement.amount)
    }

    if(entity.abilityGrabBagList.abilities.length == 0){
        AbilitySetupGrabBag(entity)
    }

    entity.fireEvent("turn-start")

}

export function EndTurn(entity){
    if(entity.has(components.IsPlayerControlled)){
        entity.stamina.current = Math.min(entity.stamina.max, entity.stamina.current + Math.max(0,entity.stamina.regen-entity.stamina.used))
        entity.stamina.used = 0;
        RollDice(entity)
    }else {

    }

    if(entity.has(components.Armour)){
        entity.armour.amount = 0;

        //roll armour die
        RollDiceArmour(entity)
    }
    //set movement and dodge to 0
    entity.movement.movement = 0
    entity.movement.dodge = 0

    entity.fireEvent("turn-end")
}

export function GainMovement(entity,amount){
    entity.movement.movement += amount
}

export function GainDodge(entity,amount){
    entity.movement.dodge += amount
}

export function UpdatePosition(mx,my){
    entity.movement.x = mx
    entity.movement.y = my
}

export function TakeDamage(entity, amount){
        console.log("i've been hit!")
        for(var dmg = 0; dmg < amount; dmg++){
          if(entity.armour && entity.armour.amount >= 1){
            entity.armour.amount--
          }else {
            entity.health.current--;

          }
        }
      
        console.log("ow")
        if (entity.health.current <= 0) {
            Die(entity)
        }
      
}

export function Heal(entity, amount){
    entity.health.current = Math.min(entity.health.max, entity.health.current + amount)
}

export function Die(entity){
    if(!entity.has(components.IsDead) && !entity.has(components.NoCorpse)){
        entity.remove(entity.layerUnit)
        entity.remove(entity.isBlocking)
        entity.add(components.IsDead)
        entity.add(components.LayerItem)
        //remove enemy flag, corpses are neutral
        if(entity.has(components.IsEnemy)){
            entity.remove(entity.isEnemy)
        }
        entity.appearance.char = "%"

        if(entity.has(components.MultiTileHead)){
            entity.multiTileHead.bodyEntities.forEach(body => {
                var body = world.getEntity(body)
                body.remove(body.isBlocking)
            })
        }
    }else if (entity.has(components.NoCorpse)){
        //this entity should be destroyed?
        if(entity.has(components.Position)){
            entity.remove(entity.position)
        }
    }
    
}

export function Reanimate(entity, isEnemy = true){
    entity.remove(entity.layerItem)
    entity.remove(entity.isDead)
    entity.add(components.LayerUnit)
    entity.add(components.IsBlocking)
    entity.health.current = entity.health.max
    entity.appearance.char = "z"
    entity.add(components.NoCorpse)

    if(isEnemy){
        entity.add(components.IsEnemy)
        entity.appearance.color = "green"
    }else{
        entity.appearance.color = "blue"
    }
}

export function AttemptMove(entity) {
    if(entity.movement.movement <= 0 && entity.movement.dodge <= 0){
        //do nothing
    }else {
        var success = Movements.AttemptMove(entity.movement, entity)

        
        if(success){
          //check if we used movement or dodge
          if(entity.movement.dodge > 0){
            entity.movement.dodge = Math.max(0,entity.movement.dodge - 1)
          }else {
            entity.movement.movement -= 1
          }
          // evt.handle()
        }
      }
    //   console.debug(entity.movement.x + ":"+entity.movement.y)
      entity.movement.x = 0
      entity.movement.y = 0
}

export function UseStamina(entity, amount){
    entity.stamina.current = Math.max(entity.stamina.current - amount, 0)
}

export function GainStamina(entity, amount){
    entity.stamina.current = Math.min(entity.stamina.max, entity.stamina.current + amount)
}

export function ExhaustSelectedStamina(entity){
    entity.die.forEach(die => {
        if(die.selected){
            entity.stamina.used++;
            entity.stamina.current--;
            die.exhausted = true
            die.selected = false
          }
    })
   
}



export function AbilitySetupGrabBag(entity) {
    var abilities = []

    entity.abilityList.abilities.forEach( (abil) => {
      if(abil[1] >= 1){
        var prefAbil = world.createPrefab(abil[0])
        if(!prefAbil){
            console.error(abil[0])
        }
        for(var x = 0;x < abil[1];x++){
          abilities.push(prefAbil)
        }
      }
    
    })
    if(entity.has(components.Ai)){
      abilities = ROT.RNG.shuffle(abilities)
    }
    entity.abilityGrabBagList.abilities=abilities
}

export function ChangeAbility(entity, abilityName, amount) {
    const existAbil = entity.abilityList.abilities.filter(abil => abil[0] == abilityName);
    if(existAbil && existAbil.length >= 1){
      for(var x = 0; x < entity.abilityList.abilities.length;x++){
        if(entity.abilityList.abilities[x][0] == abilityName){
            entity.abilityList.abilities[x][1] = amount
        }
      }
      // existAbil[1] = evt.data.value
    }else{
        entity.abilityList.abilities.push([abilityName, amount])
    }
    console.log('but')
}

//equipment
export function EquipItem(entity, item){
    var itemPrefab = world.createPrefab(item)
    if(!itemPrefab){
        console.error(item)
    }
    // var slot = GetEquipmentSlot(entity,itemPrefab.itemSlot.slot)
    for(var x = 0; x < entity.equipmentSlot.length;x++){
        if(entity.equipmentSlot[x].slot == itemPrefab.itemSlot.slot){
            entity.equipmentSlot[x].eid = itemPrefab.id
        }
    }
    // /slot.eid = itemPrefab.eid
}

function GetEquipmentSlot(entity, slot){
    for(var x = 0; x < entity.equipmentSlot.length;x++){
        if(entity.equipmentSlot[x].slot == slot){
            return entity.equipmentSlot[x]
        }
    }
}

export function BuildAbilityListPlayer(entity){
    entity.abilityList.abilities = []
    
    entity.abilityList.abilities.push(["AbilityMove",1])
    entity.abilityList.abilities.push(["AbilityDodge",1])

    entity.equipmentSlot.forEach( equipment =>{
        if(equipment.eid && equipment.eid != ""){
            var item = world.getEntity(equipment.eid)

            //add any abilities this itme adds
            item.itemAbilities.abilities.forEach(abil =>{
                entity.abilityList.abilities.push([abil,1])
            })

            //if this is armour set the armour weight
            if(item.has(components.ItemArmourRating)){
                if(entity.has(components.Armour)){
                    entity.remove(entity.armour)
                }

                entity.add(components.Armour, {weight: item.itemArmourRating.weight, dice: item.itemArmourRating.dice})
            }

            //if this adds companions
            if(item.has(components.ItemCompanions)){
                for(var x = 0; x < item.itemCompanions.companions.length; x++){
                    for(var y = 0; y < item.itemCompanions.companions[x][1]; y++) {
                        entity.add(components.Companion, {name:item.itemCompanions.companions[x][0]})
                    }
                }
            }

        }
    })
}