import { Engine } from "geotic";

import * as components from "./component"

import * as prefabs from "./prefab"

const ecs = new Engine();

const world = ecs.createWorld();

  console.log("got here first")
  ecs.registerComponent(components.Appearance);
  ecs.registerComponent(components.Armour)
  ecs.registerComponent(components.Description);
  ecs.registerComponent(components.MessageTxt)
  ecs.registerComponent(components.Health)
  ecs.registerComponent(components.ActiveHunter)
  ecs.registerComponent(components.Hunter)
  ecs.registerComponent(components.CraftingIngredient)
  ecs.registerComponent(components.IsBlocking)
  ecs.registerComponent(components.IsDead)
  ecs.registerComponent(components.IsPlayerControlled)
  ecs.registerComponent(components.IsEnemy)
  ecs.registerComponent(components.LayerMap);
  ecs.registerComponent(components.LayerItem)
  ecs.registerComponent(components.LayerUnit)
  ecs.registerComponent(components.Movement)
  ecs.registerComponent(components.Position)
  ecs.registerComponent(components.Stamina)
  ecs.registerComponent(components.Die)
  ecs.registerComponent(components.SlowAttack)
  ecs.registerComponent(components.FastAttack)
  ecs.registerComponent(components.DmgTile)
  ecs.registerComponent(components.DmgTileAfterEffect)
  ecs.registerComponent(components.IsTurnEnd)
  ecs.registerComponent(components.Ai)
  ecs.registerComponent(components.MultiTileHead)
  ecs.registerComponent(components.MultiTileBody)
  ecs.registerComponent(components.Armour)
  ecs.registerComponent(components.ArmourDie)
  ecs.registerComponent(components.Invisible)
  ecs.registerComponent(components.Duration)
  ecs.registerComponent(components.Companion)
  ecs.registerComponent(components.NoCorpse)

  //inventory
  ecs.registerComponent(components.EquipmentSlot);
  ecs.registerComponent(components.ItemSlot)
  ecs.registerComponent(components.ItemCraftingRecipe)
  ecs.registerComponent(components.ItemAbilities)
  ecs.registerComponent(components.ItemArmourRating)
  ecs.registerComponent(components.ItemCompanions)

  ecs.registerComponent(components.ProjectileTile)

  //ability
  ecs.registerComponent(components.AbilityList)
  ecs.registerComponent(components.AbilityFunction)
  ecs.registerComponent(components.AbilityPhase)
  ecs.registerComponent(components.AbilitySpeed)
  ecs.registerComponent(components.AbilitySmallName)
  ecs.registerComponent(components.AbilityTarget)
  ecs.registerComponent(components.AbilityAllowedDie)
  ecs.registerComponent(components.GainMovement)
  ecs.registerComponent(components.AbilityDamage)
  ecs.registerComponent(components.AbilityEndsTurn)
  ecs.registerComponent(components.AbilityGrabBagList)
  ecs.registerComponent(components.AbilityProjectile)
  ecs.registerComponent(components.AbilitySummon)


  //status affects
  ecs.registerComponent(components.StatusInvigorate)
  ecs.registerComponent(components.StatusCripple)
//unit abilities
ecs.registerComponent(components.OgreRage)

//scenario
ecs.registerComponent(components.ScenarioBattle)
ecs.registerComponent(components.ScenarioChoice)
ecs.registerComponent(components.ScenarioMessage)

//hunt
ecs.registerComponent(components.HuntScenarios)


  //prefabs
