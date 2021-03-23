import world from "../state/ecs";
import * as components from "../state/component"
import { grid } from "../lib/canvas";
import { addCacheSet, deleteCacheSet, readCacheSet } from "../state/cache";
import {toCell, toLocId} from "../lib/grid"

export const AttemptMove = (moveComp, entity) => {
    //move comp will contain an x/y change

    //entity is the moving entity
    //console.log("check here")
    //console.log(moveComp)
    //console.log(entity)

    let mx = moveComp.x;
    let my = moveComp.y;

    mx = entity.position.x + mx;
    my = entity.position.y + my;

    // this is where we will run any checks to see if entity can move to new location
    // observe map boundaries
    //mx = Math.min(0, Math.max(grid.map.width-1, mx))
    //my = Math.min(0, Math.max(grid.map.height-1, my))
    
    // mx = Math.min(grid.map.width + grid.map.x - 1, Math.max(grid.map.width, mx));
    // my = Math.min(grid.map.height + grid.map.y - 1, Math.max(grid.map.height, my));

    // check for blockers
    const blockers = [];
    const fastAttacks = [];
    // read from cache
    //console.log(`${mx},${my}`)
    const entitiesAtLoc = readCacheSet("entitiesAtLocation", `${mx},${my}`);
    //console.log(entitiesAtLoc)
    for (const eId of entitiesAtLoc) {
        if( world.getEntity(eId).has(components.IsBlocking) && entity.has(components.MultiTileHead) && !entity.multiTileHead.bodyEntities.includes(eId) ){
          blockers.push(eId);
        }else if (world.getEntity(eId).has(components.IsBlocking)  ) {
          blockers.push(eId);
        } 
    }

    if(blockers.length >= 1){
        //we can't move here
        //console.log('blocked')
        return false;
    }

    //check current tile for fast attacks
    const entitiesAtCurrentLoc = readCacheSet("entitiesAtLocation", toLocId({x:entity.position.x,y:entity.position.y}))
    for (const eId of entitiesAtCurrentLoc) {
      //console.log(world.getEntity(eId))
      if(world.getEntity(eId).fastAttack) {
        fastAttacks.push(entity)
      }
    }
    //check if we found any
    if(fastAttacks.length >= 1){
      //we need dodge to move.
      if(entity.movement.dodge < 1){
        //console.log("no dodge")
        return false;
      }else {
        //remove 1 dodge for getting out of tile
        //entity.movement.dodge = Math.max(0,entity.movement.dodge - 1)
      }
    }

    //check if we multi, if yes move body parts
    if(entity.has(components.MultiTileHead)){
      entity.multiTileHead.bodyEntities.forEach( bodyPart => {
        var body = world.getEntity(bodyPart)
        
        deleteCacheSet("entitiesAtLocation",
        `${body.position.x},${body.position.y}`,
        body.id)

        
        body.position.x += moveComp.x
        body.position.y += moveComp.y

        addCacheSet("entitiesAtLocation", `${body.position.x},${body.position.y}`, body.id);
      })
    }

    //we can move to this position
    deleteCacheSet(
        "entitiesAtLocation",
        `${entity.position.x},${entity.position.y}`,
        entity.id
      );
      addCacheSet("entitiesAtLocation", `${mx},${my}`, entity.id);
  
      entity.position.x = mx;
      entity.position.y = my;

      console.log(mx +':'+my)
  
    return true
}
