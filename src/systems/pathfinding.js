import {readCacheSet} from "../state/cache";
import world from "../state/ecs";
import * as components from "../state/component";
import * as ROT from "rot-js";
import {toLocId} from "../lib/grid";


const allyEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit],
    none: [components.IsEnemy, components.IsPlayerControlled, components.MultiTileBody]
  })
  
const enemyEntities = world.createQuery({
all: [components.Position, components.Appearance, components.LayerUnit,components.IsEnemy],
none: [components.IsDead, components.MultiTileBody]
})

const MakeDijkstra = (x,y) =>{
    /* prepare path to given coords */
    var dijkstra = new ROT.Path.Dijkstra(x, y, passableCallback, {topology :4});
    return dijkstra
}

const MakeMultiDijkstra = (x,y) => {
    var dijkstra = new ROT.Path.Dijkstra(x,y, passableCallbackMulti, {topology: 4})
    return dijkstra
}

let pathingUnit = {};
export const AiPathfind = (entity) => {
    console.log(entity)
    pathingUnit= entity;
    var dijkstra;
    if(entity.has(components.MultiTileHead)){
        //awful solution, remove blocking from body parts for now
        // pathingUnit.multiTileHead.bodyEntities.forEach( bodyEnt => {
        //     var bodyPart = ECS.world.getEntity(bodyEnt);
        //     bodyPart.remove(bodyPart.isBlocking)
        // })
        dijkstra = MakeMultiDijkstra(entity.position.x,entity.position.y)

        // pathingUnit.multiTileHead.bodyEntities.forEach( bodyEnt => {
        //     var bodyPart = ECS.world.getEntity(bodyEnt);
        //     bodyPart.add(components.IsBlocking)
        // })
    }else {
        dijkstra = MakeDijkstra(entity.position.x,entity.position.y)
    }   
    //console.log("path finder")
    //console.log(dijkstra)
    var target = FindClosestTarget(dijkstra, entity)
    //console.log(target)
    //target.reverse()
    target.pop()
    return target

}

export const AiPathEmptyTile = (entity) => {
    var dijkstra = MakeDijkstra(entity.position.x,entity.position.y)
    var target = FindClosestEmptyTile(dijkstra, entity)
    target.pop()
    return target
}

const FindClosestEmptyTile = (dijkstra, entity) => {

}

const FindClosestTarget = (dijkstra, entity) => {
    var winner
    var toBeLooped = []
    if(entity.has(components.IsEnemy)) {
        toBeLooped = allyEntities.get()
    }else {
        toBeLooped = enemyEntities.get()
    }
    //loop through all allies and get their coords and calc path
    
    //console.log("enemies to check: " + allyEntities.get().length)
    toBeLooped.forEach( entity => {
        var closest = []
        // //console.log(entity)
        dijkstra.compute(entity.position.x, entity.position.y, function (x,y) {
            // //console.log('test path?')

            closest.push([x,y])
        })
        if(!winner || closest.length < winner.length){
            winner = closest
        }
    })
    
    console.log(winner)
    //  
        //loop through all enemies and get their coords and calc path
    return winner
}


export const CheckStraightLine = ([...path], currentXY) => {
    //console.log("in range check")
    //check if length = 1 then we are right next to target
    if(path.length == 1){
        //console.log("path short")
        return true
    }
    
    var Xs = []
    var Ys = []
    path.forEach(coords => {
        Xs.push(coords[0])
        Ys.push(coords[1])
    })
    //console.log(Xs.toString())
    //console.log(Ys.toString())
    //if((allEqual(Xs) || allEqual(Ys) ) && (currentXY.x == path[0][0] || currentXY.y == path[0][1]) ){
    if((currentXY.x == path[0][0] || currentXY.y == path[0][1]) ){
        return true
    }else {
        return false
    }
}

const allEqual = arr => arr.every( v => v === arr[0] )


const testingCB = () => {

}

const passableCallback = (x,y) => {
    ////console.log("checking coords: " + x + ":" + y)
    //get entities at x,y
    
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:x,y:y}))
    if(!getEntitiesAtLoc){
        return false
    }
    getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
    const entityIsEnemy = pathingUnit.has(components.IsEnemy)
    for (var x = 0; x < getEntitiesAtLoc.length; x++){
        if(getEntitiesAtLoc[x] != pathingUnit.id) {
            var ent = world.getEntity(getEntitiesAtLoc[x])
            if(ent.has(components.IsBlocking) && (ent.has(components.LayerMap) || ent.has(components.IsEnemy) == entityIsEnemy) ){
                    return false
            }
        }else {
            return true
        }
    }
    
    //return 0
    return true
}

const passableCallbackMulti = (x,y) => {
    ////console.log("checking coords: " + x + ":" + y)
    //get entities at x,y
    
    //check east/south/se for blocking if any return false
    //[0,1], [1,0], [1,1]
    //but also need to check these aren't our current body tiles
    

    // if( (pathingUnit.position.x == x && pathingUnit.position.y+1 == y) ||
    // (pathingUnit.position.x+1 == x && pathingUnit.position.y == y) ||
    // (pathingUnit.position.x+1 == x && pathingUnit.position.y+1 == y) ){
    //     return true
    // }

   

    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:x,y:y}))
    if(!getEntitiesAtLoc){
        return false
    }
    getEntitiesAtLoc = Array.from(getEntitiesAtLoc)
    const entityIsEnemy = pathingUnit.has(components.IsEnemy)
    for (var x = 0; x < getEntitiesAtLoc.length; x++){
        if(getEntitiesAtLoc[x] != pathingUnit.id && !pathingUnit.multiTileHead.bodyEntities.includes(getEntitiesAtLoc[x])) {
            var ent = world.getEntity(getEntitiesAtLoc[x])
            if(ent.has(components.IsBlocking) && (ent.has(components.LayerMap) || ent.has(components.IsEnemy) == entityIsEnemy) ){
                    return false
            }
            // if(!passableCallback(x,y+1) || !passableCallback(x+1,y) || !passableCallback(x+1,y+1)) {
            //     return false
            // }
        }else {
            return true
        }
    }
    
    //return 0
    return true
}
