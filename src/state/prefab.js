
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
      { type: "Stamina"},
      { type: "AbilityGrabBagList"},
      { type: "AbilityList"},
    ],
  };

  export const MultiTileBody = {
    name: "MultiTileBody",
    components: [
      { type: "Appearance"},
      { type: "IsBlocking"},
      { type: "LayerUnit"},
      { type: "MultiTileBody"}
    ]
  }

  export const Ability = {
    name: "Ability",
    components:[
      { type: "Description",
        properties: {name: "Generic Ability", description: "used for testing as base template"}},
      { type: "AbilityPhase"},
      { type: "AbilitySpeed"},
      { type: "AbilityFunction"},
      { type: "AbilitySmallName"},
      { type: "AbilityTarget"},
      { type: "AbilityAllowedDie"},
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
     { type: "IsPlayerControlled" },
     { type: "Appearance", properties: {char: "@"} },
    {
      type: "AbilityList",
      properties: {abilities: [["AbilityMove", 1], ["AbilityDodge",1], ["AbilityAnimateDead",1], ["AbilitySwordJab",1], ["AbilitySwordSwing",1]] }
    },
    {type: "Armour"},
    {type: "Stamina", properties: {max:8,current:8, used: 0, regen: 2}}
   ]
 };

 export const Mob = {
  name: "Mob",
  inherit: ["Being"],
  components: [
    { type: "Ai" },
    {type: "GainMovement"},
  ]
};

export const Projectile = {
  name: "Projectile",
  components: [
    { type: "ProjectileTile"}
  ]
}

export const ProjectilePath = {
  name: "ProjectilePath",
  components: [
    { type: "Appearance"},
  ]
}

export const Goblin = {
  name: "Goblin",
  inherit:["Mob"],
  components: [
    { type: "Appearance", properties: {char: "g", color: "green"} },
    { type: "Description", properties: {name: "Goblin", description: "A lowly Goblin"} },
    {
      type: "AbilityList",
      properties: {abilities: [ ["AbilitySpearThrust", 1], ["AbilityDoNothing",1]] }
    },
    {type: "Health", properties: {max:2,current:2}},
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}},
  ]
}

export const GoblinArcher = {
  name: "Goblin Archer",
  inherit:["Mob"],
  components: [
    { type: "Appearance", properties: {char: "a", color: "green"} },
    { type: "Description", properties: {name: "Goblin Archer", description: "A lowly Goblin wtih a crude bow"} },
    {
      type: "AbilityList",
      properties: {abilities: [ ["AbilityBowShot", 1]] }
    },
    {type: "Health", properties: {max:2,current:2}},
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}}
  ]
}

export const GoblinShaman = {
  name: "Goblin Shaman",
  inherit:["Mob"],
  components: [
    {
      type: "Appearance",
      properties: {char: "s", color: "green"}
    },
    {
      type: "Description",
      properties: {name: "Goblin Shaman", description: "A leader of a Goblin tribe"}
    },
    {
      type: "AbilityList",
      properties: {abilities: [ ["AbilityFlameHands",1], ["AbilityDoNothing",2], ["AbilityAnimateDead", 1]] }
    },
    {type: "Health", properties: {max:3,current:3}},
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}}
  ]
}

export const OrcWarrior = {
  name: "Orc Warrior",
  inherit:["Mob"],
  components: [
    { type: "Appearance", properties: {char: "o", color: "green"} },
    { type: "Description",
      properties: {name: "Orc Warrior", description: "A fearsome Orc wielding axees"}
    },
    { type: "AbilityList",
      properties: {abilities: [["AbilityDoNothing",2], ["AbilityDoubleAxeSwing",3], ["AbilityAxeDecapitate",1]] }
    },
    {type: "Health", properties: {max:8,current:8}},
    { type: "GainMovement", properties: {amount:4} },
    { type: "Stamina", properties: { max: 4, current: 4, used: 0, regen: 4}}
  ]
}

export const Ogre = {
  name: "Ogre",
  inherit:["Mob"],
  components: [
    { type: "Appearance", properties: {char: "O", color: "brown"} },
    { type: "Description",
      properties: {name: "Ogre", description: "A massive humanoid who loves to club smaller things than it"}
    },
    { type: "AbilityList",
      properties: {abilities: [ ["AbilityOgreRockThrow", 1 ], ["AbilityOgreSmash",1]] }
    },
    {type: "Health", properties: {max:16,current:16}},
    { type: "GainMovement", properties: {amount:6} },
    {type: "MultiTileHead", properties: {bodyEntities: [] }},
    {type: "OgreRage"}
   
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
    { type: "AbilityTarget", properties: {coords: [[0,-1],[0,-2]]}     },
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]} },
  ]
}

export const AbilityBowShot = {
  name: "AbilityBowShot",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Bow Shot", description: "doubles for 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityBowShot} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "BOW"}     },
    { type: "AbilityTarget", properties: {coords: [[0,0]]}     },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]} },
    { type:"AbilityProjectile", properties: {path: [ [0,-1],[0,-2],[0,-3],[0,-4],[0,-5] ]} }
  ]
}

export const AbilityShieldRaise = {
  name: "AbilityShieldRaise",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Shield Raise", description: "exhausts 6 to gain 1 armour"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityShieldRaise} },
    { type: "AbilityPhase", properties: {phase: "Any"} },
    { type: "AbilitySmallName", properties: {smallName: "SHR"}     },
    { type:"AbilityAllowedDie", properties: {allowed:[6]} },
  ]
}

