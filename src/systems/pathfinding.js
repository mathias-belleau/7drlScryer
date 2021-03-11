import {readCacheSet} from "../state/cache"
import world from "../state/ecs"
import * as components from "../state/component"
import * as ROT from "rot-js";
import {toLocId} from "../lib/grid"

const allyEntities = world.createQuery({
    all: [components.Position, components.Appearance, components.LayerUnit],
    none: [components.IsEnemy]
})

const MakeDijkstra = (x,y) =>{
    /* prepare path to given coords */
    var dijkstra = new ROT.Path.Dijkstra(x, y, passableCallback, {topology :4});
    return dijkstra
}

export const AiPathfind = (entity) => {
    var dijkstra = MakeDijkstra(entity.position.x,entity.position.y)
    console.log("path finder")
    console.log(dijkstra)
    var target = FindClosestTarget(dijkstra, entity)
    console.log(target)
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

    //if entity has isEnemy,
    if(entity.has(components.IsEnemy)) {
        //loop through all allies and get their coords and calc path
        
        console.log("enemies to check: " + allyEntities.get().length)
        allyEntities.get().forEach( entity => {
            var closest = []
            // console.log(entity)
            dijkstra.compute(entity.position.x, entity.position.y, function (x,y) {
                // console.log('test path?')

                closest.push([x,y])
            })
            if(!winner || closest.length < winner.length){
                winner = closest
            }
        })
    }
    //  
        //loop through all enemies and get their coords and calc path
    return winner
}

const testingCB = () => {

}

const passableCallback = (x,y) => {
    //console.log("checking coords: " + x + ":" + y)
    //get entities at x,y
    var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:x,y:y}))

    if(!getEntitiesAtLoc){
        return 0
    }

    getEntitiesAtLoc.forEach( eid => {
        var entity = world.getEntity(eid)

        if(entity.has(components.IsBlocking)){
            return 0
        }
    })
    //if length 0, return 1
    //if any isBlock return 1

    //return 0
    return 1
}