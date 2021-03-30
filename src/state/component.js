import world from "./ecs";

import { Component } from "geotic";
import { random, compact } from "lodash";
import {addCacheSet, deleteCacheSet} from "./cache";
import * as Abilities from "../systems/abilities";
import * as Movements from "../systems/movement";

import * as Units from "../systems/units"
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
  }

  export class Movement extends Component{
    static properties = {movement: 0, dodge: 0, x: 0, y: 0}
  }

  export class GainMovement extends Component {
    static properties = {amount:3}
  }

  export class Companion extends Component {
    static allowMultiple = true;
    static properties = {name: "Goblin", eid: ""}
  }

  export class Stamina extends Component {
    static properties = { max: 5, current: 5, used: 0, regen: 2}
  }

  export class Die extends Component {
    static allowMultiple = true;
    static properties = {number: 0, selected: false, exhausted: false}
  }

  export class Armour extends Component {
    static properties = {weight: "None", dice:0, amount: 0}
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

  export class Duration extends Component {
    static properties = {turns: 2};

    onTurnEnd(evt) {
      this.turns--;
      if(this.turns <=0 ){
        this.entity.destroy()
      }
    }
  }

  export class IsTurnEnd extends Component {
    onTurnEnd(evt) {
      this.destroy()
    }
  }

  export class Invisible extends Component {
    
  }

  export class ProjectileTile extends Component {
    static properties = {pathId: ""}
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
//inventory
  export class EquipmentSlot extends Component {
    static allowMultiple =true;
    static properties = {slot: "Hands", eid: ""}
  }

  export class ItemSlot extends Component {
    static properties = {slot: "Hands"}
  }

  export class ItemAbilities extends Component {
    //ItemAbilities
    static properties = {abilities: [  ]} 
  }

  export class ItemCraftingRecipe extends Component {
    static properties = {items: [ ["bone",1] ]}
  }

  export class ItemArmourRating extends Component {
    static properties = {weight: "Light", dice: 2}
  }

  export class ItemCompanions extends Component {
    static properties = {companions: [ ["Goblin", 2] ]}
  }


  //abilities
export class AbilityList extends Component {
  static properties = {abilities: []}
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
  static properties = {phase: "Defend"}
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

export class AbilityProjectile extends Component {
  static properties = {path: [ [0,-1] ]}
}

export class AbilitySummon extends Component{
  static properties = {amount: 1, prefab: "Goblin"}
}

export class AbilityEndsTurn extends Component {}


//scenarios

export class ScenarioBattle extends Component {
  static properties = {enemies: [ ["Goblin", 6], ["Goblin Archer", 3], ["Goblin Shaman", 1]], allies: [  ]}
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
      Units.ChangeAbility(this.entity, "AbilityOgreSmash", 0)
      Units.ChangeAbility(this.entity, "AbilityOgreSmashSmash", 0)
      Units.ChangeAbility(this.entity, "AbilityOgreSmashSmashSmash", 0)
      Units.ChangeAbility(this.entity, "AbilityOgreSmashSmashSmashSmash", 1)
      Units.AbilitySetupGrabBag(this.entity)
      
    }else if(this.entity.health.current <= 8) {
    //check if this unit is below 8hp
      Units.ChangeAbility(this.entity, "AbilityOgreSmash", 0)
      Units.ChangeAbility(this.entity, "AbilityOgreSmashSmash", 0)
      Units.ChangeAbility(this.entity, "AbilityOgreSmashSmashSmash", 1)
      Units.AbilitySetupGrabBag(this.entity)
    }else if(this.entity.health.current <= 12) {
    //check if this unit is below 12hp
      Units.ChangeAbility(this.entity, "AbilityOgreSmash", 0)
      Units.ChangeAbility(this.entity, "AbilityOgreSmashSmash", 1)
      Units.AbilitySetupGrabBag(this.entity)
    }
    
  }
}