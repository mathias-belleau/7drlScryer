import world from "./ecs"
import { sample } from "lodash";
import {grid} from "../lib/canvas"
import * as ROT from "rot-js";
import {readCacheSet} from "./cache"
import * as components from "./component"
import {toLocId} from "../lib/grid"

const layerMapEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerMap]
  });

  const layerUnitEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit]
  });
  

const dungeonMapGen = new ROT.Map.Arena(grid.map.width, grid.map.height);

export const dungeonMap = []

export const makeMap = () => {
    CleanUp()
    dungeonMapGen.create(function(x, y, wall) {
        //display1.draw(x, y, wall ? "#" : ".");
        if(wall){
            world.createPrefab("Wall").add(components.Position, {x,y})
        }else{
            world.createPrefab("Floor").add(components.Position, {x,y})
        }
    });
}

const CleanUp = () => {
    //destroy all tiles
    layerMapEntities.get().forEach (tile => {
        tile.destroy()
    })
    //destroy all objects

    //destroy all units
    layerUnitEntities.get().forEach(unit => {
        unit.destroy()
    })
}

export const FetchFreeTile = () => {
    var anyFree = CreateFreeSpaceList();
    return sample(anyFree)
}   

const CreateFreeSpaceList = () => {
    var emptyTiles = []

    layerMapEntities.get().forEach((entity) => {
        if(entity.isBlocking){
            return;
        }
        var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))
        
        if(getEntitiesAtLoc.size == 1){
            //nothing but the tile here so can add to free
            emptyTiles.push(entity)
        }
    });
    return emptyTiles
}

export const FetchFreeTileTarget = (target, range) => {
    var anyFree = CreateFreeSpaceListTarget(target,range);
    return sample(anyFree)
}

const CreateFreeSpaceListTarget = (target, range) => {
    //for loop near target and make list of all free tiles
    var emptyTiles = []
    for(var x = Math.floor(range/2) * -1; x < Math.floor(range/2) + 1; x++){
        for (var y = Math.floor(range/2) * -1; y < Math.floor(range/2) + 1; y++){
            var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:x+target.x,y:y+target.y}))
            if(!getEntitiesAtLoc || getEntitiesAtLoc.length == 0){
                continue;
            }
            getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
            var blocked = false
            for(var z = 0; z < getEntitiesAtLoc.length; z++){
                var entity = world.getEntity(getEntitiesAtLoc[z]);
                if(!entity || entity.has(components.IsBlocking)){
                    blocked = true
                }
            }
            if(!blocked){
                var ent = world.getEntity(getEntitiesAtLoc[0])
                emptyTiles.push(ent)
            }
        }
    }
    return emptyTiles;
}

export const SpawnScenarioUnits = (prefabName, isEnemy, tileToSpawn = null) => {
    //spawn it
    var newUnit = world.createPrefab(prefabName);
    newUnit.fireEvent("init")
    //get an empty tile
    var emptyTile;
    if(tileToSpawn){
      emptyTile = tileToSpawn;
    }else if(newUnit.has(components.MultiTileHead)){ //if multitile get empty with clear south,east,se
      emptyTile = FetchFreeTile();
    }else {
      emptyTile = FetchFreeTile();
    }
    
    //add position
    newUnit.add(components.Position, {x: emptyTile.position.x, y: emptyTile.position.y})
  
    if(isEnemy){
      //add is enemy
      newUnit.add(components.IsEnemy)
    }else {
      //add background blue
      newUnit.appearance.color = "blue"
    }
  
    //if multiTile
      //spawn body parts
    var coords = [ [0,1], [1,0], [1,1]]
    if(newUnit.has(components.MultiTileHead)){
      coords.forEach(coord => {
        var newBodyPart = world.createPrefab("MultiTileBody")
        newBodyPart.add(components.Position, {x: emptyTile.position.x + coord[0], y: emptyTile.position.y + coord[1]})
        newBodyPart.appearance = newUnit.appearance
        newBodyPart.multiTileBody = {headID: newUnit.id}
        newUnit.multiTileHead.bodyEntities.push(newBodyPart.id)
      })
    }
    
}