//bases
  ecs.registerPrefab(prefabs.Tile)
  ecs.registerPrefab(prefabs.Being)
  ecs.registerPrefab(prefabs.Scenario)
  ecs.registerPrefab(prefabs.MultiTileBody)

  ecs.registerPrefab(prefabs.Projectile)
  ecs.registerPrefab(prefabs.ProjectilePath)


  ecs.registerPrefab(prefabs.Wall)
  ecs.registerPrefab(prefabs.Floor)

  ecs.registerPrefab(prefabs.PlayerBeing)
  ecs.registerPrefab(prefabs.Mob)


  ecs.registerPrefab(prefabs.Dog)
  ecs.registerPrefab(prefabs.Goblin)
  ecs.registerPrefab(prefabs.GoblinArcher)
  ecs.registerPrefab(prefabs.OrcWarrior)
  ecs.registerPrefab(prefabs.GoblinShaman)
  ecs.registerPrefab(prefabs.Ogre)

  ecs.registerPrefab(prefabs.Ability)
  ecs.registerPrefab(prefabs.AbilityDoNothing)
  ecs.registerPrefab(prefabs.AbilityMove)
  ecs.registerPrefab(prefabs.AbilityDodge)
  ecs.registerPrefab(prefabs.AbilitySpearThrust)
  ecs.registerPrefab(prefabs.AbilitySwordJab)
  ecs.registerPrefab(prefabs.AbilitySwordSwing)
  ecs.registerPrefab(prefabs.AbilityDoubleAxeSwing)
  ecs.registerPrefab(prefabs.AbilityAxeDecapitate)
  ecs.registerPrefab(prefabs.AbilityFlameHands)
  ecs.registerPrefab(prefabs.AbilitySummonGoblin)
  ecs.registerPrefab(prefabs.AbilityAnimateDead)
  ecs.registerPrefab(prefabs.AbilityShieldRaise)
  ecs.registerPrefab(prefabs.AbilityBowShot)
  ecs.registerPrefab(prefabs.AbilityCrippleShot)
  ecs.registerPrefab(prefabs.AbilityDaggerStab)
  ecs.registerPrefab(prefabs.AbilityStaffBonk)
  ecs.registerPrefab(prefabs.AbilityMinorBlessing)
  ecs.registerPrefab(prefabs.AbilityMajorHeal)

  ecs.registerPrefab(prefabs.AbilityOgreSmash)
  ecs.registerPrefab(prefabs.AbilityOgreSmashSmash)
  ecs.registerPrefab(prefabs.AbilityOgreSmashSmashSmash)
  ecs.registerPrefab(prefabs.AbilityOgreSmashSmashSmashSmash)
  ecs.registerPrefab(prefabs.AbilityOgreRockThrow)

  
  //scenarios
  ecs.registerPrefab(prefabs.OrcTestScenario)
  ecs.registerPrefab(prefabs.OgreTestScenario)
  ecs.registerPrefab(prefabs.Hunt)
  
  //items
  ecs.registerPrefab(prefabs.ItemShortSword)
  ecs.registerPrefab(prefabs.ItemBuckler)
  ecs.registerPrefab(prefabs.ItemShortBow)
  ecs.registerPrefab(prefabs.ItemLeatherArmor)
  ecs.registerPrefab(prefabs.ItemPaddedLeatherArmor)
  ecs.registerPrefab(prefabs.ItemBoneArmor)
  ecs.registerPrefab(prefabs.ItemTomeSwamp)
  ecs.registerPrefab(prefabs.ItemTomeHealing)
  ecs.registerPrefab(prefabs.ItemDagger)
  ecs.registerPrefab(prefabs.ItemStaff)
ecs.registerPrefab(prefabs.ItemDogTreat)
export const messageLog = ["", "Welcome to Gobs 'O Goblins!", ""];
export const addLog = (text) => {
  messageLog.unshift(text);
};



 const layerItemEntities = world.createQuery({
  all: [components.LayerItem, components.Appearance, components.Position]
})

 const playerEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit, components.IsPlayerControlled],
  none: [components.IsDead, components.MultiTileBody]
});

 const dmgTileEntities = world.createQuery({
  all: [components.DmgTile]
})

 const layerMapEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerMap]
});

 const layerUnitEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit]
});

 const slowDmgEntities = world.createQuery({
  all: [components.Position, components.SlowAttack]
});

const fastDmgEntities = world.createQuery({
  all: [components.Position, components.FastAttack]
});

const allyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit],
  none: [components.IsEnemy, components.IsPlayerControlled, components.MultiTileBody]
})

const enemyEntities = world.createQuery({
  all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy],
  none: [components.IsDead, components.MultiTileBody]
})

export default world;
