
import * as components from "./component"

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
      properties: {abilities: [components.Ability, components.AbilityMove] }
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
