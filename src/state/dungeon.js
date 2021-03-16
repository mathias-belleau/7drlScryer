import world from "../state/ecs";
import { random, sample, times } from "lodash";
import {grid} from "../lib/canvas"
import * as ROT from "rot-js";
import {readCacheSet} from "./cache"
import * as components from "./component"
import {toCell, toLocId} from "../lib/grid"

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

