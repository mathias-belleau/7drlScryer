
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
      {type:"Armour"},
      {type:"MessageTxt"}

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
      { type: "MessageTxt"}
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
    {type: "Stamina", properties: {max:8,current:8, used: 0, regen: 3}},
    {type: "EquipmentSlot"},
    {type: "EquipmentSlot", properties: {slot: "Offhand", eid:""}},
    {type: "EquipmentSlot", properties: {slot: "Body", eid:""}},
    {type: "EquipmentSlot", properties: {slot: "Utility", eid:""}},
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

export const Dog = {
  name: "Dog",
  inherit:["Mob"],
  components: [
    { type: "Appearance", properties: {char: "d", color: "brown"} },
    { type: "Description", properties: {name: "Dog", description: "A doggo"} },
    {
      type: "AbilityList",
      properties: {abilities: [ ["AbilityDaggerStab", 1], ["AbilityDoNothing",1]] }
    },
    {type: "Health", properties: {max:2,current:2}},
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}},
    {type: "MessageTxt", properties: {msg:"Dog"} }
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
    {type: "MessageTxt", properties: {msg:"Goblin"} }
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
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}},
    {type: "MessageTxt", properties: {msg:"Goblin Archer"} }
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
    { type: "Stamina", properties: { max: 2, current: 2, used: 0, regen: 2}},
    {type: "MessageTxt", properties: {msg:"Goblin Shaman"} }
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
    { type: "Stamina", properties: { max: 4, current: 4, used: 0, regen: 4}},
    {type: "MessageTxt", properties: {msg:"Orc Warrior"} }
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
    {type: "OgreRage"},
    {type: "MessageTxt", properties: {msg:"Ogre"} }
   
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
    {type: "MessageTxt", properties: {msg:"rests a moment"} }
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
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]} },,
    {type: "MessageTxt", properties: {msg:"thrusts their spear"} }
  ]
}

export const AbilityBowShot = {
  name: "AbilityBowShot",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Bow Shot", description: "dice value >= 10 for 2 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityBowShot} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "BOW"}     },
    { type: "AbilityTarget", properties: {coords: [[0,0]]}     },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]} },
    { type:"AbilityProjectile", properties: {path: [ [0,-1],[0,-2],[0,-3],[0,-4],[0,-5] ]} },
    { type: "AbilityDamage", properties: {dmg:2} },
    {type: "MessageTxt", properties: {msg:"fires an arrow"} }
  ]
}

export const AbilityCrippleShot = {
  name: "AbilityCrippleShot",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Cripple Shot", description: "dice value >= 12 for 2 dmg and cripple 3 movement"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityCrippleShot} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "CRS"}     },
    { type: "AbilityTarget", properties: {coords: [[0,0]]}     },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]} },
    { type:"AbilityProjectile", properties: {path: [ [0,-1],[0,-2],[0,-3],[0,-4],[0,-5] ]} },
    { type: "AbilityDamage", properties: {dmg:2} },
    {type: "MessageTxt", properties: {msg:"fires a crippling shot"} }
  ]
}

export const AbilityShieldRaise = {
  name: "AbilityShieldRaise",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Shield Raise", description: "exhausts 6 to gain 1 armour"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityShieldRaise} },
    { type: "AbilityPhase", properties: {phase: "Defend"} },
    { type: "AbilitySmallName", properties: {smallName: "SHR"}     },
    { type:"AbilityAllowedDie", properties: {allowed:[6]} },,
    {type: "MessageTxt", properties: {msg:"raises their shield."} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"jabs with their sword"} }
  ]
}

export const AbilityDaggerStab = {
  name: "AbilityDaggerStab",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Dagger Stab", description: "exhausts a  pair of 5,6 to do a slow attack on a single tile for 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityGenericDoubleSlow} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "DST"} },
    { type: "AbilityTarget", properties: {coords: [[0,-1]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]} },
    { type: "AbilityDamage", properties: {dmg:1} },
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"stabs with their dagger"} }
  ]
}