export const AbilitySwordJab = {
  name: "AbilitySwordJab",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Sword Jab", description: "exhausts a pair of 4,5,6 to do a slow attack on a single tile for 2 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilitySwordJab} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "SJB"} },
    { type: "AbilityTarget", properties: {coords: [[0,-1]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[4,5,6]} },
    { type: "AbilityDamage", properties: {dmg:2} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilitySwordSwing = {
  name: "AbilitySwordSwing",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Sword Swing", description: "exhausts a 5,6 to do a slow attack on a 2x1 shape for 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilitySwordSwing} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "SSW"} },
    //{ type: "AbilityTarget", properties: {coords: [ [-1,0],[0,0],[1,0],[0,-1] ]} },
    { type: "AbilityTarget", properties: {coords: [ [-1,-1],[0,-1] ]} },
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]} },
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
    { type: "AbilityTarget", properties: {coords: [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0]]}},
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]}  },
    { type: "AbilityDamage", properties: {dmg:2} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilityFlameHands = {
  name: "AbilityFlameHands",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Flame Hands", description: "a cone shaped blast of fire using a straight 3 of dice"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityFlameHands} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    {type: "AbilitySmallName",properties: {smallName: "FLH"}},
    { type: "AbilityTarget", properties: {coords: [ [0,-1],[-1,-2],[0,-2],[1,-2],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3]  ]}},
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]}  },
    { type: "AbilityDamage", properties: {dmg:2} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilitySummonGoblin = {
  name: "AbilitySummonGoblin",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Summon Goblin", description: "Straight 3: Summon a goblin"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilitySummonGoblin} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    {type: "AbilitySmallName",properties: {smallName: "SUG"}},
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]}  },
    { type:"AbilitySummon"},
    { type: "AbilityEndsTurn"}
  ]
}
export const AbilityAnimateDead = {
  name: "AbilityAnimateDead",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Animate Dead", description: "Straight 3: Animate a corpse"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityAnimateDead} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    {type: "AbilitySmallName",properties: {smallName: "AND"}},
    { type: "AbilityTarget", properties: {coords: [[0,-1]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]}  },
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
    { type: "AbilityTarget", properties: {coords: [[0,-1]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[6]}  },
    { type: "AbilityDamage", properties: {dmg:3} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilityOgreSmash = {
  name: "AbilityOgreSmash",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Ogre Smash", description: "BIG SMASH 3 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityOgreSmash} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName",properties: {smallName: "SMH"}},
    { type: "AbilityTarget", properties: {coords: [[0,-1],[1,-1], [0,-2], [1,-2], [-1,-1],[-1,-2], [2,-1],[2,-2]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[6]}  },
    { type: "AbilityDamage", properties: {dmg:4} },
    { type: "AbilityEndsTurn"}
  ]
}

export const AbilityOgreSmashSmash ={
  name:"AbilityOgreSmashSmash",
  inherit:["AbilityOgreSmash"],
  components:[
    { type: "AbilityTarget", properties: {coords: [[0,-1],[1,-1], [0,-2], [1,-2], [-1,-1],[-1,-2], [2,-1],[2,-2],
      [0,2],[1,2], [0,3], [1,3], [-1,2],[-1,3], [2,2],[2,3]]} },
  ]
}

export const AbilityOgreSmashSmashSmash ={
  name:"AbilityOgreSmashSmashSmash",
  inherit:["AbilityOgreSmash"],
  components:[
    { type: "AbilityTarget", properties: {coords: [[-1,-2],[0,-2],[1,-2],[2,-2],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,1],
      [3,-1],[-2,0],[-1,0],[2,0],[3,0],[-2,1],[-1,1],[2,-1],[3,1],[-2,2],[-1,2],[2,2],[3,2]
      ]} },
  ]
}

export const AbilityOgreSmashSmashSmashSmash ={
  name:"AbilityOgreSmashSmashSmashSmash",
  inherit:["AbilityOgreSmash"],
  components:[
    { type: "AbilityTarget", properties: {coords: [[-1,-2],[0,-2],[1,-2],[2,-1],[2,-2],[-2,-1],[-1,-1],[0,-1],[2,1],[1,-1],
      [3,-1],[-2,0],[-1,0],[2,0],[3,0],[-2,1],[-1,1],[3,1],[-2,2],[-1,2],[2,2],[3,2],
      [0,2],[1,2],[-1,3],[0,3],[1,3],[2,3]
      ]} },
  ]
}

export const AbilityOgreRockThrow = {
  name: "AbilityOgreRockThrow",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Ogre Smash", description: "Yeets a boulder 3 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityOgreRockThrow} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName",properties: {smallName: "RTH"}},
    { type: "AbilityTarget", properties: {coords: [[0,-1],[1,-1], [0,-2], [1,-2], [0,-3], [1,-3], [0,-4], [1,-4], [0,-5], [1,-5], [0,-6], [1,-6], [0,-7], [1,-7], [0,-8], [1,-8] ]} },
    { type:"AbilityAllowedDie", properties: {allowed:[6]}  },
    { type: "AbilityDamage", properties: {dmg:4} },
    { type: "AbilityEndsTurn"}
  ]
}

export const Hunt = {
  name: "Hunt",
  components:[
    { type: "description"},
    { type: "HuntScenarios", properties: {scenarios: ["Scenario","Orc Test Scenario","Ogre Test Scenario"]}}
  ]
}

export const OrcTestScenario = {
  name: "Orc Test Scenario",
  inherit:["Scenario"],
  components:[
    {type: "ScenarioBattle", properties: {enemies: [["Orc Warrior", 4]], allies: [ ["Goblin Archer",4] ]}}
  ]
}

export const OgreTestScenario = {
  name: "Ogre Test Scenario",
  inherit:["Scenario"],
  components:[
    {type: "ScenarioBattle", properties: {enemies: [["Ogre", 1]], allies: [  ]}}
  ]
}