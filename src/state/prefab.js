
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
      { type: "AbilityFunction"}
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
      properties: {abilities: ["Ability", "AbilityMove"] }
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
    }
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
    }
  ]
}