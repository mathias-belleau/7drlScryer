import { Engine } from "geotic";

import * as components from "./component"

import {Being, Tile,
Wall, Floor,
PlayerBeing, Mob,
Goblin,
} from "./prefab"

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

//ability
ecs.registerComponent(components.AbilityList)

ecs.registerComponent(components.Ability)
ecs.registerComponent(components.AbilityMove)




//prefabs

ecs.registerPrefab(Tile)
ecs.registerPrefab(Being)

ecs.registerPrefab(Wall)
ecs.registerPrefab(Floor)

ecs.registerPrefab(PlayerBeing)
ecs.registerPrefab(Mob)

ecs.registerPrefab(Goblin)

export const messageLog = ["", "Welcome to Gobs 'O Goblins!", ""];
export const addLog = (text) => {
  messageLog.unshift(text);
};

export default world;