export const AbilityStaffBonk = {
  name: "AbilityStaffBonk",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Staff Bonk", description: "exhausts a pair 5,6 to do a slow attack on a 2 tiles for 1 dmg"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityGenericDoubleSlow} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName", properties: {smallName: "SBO"} },
    { type: "AbilityTarget", properties: {coords: [[0,-1],[0,1]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[5,6]} },
    { type: "AbilityDamage", properties: {dmg:1} },
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"thrusts their staff forward and back"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"swings their sword wildly"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"carelessly hacks with their axes"} }
  ]
}

export const AbilityFlameHands = {
  name: "AbilityFlameHands",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Flame Hands", description: "a cone shaped blast of fire using a straight 4 of dice"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityFlameHands} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    {type: "AbilitySmallName",properties: {smallName: "FLH"}},
    { type: "AbilityTarget", properties: {coords: [ [0,-1],[-1,-2],[0,-2],[1,-2],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3]  ]}},
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]}  },
    { type: "AbilityDamage", properties: {dmg:2} },
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"erupts flames from their hands"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"summons a poor goblin ally"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"raises the ${corpse} corpse back to life"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"swings their axe aiming for the throat"} }
  ]
}

export const AbilityMinorBlessing = {
  name: "AbilityMinorBlessing",
  inherit:["Ability"],
  components:[
    { type: "Description",
      properties: {name: "Minor Blessing", description: "straight 3: fires a healing bolt that processes instantly, Heals a target for 1 hp and grants them 1 armour"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityMinorBlessing} },
    { type: "AbilityPhase", properties: {phase: "Defend"} },
    { type: "AbilitySmallName",properties: {smallName: "MBL"}},
    { type: "AbilityTarget", properties: {coords: [[0,0]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]}  },
    { type: "AbilityDamage", properties: {dmg:1} },
    { type:"AbilityProjectile", properties: {path: [ [0,-1],[0,-2],[0,-3] ]} },
    { type: "AbilityDamage", properties: {dmg:0} },
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"chants a small blessing"} }
  ]
}

export const AbilityMajorHeal = {
  name: "AbilityMajorHeal",
  inherit:["Ability"],
  components: [
    { type: "Description",
      properties: {name: "Major Heal", description: "straight 4: fires a healing bolt that processes instantly, Heals a target for 3 hp"}},
    { type: "AbilityFunction", properties: {function: Abilities.AbilityMajorHeal} },
    { type: "AbilityPhase", properties: {phase: "Attack"} },
    { type: "AbilitySmallName",properties: {smallName: "MHE"}},
    { type: "AbilityTarget", properties: {coords: [[0,0]]} },
    { type:"AbilityAllowedDie", properties: {allowed:[1,2,3,4,5,6]}  },
    { type: "AbilityDamage", properties: {dmg:3} },
    { type:"AbilityProjectile", properties: {path: [ [0,-1],[0,-2],[0,-3], ]} },
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"fires a healing ray"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"attempts to squash the target"} }
  ]
}

export const AbilityOgreSmashSmash ={
  name:"AbilityOgreSmashSmash",
  inherit:["AbilityOgreSmash"],
  components:[
    { type: "AbilityTarget", properties: {coords: [[0,-1],[1,-1], [0,-2], [1,-2], [-1,-1],[-1,-2], [2,-1],[2,-2],
      [0,2],[1,2], [0,3], [1,3], [-1,2],[-1,3], [2,2],[2,3]]} },
      
    {type: "MessageTxt", properties: {msg:"angrily smashes the ground"} }
  ]
}

export const AbilityOgreSmashSmashSmash ={
  name:"AbilityOgreSmashSmashSmash",
  inherit:["AbilityOgreSmash"],
  components:[
    { type: "AbilityTarget", properties: {coords: [[-1,-2],[0,-2],[1,-2],[2,-2],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,1],
      [3,-1],[-2,0],[-1,0],[2,0],[3,0],[-2,1],[-1,1],[2,-1],[3,1],[-2,2],[-1,2],[2,2],[3,2]
      ]} },
      {type: "MessageTxt", properties: {msg:"roars while it smashes the ground"} }
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
      {type: "MessageTxt", properties: {msg:"in a blind rage smashes the ground around it"} }
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
    { type: "AbilityEndsTurn"},
    {type: "MessageTxt", properties: {msg:"yeets a boulder"} }
  ]
}

