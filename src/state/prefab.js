
import * as components from "./component"
import * as Abilities from "../systems/abilities"

// Base
export const Tile = {
    name: "Tile",
    components: [
      { type: "Appearance" },
      { type: "Description" },
      { type: "LayerMap" },
    ],
  };

  export const Being = {
    name: "Being",
    components: [
      { type: "Appearance" },
      { type: "Description" },
      { type: "Health" },
      { type: "IsBlocking" },
      { type: "LayerUnit" },
      { type: "Movement"},
      { type: "Armour"},
      { type: "Stamina"},
      { type: "AbilityGrabBagList"},
      { type: "AbilityList"},
    ],
  };

  export const Ability = {
    name: "Ability",
    components:[
      { type: "Description",
        properties: {name: "Generic Ability", description: "used for testing as base template"}},
      { type: "AbilityPhase"},
      { type: "AbilitySpeed"},
      { type: "AbilityStaminaCost"},
      { type: "AbilityFunction"},
      { type: "AbilitySmallName"},
      { type: "AbilityTarget"},
      { type: "AbilityAllowedDie"},
      { type: "AbilityRange"},
      { type: "AbilityDamage"},
    ]
  }

  export const Scenario = {
    name: "Scenario",
    components:[
      { type: "ScenarioMessage"},
      { type: "ScenarioBattle"}
    ]
  }


      // description
		// name
		// phase [DEFENSE, ATTACK, ANY]
		// speed [instant, fast,slow]
		// canUse() ={}  -> do requirements check
		// onUse() ={} -> give instant player buff like move points
		// 				start targeting system
		// onTargetUse() ={} -> when target is given, if valid target exhaust stamina die and add to staminaRegen.used

//advanced
export const Wall = {
    name: "Wall",
    inherit: ["Tile"],
    components: [
      { type: "IsBlocking" },
      {
        type: "Appearance",
        properties: { char: "#", color: "#AAA" },
      },
      {
        type: "Description",
        properties: { name: "wall" },
      },
    ],
  };

export const Floor = {
    name: "Floor",
    inherit: ["Tile"],
    components: [
      {
        type: "Appearance",
        properties: { char: ".", color: "#AAA" },
      },
      {
        type: "Description",
        properties: { name: "wall" },
      },
    ],
  };

 export const PlayerBeing = {
   name: "PlayerBeing",
   inherit: ["Being"],
   components: [
     {
       type: "IsPlayerControlled"
     },
     { type: "Appearance",
      properties: {char: "@"}
    },
    {
      type: "AbilityList",
      properties: {abilities: [["AbilityMove", 1], ["AbilityDodge",1], ["AbilitySwordJab",1], ["AbilitySwordSwing",1]] }
    }
   ]
 };

 export const Mob = {
  name: "Mob",
  inherit: ["Being"],
  components: [
    { type: "Ai" },
    { type: "IsEnemy"},
    {type: "GainMovement"},
  ]
};


export const Goblin = {
  name: "Goblin",
  inherit:["Mob"],
  components: [
    {
      type: "Appearance",
      properties: {char: "g", color: "green"}
    },
    {
      type: "Description",
      properties: {name: "Goblin", description: "A lowly Goblin"}
    },
    {
      type: "AbilityList",
      properties: {abilities: [ ["AbilitySpearThrust", 1], ["AbilityDoNothing",1]] }
    },
    {type: "Health", properties: {max:2,current:2}},
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}}
  ]
}

export const OrcWarrior = {
  name: "Orc Warrior",
  inherit:["Mob"],
  components: [
    {
      type: "Appearance",
      properties: {char: "o", color: "green"}
    },
    {
      type: "Description",
      properties: {name: "Orc Warrior", description: "A fearsome Orc wielding axees"}
    },
    {
      type: "AbilityList",
      properties: {abilities: [ ["AbilityDoubleAxeSwing",1], ["AbilityAxeDecapitate",1]] }
    },
    {type: "Health", properties: {max:8,current:8}},
    { type: "Stamina", properties: { max: 4, current: 4, used: 0, regen: 4}}
  ]
}


//abilities
export const AbilityMove = {
  name: "AbilityMove",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Move", description: "exhausts 1 die to give it's face value for movement points"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityMove} },
    { type: "AbilitySmallName", properties: {smallName: "MOV"} },
  ]
}

export const AbilityDodge = {
  name: "AbilityDodge",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Dodge", description: "exhausts a pair to give 1 dodge point"}},
    { type: "AbilityFunction",
      properties: {function: Abilities.AbilityDodge}
    },
    {
      type: "AbilitySmallName",
      properties: {smallName: "DDG"}
    },
    {
      type: "AbilityStaminaCost",
      properties: {amount: 2}
    }
  ]
}

export const AbilityDoNothing= {
  name: "AbilityDoNothing",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Does Nothing", description: "Rest this turn"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityDoNothing} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "RST"}     },
    { type: "AbilityTarget", properties: {coords: [[0,0]]}     },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]} },
    { type: "AbilityRange", properties: {range:5}}
  ]
}

export const AbilitySpearThrust = {
  name: "AbilitySpearThrust",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Spear Thrust", description: "exhausts 5,6 to do a slow attack on a 2x1 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilitySpearThrust} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "STH"}     },
    { type: "AbilityTarget", properties: {coords: [[0,0],[0,-1]]}     },
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]} },
    { type: "AbilityRange", properties: {range:2}}
  ]
}

export const AbilitySwordJab = {
  name: "AbilitySwordJab",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Sword Jab", description: "exhausts a 4,5,6 to do a slow attack on a single tile for 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilitySwordJab} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "SJB"} },
    { type: "AbilityTarget", properties: {coords: [[0,0]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[4,5,6]} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilitySwordSwing = {
  name: "AbilitySwordSwing",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Sword Swing", description: "exhausts 6 to do a slow attack on a T shape for 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilitySwordSwing} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "SSW"} },
    { type: "AbilityTarget", properties: {coords: [ [-1,0],[0,0],[1,0],[0,-1] ]} },
    { type:"AbilityAllowedDie", properties: {allowed:[6]} },
    { type: "AbilityEndsTurn"}
  ]
}


export const AbilityDoubleAxeSwing = {
  name: "AbilityDoubleAxeSwing",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Double Axe Swing", description: "swings both your axes in two massive arcs dealing 2 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityDoubleAxeSwing} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    {type: "AbilitySmallName",properties: {smallName: "DAS"}},
    { type: "AbilityTarget", properties: {coords: [[-1,0],[0,0],[1,0],[-1,1],[1,1]]}},
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]}  },
    { type: "AbilityStaminaCost", properties: {amount: 3} },
    { type: "AbilityDamage", properties: {dmg:2} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilityAxeDecapitate = {
  name: "AbilityAxeDecapitate",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Axe Decapitate", description: "Swings an axe directly at the targets head for 3 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityAxeDecapitate} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName",properties: {smallName: "DAC"}},
    { type: "AbilityTarget", properties: {coords: [[0,0]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[6]}  },
    { type: "AbilityStaminaCost", properties: {amount: 4} },
    { type: "AbilityDamage", properties: {dmg:3} },
    { type: "AbilityEndsTurn"}
  ]
}

export const Hunt = {
  name: "Hunt",
  components:[
    { type: "description"},
    { type: "HuntScenarios", properties: {scenarios: ["Scenario","Scenario"]}}
  ]
}