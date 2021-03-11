
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
      { type: "armour"},
      { type: "stamina"},
      { type: "AbilityList"}
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
      { type: "AbilityAllowedDie"}
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
     { type: "Apperance",
      properties: {char: "@"}
    },
    {
      type: "AbilityList",
      properties: {abilities: ["AbilityMove", "AbilityDodge", "AbilitySwordJab", "AbilitySwordSwing"] }
    }
   ]
 };

 export const Mob = {
  name: "Mob",
  inherit: ["Being"],
  components: [
    {
      type: "Ai"
    },
    {
      type: "IsEnemy",
    },
    {type: "GainMovement"}
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
      properties: {abilities: ["AbilitySwordJab", "AbilitySwordSwing"] }
    }
  ]
}


//abilities
export const AbilityMove = {
  name: "AbilityMove",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Move", description: "exhausts 1 die to give it's face value for movement points"}},
    { type: "AbilityFunction",
      properties: {function: Abilities.AbilityMove}
    },
    {
      type: "AbilitySmallName",
      properties: {smallName: "MOV"}
    }
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

export const AbilitySwordJab = {
  name: "AbilitySwordJab",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Sword Jab", description: "exhausts 5,6 to do a slow attack on a single tile for 1 dmg"}},
    { type: "AbilityFunction",
      properties: {function: Abilities.AbilitySwordJab}
    },
    {
      type: "AbilityPhase",
      properties: {phase: "Attack"}
    },
    {
      type: "AbilitySmallName",
      properties: {smallName: "SJB"}
    },
    {
      type: "AbilityTarget",
      properties: {coords: [[0,0]]}
    },
    {
      type:"AbilityAllowedDie",
      properties: {allowed:[3,4,5,6]}
    }
  ]
}

export const AbilitySwordSwing = {
  name: "AbilitySwordSwing",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Sword Swing", description: "exhausts 5,6 to do a slow attack on a single tile for 2 dmg"}},
    { type: "AbilityFunction",
      properties: {function: Abilities.AbilitySwordSwing}
    },
    {
      type: "AbilityPhase",
      properties: {phase: "Attack"}
    },
    {
      type: "AbilitySmallName",
      properties: {smallName: "SSW"}
    },
    {
      type: "AbilityTarget",
      //properties: {coords: [[-1,0],[0,0]]}
      properties: {coords: [ [-1,0],[0,0],[1,0],[0,-1] ]}
    },
    {
      type:"AbilityAllowedDie",
      properties: {allowed:[4,5,6]}
    }
  ]
}