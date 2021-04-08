//class for keeping track of population

import world from "./ecs"
import * as components from "./component"
import * as Units from "../systems/units"
import { activeHunter, playerEntities, hunterEntities, villagerEntities} from "../index"

const { times } = require("lodash")
const villageColors = ["green","blue","orange","purple","white","yellow","pink"]

//placeholder classes
const classes = [
    ["ItemShortSword","ItemBuckler","ItemPaddedLeatherArmor"],
    ["ItemShortBow","ItemLeatherArmor", "ItemDogTreat"],
    ["ItemDagger","ItemTomeSwamp","ItemBoneArmor"],
    ["ItemStaff","ItemTomeHealing"]
]

const DefMap = ['q','w','e','r','t','y']
const AtkMap = ['a','s','d','f','g','h']

// export class Town {
//     constructor(population, townName) {
//         this.CurrrentActivePlayer = 0
export var CurrrentActivePlayerIndex = 0
//         this.ActiveHunters = []
export var CurrentActivePlayerAbilityMap = []

//         this.townName = townName

//         this.population = {}
export function SetupVillage(population){
    for(var x = 0; x < population; x++){
        var newVillager =  world.createPrefab("PlayerBeing", {
            appearance: {char: "@", color: villageColors[x]},
            messageTxt: {msg: "%c{"+villageColors[x]+"}@%c{}"}
            });

        if(x < classes.length){
            //add equipment from class
            classes[x].forEach(equip =>{
                Units.EquipItem(newVillager, equip)
            })
        }
        Units.BuildAbilityListPlayer(newVillager)
        Units.Init(newVillager)
    }
    SetHunters()
}


export function GetVillager(eid){
    return world.getEntity(eid)
}

export function GetActive(){
    return activeHunter.get()[0]
}

export function GetNextActive(){
    if(CurrrentActivePlayerIndex + 1 >= hunterEntities.get().length){
        CurrrentActivePlayerIndex = 0
        }else {
        CurrrentActivePlayerIndex++
        }
        var currentActive = GetActive()
        currentActive.remove(currentActive.activeHunter)
        hunterEntities.get()[CurrrentActivePlayerIndex].add(components.ActiveHunter)
        if(GetActive().has(components.IsDead)){
            GetNextActive()
        }
        SetHunterMapping()
}

export function AddHunter(hunter){
    hunter.add(components.Hunter)
}

export function RemoveHunter(hunter){
    // var hunter = world.getEntity(hunterEID)
    hunter.remove(hunter.hunter)
}

function SetHunters(){
    var villagers = villagerEntities.get()

    //for now just return the first 4 hunters
    for(var x = 0; x < 4; x++){
        if(villagers[x]){
            villagers[x].add(components.Hunter)
        }

        if(x == 0){
            villagers[x].add(components.ActiveHunter)
        }
    }

    SetHunterMapping()
}

function SetHunterMapping(){
    //dictionary of keys to map hunter abilities.
    var defIndex = 0
    var atkIndex = 0
    CurrentActivePlayerAbilityMap = []
    //defensive abilities map to qwerty
    //attack abilities map to asdfgh
    var active = GetActive()
    for(var x = 0; x < active.abilityGrabBagList.abilities.length;x++){
        if(active.abilityGrabBagList.abilities[x].abilityPhase.phase == "Attack"){
            CurrentActivePlayerAbilityMap[AtkMap[atkIndex]] = x
            atkIndex++;
        }else {
            CurrentActivePlayerAbilityMap[DefMap[defIndex]] = x
            defIndex++;
        }
    }
}

export function GetCurrentHunterAbilityMap(){
    return CurrentActivePlayerAbilityMap
}

export function GetCurrentHunterAbility(keyName){
    // var active = this.GetVillager(this.CurrrentActivePlayer)
    var hunt = GetActive()
    var index = CurrentActivePlayerAbilityMap[keyName]
    return hunt.abilityGrabBagList.abilities[index]
}
// }

// var gameTown = new Town(6,"beep")
var gameTown = world.createEntity("gameTown")