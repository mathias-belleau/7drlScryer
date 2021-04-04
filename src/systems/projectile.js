import world from "../state/ecs"
import {readCacheSet} from "../state/cache"
import * as components from "../state/component"
import {toLocId} from "../lib/grid"
import {RotateCoords, RotateCoordsDirection} from "./abilities"
import {addCacheSet, deleteCacheSet} from "../state/cache"

var _projectileList = {}

export const GetProjectileList = () => {
    return Object.values(_projectileList)
}

export const ClearProjectiles = () => {
    Object.keys(_projectileList).forEach(keyname =>{
        ClearProjectile(keyname)
    })
   
        
    _projectileList = {}
}

export function ClearProjectile(keyname) {
    _projectileList[keyname].paths.forEach(paths => {
        console.log(paths.id)
        world.destroyEntity(paths.id)
    })
    console.log('primary')
    console.log(_projectileList[keyname].id)
    world.destroyEntity(_projectileList[keyname].id)
    delete _projectileList[keyname]
}

export const CreateNewPath = (ability, entity, target) => {
    var newPath = world.createPrefab("ProjectilePath")
    newPath.ability = ability;
    newPath.entity = entity;
    var direction = RotateCoordsDirection(ability,entity,target);
    if(direction == "up"){
        newPath.appearance.char = "^"
    }else if(direction == "down"){
        newPath.appearance.char = "v"
    }else if(direction == "left"){
        newPath.appearance.char = "<"
    }else if(direction == "right"){ 
        newPath.appearance.char = ">"
    }
    
    var coords = RotateCoords(ability,entity,target)
    newPath.paths = []
    //make path
    coords.forEach(path => {
        var newPathTile = world.createPrefab("Projectile")
        newPathTile.add(components.Position, {x: path[0] + entity.position.x,y:path[1] + entity.position.y})
        newPathTile.pathId = newPath.id
        newPathTile.appearance = newPath.appearance
        newPath.paths.push(newPathTile)
    })

    newPath.dmgTiles = []
    ability.abilityTarget.coords.forEach(coord => {
        var newDmgTile = world.createEntity()
        newDmgTile.add(components.Position, {x:entity.position.x + coord[0],y:entity.position.y + coord[1]} )
        newDmgTile.add(components.SlowAttack)
        newDmgTile.add(components.DmgTile, {dmg: ability.abilityDamage.dmg})
        newDmgTile.add(components.DmgTileAfterEffect, {ability: ability.abilityFunction.function.onAffect, attacker: entity })
        newPath.dmgTiles.push(newDmgTile)
    })


    _projectileList[newPath.id] = newPath
    FindIntersect(newPath)
    return newPath
}

export const UpdateIntersect =(path) =>{
    //clear all invisible components
    _projectileList[path].paths.forEach(path => {
        if(path.has(components.Invisible)){
            path.remove(path.invisible)
        }
    })
    FindIntersect(_projectileList[path])
}

const FindIntersect = (path) =>{
    //for loop over paths
    var found = false
    var foundXY = {x:0,y:0}
    for(var x = 0; x < path.paths.length; x++){
        if(found){
            path.paths[x].add(components.Invisible)    
        }else{
            var getEntitiesAtLoc = readCacheSet("entitiesAtLocation", toLocId({x:path.paths[x].position.x,y:path.paths[x].position.y}))
            if(!getEntitiesAtLoc || getEntitiesAtLoc.length == 0){
                continue;
            }
            getEntitiesAtLoc = [...getEntitiesAtLoc]
            for(var loc = 0; loc < getEntitiesAtLoc.length; loc++){
                var ent = world.getEntity(getEntitiesAtLoc[loc])

                if(ent && ent.has(components.IsBlocking)){
                    //this is our blocker so set it here
                    if(!found){
                        found = true
                        foundXY = {x:ent.position.x,y:ent.position.y}
                        
                    }
                }
            }
        }
    }

    if(!found){
        //set to last projectile path
        foundXY = {x: path.paths[path.paths.length-1].position.x, y: path.paths[path.paths.length-1].position.y}
    }
    for(var dmgX = 0; dmgX < path.dmgTiles.length; dmgX++){
        deleteCacheSet("entitiesAtLocation", `${path.dmgTiles[dmgX].position.x},${path.dmgTiles[dmgX].position.y}`, path.dmgTiles[dmgX].id);
        path.dmgTiles[dmgX].position.x = foundXY.x  + path.ability.abilityTarget.coords[dmgX][0]
        path.dmgTiles[dmgX].position.y = foundXY.y  + path.ability.abilityTarget.coords[dmgX][1]
        addCacheSet("entitiesAtLocation", `${path.dmgTiles[dmgX].position.x},${path.dmgTiles[dmgX].position.y}`, path.dmgTiles[dmgX].id);
    }
}