export const Hunt = {
  name: "Hunt",
  components:[
    { type: "description", properties: {name:"Ogre Hunt", description:"first hunt"}},
    { type: "HuntScenarios", properties: {scenarios: ["Scenario","Orc Test Scenario","Ogre Test Scenario"]}}
  ]
}

export const OrcTestScenario = {
  name: "Orc Test Scenario",
  inherit:["Scenario"],
  components:[
    {type: "ScenarioBattle", properties: {enemies: [["Orc Warrior", 4]], allies: [  ]}}
  ]
}

export const OgreTestScenario = {
  name: "Ogre Test Scenario",
  inherit:["Scenario"],
  components:[
    {type: "ScenarioBattle", properties: {enemies: [["Ogre", 1]], allies: [  ]}}
  ]
}

//equipment

export const ItemShortSword = {
  name: "ItemShortSword",
  components: [  
    {type: "ItemSlot", properties: {slot:"Hands"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilitySwordJab"],["AbilitySwordSwing"] ]}},
    {type: "ItemCraftingRecipe", properties: {items: [ ["bone",1]]}}
  ]
}

export const ItemBuckler = {
  name: "ItemBuckler",
  components: [  
    {type: "ItemSlot", properties: {slot:"Offhand"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilityShieldRaise"] ]}},
    {type: "ItemCraftingRecipe", properties: {items: [ ["leather",1]]}}
  ]
}

export const ItemShortBow = {
  name: "ItemShortBow",
  components: [  
    {type: "ItemSlot", properties: {slot:"Hands"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilityBowShot"], ["AbilityCrippleShot"] ]}},
    {type: "ItemCraftingRecipe", properties: {items: [ ["leather",1], ["bone",1]]}}
  ]
}

export const ItemDagger = {
  name:"ItemDagger",
  components: [
    {type: "ItemSlot", properties: {slot:"Hands"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilityDaggerStab"] ]}}
  ]
}

export const ItemStaff = {
  name: "ItemStaff",
  components: [
    {type: "ItemSlot", properties: {slot:"Hands"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilityStaffBonk"] ]}}
  ]
}

export const ItemTomeSwamp = {
  name:"ItemTomeSwamp",
  components: [
    {type: "ItemSlot", properties: {slot:"Offhand"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilityAnimateDead"], ["AbilityFlameHands"]] }}
  ]
}

export const ItemTomeHealing = {
  name:"ItemTomeHealing",
  components: [
    {type: "ItemSlot", properties: {slot:"Offhand"}},
    {type: "ItemAbilities", properties: {abilities: [ ["AbilityMinorBlessing"], ["AbilityMajorHeal"]] }}
  ]
}

//item armour

export const ItemLeatherArmor = {
  name: "ItemLeatherArmor",
  components: [  
    {type: "ItemSlot", properties: {slot:"Body"}},
    {type: "ItemAbilities"},
    {type: "ItemCraftingRecipe", properties: {items: [ ["leather",1], ["bone",1]]}},
    {type: "ItemArmourRating"}
  ]
}

export const ItemPaddedLeatherArmor = {
  name: "ItemPaddedLeatherArmor",
  components: [  
    {type: "ItemSlot", properties: {slot:"Body"}},
    {type: "ItemAbilities"},
    {type: "ItemCraftingRecipe", properties: {items: [ ["leather",1], ["bone",1]]}},
    {type: "ItemArmourRating", properties: {weight: "Medium", dice:2}}
  ]
}

export const ItemBoneArmor = {
  name: "ItemBoneArmor",
  components: [  
    {type: "ItemSlot", properties: {slot:"Body"}},
    {type: "ItemAbilities"},
    {type: "ItemCraftingRecipe", properties: {items: [ ["leather",1], ["bone",1]]}},
    {type: "ItemArmourRating", properties: {weight: "Medium", dice:1}}
  ]
}

//utility items
export const ItemDogTreat = {
  name: "ItemDogTreat",
  components: [  
    {type: "ItemSlot", properties: {slot:"Utility"}},
    {type: "ItemAbilities"},
    {type: "ItemCompanions", properties: {companions: [ ["Dog", 3] ] } }
  ]
}