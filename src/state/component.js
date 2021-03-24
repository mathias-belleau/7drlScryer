import world from "./ecs"

import { Component } from "geotic";
import { random, compact } from "lodash";
import {addCacheSet, deleteCacheSet} from "./cache"
import * as Abilities from "../systems/abilities"
import * as Movements from "../systems/movement"

import * as ROT from "rot-js"

export class Appearance extends Component {
    static properties = {
      color: "#ff0077",
      char: "?",
      background: "#000",
    };
}

export class Description extends Component {
    static properties = { 
        name: "No Name",
        description: "nothing"
     };
  }
export class IsBlocking extends Component {}

export class Position extends Component {
    static properties = { x: 0, y: 0 };
  
    onAttached() {
      const locId = `${this.entity.position.x},${this.entity.position.y}`;
      addCacheSet("entitiesAtLocation", locId, this.entity.id);
    }
  
    onDestroyed() {      
        const locId = `${this.x},${this.y}`;
        deleteCacheSet("entitiesAtLocation", locId, this.entity.id);
    }
  }

export class Health extends Component {
    static properties = { max: 4, current: 4 };
  
    onTakeDamage(evt) {
        console.log("i've been hit!")
        for(var dmg = 0; dmg < evt.data.amount; dmg++){
          if(this.entity.armour && this.entity.armour.amount >= 1){
            this.entity.armour.amount--
          }else {
            this.current--;

          }
        }
      
      
        console.log(this)
        console.log("ow")
        if (this.current <= 0) {
            this.entity.remove(this.entity.layerUnit)
            this.entity.remove(this.entity.isBlocking)
            this.entity.add(IsDead)
            this.entity.add(LayerItem)
            this.entity.appearance.char = "%"

            if(this.entity.has(MultiTileHead)){
              this.entity.multiTileHead.bodyEntities.forEach(body => {
                var body = world.getEntity(body)
                body.remove(body.isBlocking)
              })
            }
        }
      
        evt.handle();
    }
  }

  export class Movement extends Component{
    static properties = {movement: 0, dodge: 0, x: 0, y: 0}

    onGainMovement(evt) {
      this.movement += evt.data;
      // console.log("new movement: " + this.movement)
      evt.handle();
    }

    onGainDodge(evt){
      this.dodge += evt.data;
      evt.handle();
    }

    onTurnEnd(evt){
      // console.log('ended in move')
      this.movement = 0
      this.dodge = 0
    }

    onChangePosition(evt){
      this.x = evt.data.x
      this.y = evt.data.y
      evt.handle()
    }
  
    onAttemptMove(evt){
      if(this.movement <= 0 && this.dodge <= 0){
        evt.handle()
      }else {
        var success = Movements.AttemptMove(this, this.entity)

        
        if(success){
          //check if we used movement or dodge
          if(this.dodge > 0){
            this.dodge = Math.max(0,this.dodge - 1)
          }else {
            this.movement -= 1
          }
          // evt.handle()
        }
      }
      this.x = 0
      this.y = 0
    }
  }

  export class GainMovement extends Component {
    static properties = {amount:3}

    onTurnStart(evt){
      this.entity.fireEvent("gain-movement", this.amount)
    }
  }

  export class Stamina extends Component {
    static properties = { max: 5, current: 5, used: 0, regen: 2}
    onAttached(){
      
    }

    onInit(evt){
      //console.log("fired stamina")
      //add die to this entity
      for(var x = 0; x < this.max;x++){
        this.entity.add(Die)
      }
      this.onRollDice()
    }

    onTurnEnd(evt) {
      console.log('doing turn end')
      //gain stamina back 4-used stamina this turn
      //this.onUpdateStamina()
      this.current = Math.min(this.max, this.current + Math.max(0,this.regen-this.used))
      this.used = 0;
      this.onRollDice()
      //evt.handle()
    }

    onRollDice(){
      //loop over all die and shuffle them and exhaust ones that are past max
      for(var x = 0; x < this.max; x++){
        this.entity.die[x].selected = false
        this.entity.die[x].exhausted = (x>=this.current)
        this.entity.die[x].number = random(1, 6);
      }
    }

    onUseStamina(evt){
      this.current = Math.max(this.current - evt.data, 0)
    }


    onUpdateStamina(){
      //this.current = Math.min(0, this.current+= Math.max(4-this.used,this.max))
      //this.current = this.current - this.used;
    }
  }

  export class Die extends Component {
    static allowMultiple = true;
    static properties = {number: 0, selected: false, exhausted: false}

    
    onExhaustSelected(evt){
      if(this.selected){
        this.entity.stamina.used++;
        this.entity.stamina.current--;
        this.exhausted = true
        this.selected = false

        this.entity.fireEvent("update-stamina")
      }
    }
  }

  export class Armour extends Component {
    static properties = {weight: "Light", dice:3, amount: 0}

    onAttached(){
      //console.log("fired stamina")
      //add die to this entity
      for(var x = 0; x < this.dice;x++){
        this.entity.add(ArmourDie)
      }
      this.onRollDice()
      this.GetArmourAmount()
    }

    onTurnEnd(evt){
      this.amount = 0;

      this.onRollDice()
      
      this.GetArmourAmount()
    }

    GetArmourAmount(){
      //get armour value for next turn
      for(var x = 0; x < this.dice; x++){
        if(this.weight == "Light" && this.entity.armourDie[x].number >= 6){
          this.amount += 1
        }else if (this.weight == "Medium" && this.entity.armourDie[x].number >= 5){
          this.amount += 1
        }else if (this.weight == "Heavy" && this.entity.armourDie[x].number >= 4) {
          this.amount += 1
        }
      }
    }

    onGainArmour(evt){
      this.amount+= evt.data.armourAmt
    }

    onRollDice(){
      //loop over all die and shuffle them and exhaust ones that are past max
      for(var x = 0; x < this.dice; x++){
        this.entity.armourDie[x].number = random(1, 6);
      }
    }
  }

  export class ArmourDie extends Component {
    static allowMultiple = true;
    static properties = {number: 0, shattered: false}
  }

  export class MultiTileHead extends Component {
    static properties = {bodyEntities: []}

  }

  export class MultiTileBody extends Component {
    static properties = {headID: ""}
  }

  export class IsTurnEnd extends Component {
    onTurnEnd(evt) {
      this.destroy()
    }
  }
  export class IsPlayerControlled extends Component{}
  export class IsEnemy extends Component {
    static properties = {enemy: true}
  }
  export class Ai extends Component {}

  export class LayerMap extends Component {}
  export class LayerItem extends Component {}
  export class LayerUnit extends Component {}

  export class SlowAttack extends Component {}
  export class FastAttack extends Component {}
  export class IsDead extends Component {} //needs to remove is block and change appearance to corpse and such?
  export class DmgTile extends Component {
    static properties = {dmg: 1}
  }

  //abilities
