import world from "../state/ecs";
import { random, sample, times } from "lodash";
import {grid} from "../lib/canvas"
import * as ROT from "rot-js";
import {readCacheSet} from "./cache"
import {Appearance, Health, LayerMap, Position} from "./component"
import {toCell, toLocId} from "../lib/grid"

const layerMapEntities = world.createQuery({
    all: [Position, Appearance, LayerMap]
  });

const dungeonMapGen = new ROT.Map.Arena(grid.map.width, grid.map.height);

export const dungeonMap = []

export const makeMap = () => {
    dungeonMapGen.create(function(x, y, wall) {
        //display1.draw(x, y, wall ? "#" : ".");
        if(wall){
            world.createPrefab("Wall").add(Position, {x,y})
        }else{
            world.createPrefab("Floor").add(Position, {x,y})
        }
    });
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

