import { Engine } from "geotic";

import * as components from "./component"

import * as prefabs from "./prefab"

const ecs = new Engine();

const world = ecs.createWorld();

ecs.registerComponent(components.Appearance);
ecs.registerComponent(components.Armour)
ecs.registerComponent(components.Description);
ecs.registerComponent(components.Health)
ecs.registerComponent(components.IsBlocking)
ecs.registerComponent(components.IsDead)
ecs.registerComponent(components.IsPlayerControlled)
ecs.registerComponent(components.IsEnemy)
ecs.registerComponent(components.LayerMap);
ecs.registerComponent(components.LayerUnit)
ecs.registerComponent(components.Movement)
ecs.registerComponent(components.Position)
ecs.registerComponent(components.Stamina)
ecs.registerComponent(components.Die)
ecs.registerComponent(components.SlowAttack)
ecs.registerComponent(components.FastAttack)
ecs.registerComponent(components.DmgTile)
ecs.registerComponent(components.IsTurnEnd)

//ability
ecs.registerComponent(components.AbilityList)
ecs.registerComponent(components.AbilityFunction)
ecs.registerComponent(components.AbilityPhase)
ecs.registerComponent(components.AbilitySpeed)
ecs.registerComponent(components.AbilityStaminaCost)
ecs.registerComponent(components.AbilitySmallName)
ecs.registerComponent(components.AbilityTarget)
ecs.registerComponent(components.AbilityAllowedDie)
ecs.registerComponent(components.GainMovement)
ecs.registerComponent(components.AbilityRange)
ecs.registerComponent(components.AbilityDamage)
ecs.registerComponent(components.AbilityEndsTurn)


//prefabs

ecs.registerPrefab(prefabs.Tile)
ecs.registerPrefab(prefabs.Being)

ecs.registerPrefab(prefabs.Wall)
ecs.registerPrefab(prefabs.Floor)

ecs.registerPrefab(prefabs.PlayerBeing)
ecs.registerPrefab(prefabs.Mob)

ecs.registerPrefab(prefabs.Goblin)
ecs.registerPrefab(prefabs.OrcWarrior)

ecs.registerPrefab(prefabs.Ability)
ecs.registerPrefab(prefabs.AbilityMove)
ecs.registerPrefab(prefabs.AbilityDodge)
ecs.registerPrefab(prefabs.AbilitySpearThrust)
ecs.registerPrefab(prefabs.AbilitySwordJab)
ecs.registerPrefab(prefabs.AbilitySwordSwing)
ecs.registerPrefab(prefabs.AbilityDoubleAxeSwing)
ecs.registerPrefab(prefabs.AbilityAxeDecapitate)

export const messageLog = ["", "Welcome to Gobs 'O Goblins!", ""];
export const addLog = (text) => {
  messageLog.unshift(text);
};

export default world;