export class AbilityList extends Component {
  static properties = {abilities: []}

  SetupGrabBag(){
    //upon creation generate the prefabs and fill this list
    var abilities = []

    this.abilities.forEach( (abil) => {
      if(abil[1] >= 1){
        var prefAbil = world.createPrefab(abil[0])
        for(var x = 0;x < abil[1];x++){
          abilities.push(prefAbil)
        }
      }
    
    })
    if(this.entity.has(Ai)){
      abilities = ROT.RNG.shuffle(abilities)
    }
    this.entity.abilityGrabBagList.abilities=abilities
  }

  onInit(evt){
    this.SetupGrabBag()
  }
  onAttached(){
    
  }

  onTurnEnd(evt){
    //check if grabbaglist is empty
    if(this.entity.abilityGrabBagList.abilities.length == 0){
      this.SetupGrabBag()
    }
  }

  onChangeAbility(evt){

    const existAbil = this.abilities.filter(abil => abil[0] == evt.data.abilName);
    if(existAbil && existAbil.length >= 1){
      for(var x = 0; x < this.abilities.length;x++){
        if(this.abilities[x][0] == evt.data.abilName){
          this.abilities[x][1] = evt.data.value
        }
      }
      // existAbil[1] = evt.data.value
    }else{
      this.abilities.push([evt.data.abilName, evt.data.value])
    }
    console.log('but')
  }
}

export class AbilityGrabBagList extends Component {
  static properties = {abilities: []}
}

export class AbilityTarget extends Component {
  static properties = {coords: [[0,0]]}
}

export class AbilityAllowedDie extends Component {
  static properties = {allowed: [1,2,3,4,5,6]}
}

export class AbilityFunction extends Component {
    static properties = {function: Abilities.Ability} 
}
export class AbilityPhase extends Component {
  static properties = {phase: "Any"}
}
  
export class AbilitySpeed extends Component {
  static properties = {speed: "Instant"}
}



export class AbilitySmallName extends Component {
  static properties = {smallName: "abl"}
}



export class AbilityDamage extends Component {
  static properties = {dmg: 1}
}

export class AbilityEndsTurn extends Component {}


//scenarios

export class ScenarioBattle extends Component {
  static properties = {enemies: [["Goblin", 1], ["Goblin Shaman", 0]], allies: [  ]}
}

export class ScenarioMessage extends Component {
  static properties = {message: "Test scenario pls ignore"}
}

export class ScenarioChoice extends Component {
  static allowMultiple = true;
  static properties = {choiceMessage: "This is a test", scenario: "TestScenario"}
}

export class HuntScenarios extends Component {
  static properties = {scenarios: ["Scenario"]}
}


//unit abilities
export class OgreRage extends Component {
  onTurnEnd(evt) {
    if(this.entity.health.current <= 4){
    //check if this unit is below 4hp
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmash", value: 0})
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmashSmash", value: 0})
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmashSmashSmash", value: 0})
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmashSmashSmashSmash", value: 1})
      
    }else if(this.entity.health.current <= 8) {
    //check if this unit is below 8hp
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmash", value: 0})
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmashSmash", value: 0})
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmashSmashSmash", value: 1})
    }else if(this.entity.health.current <= 12) {
    //check if this unit is below 12hp
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmash", value: 0})
      this.entity.fireEvent("change-ability",{abilName: "AbilityOgreSmashSmash", value: 1})
    }
    
  }
}