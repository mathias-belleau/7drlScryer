import world from "../state/ecs"
import {RotateCoords} from "./abilities"
import * as components from "../state/component"
import {addCacheSet, deleteCacheSet} from "../state/cache"

var _targetEntities = []
var _targetAbility = []
var _targetEntity = {}
var _offset = {x:0,y:0}

export const GetTargetEntities = () => {
    return _targetEntities
}

export const GetTargetEntityPos = () => {
    return _offset
}

export const SetupTargetEntities = (ability, entity ) =>{
    ClearTargetEntities()
    //clear old targets just in case
    _targetAbility = ability
    _targetEntity = entity
    _offset = {x:0,y:-1}

    //get coords and create
    var firstCoords = RotateCoords(_targetAbility, _targetEntity, {x:_targetEntity.position.x, y:_targetEntity.position.y})
    firstCoords.forEach(firCord => {
        var targetEntity = world.createEntity()
        targetEntity.add(components.Appearance, {char: 'X', color: "black", background: "green"})
        targetEntity.add(components.Position, {x: firCord[0] + _targetEntity.position.x, y: firCord[1]+ _targetEntity.position.y})
        _targetEntities.push(targetEntity)
    })
}

export const ClearTargetEntities = () =>{
    console.log("target tile id")
    _targetEntities.forEach (targEnt => {
        console.log(targEnt.id)
        world.destroyEntity(targEnt.id)
    })
    _targetEntities = []
}

export const UpdateTargetEntities = (newX, newY) => {
    _offset = {x:newX,y:newY}
    //get new direction
    var coords = RotateCoords(_targetAbility, _targetEntity, {x:_targetEntity.position.x +newX, y:_targetEntity.position.y + newY})
    for(var x = 0; x < coords.length; x++){
        deleteCacheSet("entitiesAtLocation", `${_targetEntities[x].position.x},${_targetEntities[x].position.y}`, _targetEntities[x].id);
        _targetEntities[x].position.x = _targetEntity.position.x + coords[x][0]
        _targetEntities[x].position.y = _targetEntity.position.y + coords[x][1]
        addCacheSet("entitiesAtLocation", `${_targetEntities[x].position.x},${_targetEntities[x].position.y}`, _targetEntities[x].id);
    }
}

export const UseAbility = () => {
    _targetAbility.abilityFunction.function.onUse(_targetAbility, _targetEntity, {x:_offset.x + _targetEntity.position.x, y: _offset.y + _targetEntity.position.y})
}