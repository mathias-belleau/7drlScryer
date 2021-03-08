import world from "./ecs"

import { Component } from "geotic";
import { random, compact } from "lodash";
import {addCacheSet, deleteCacheSet} from "./cache"
import * as Abilities from "../systems/abilities"
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
        this.current -= evt.data.amount;
  
        console.log(this)
        if (this.current <= 0) {
          
            // this.entity.appearance.char = "%";
            // this.entity.remove(this.entity.ai)
            // this.entity.remove(this.entity.isBlocking)
            // this.entity.remove(this.entity.layer400)
            // this.entity.add(IsDead);
            // this.entity.add(Layer300);
        }
      
        evt.handle();
    }
  }

  export class Movement extends Component{
    static properties = {movement: 0, dodge: 0}

    onGainMovement(evt) {
      this.movement += evt.data;
      console.log("new movement: " + this.movement)
      evt.handle();
    }

    onGainDodge(evt){
      this.dodge += evtevt.data;
      evt.handle();
    }

    onTurnEnd(evt){
      console.log('ended in move')
      this.movement = 0
      this.dodge = 0

      //evt.handle()
    }
  }

  export class Armour extends Component {
    static properties = { max: 0, current: 0}
  }

  export class Stamina extends Component {
    static properties = { max: 5, current: 5, used: 0}
    onAttached(){
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
      this.current = Math.min(this.max, this.current+= Math.max(4-this.used,0))
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
  }

  export class Die extends Component {
    static allowMultiple = true;
    static properties = {number: 0, selected: false, exhausted: false}
  }

  export class IsPlayerControlled extends Component{}
  export class IsDead extends Component {}
  export class IsEnemy extends Component {
    static properties = {enemy: true}
  }
  export class Ai extends Component {}

  export class LayerMap extends Component {}
  export class LayerUnit extends Component {}


  //abilities
export class AbilityList extends Component {
  static properties = {abilities: []}

  onAttached(){
    //upon creation generate the prefabs and fill this list
    var abilities = []

    this.abilities.forEach( (abil) => {
      abilities.push(world.createPrefab(abil))
    })
    this.abilities=abilities
  }
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

export class AbilityStaminaCost extends Component {
  static properties = {amount: 1}
}