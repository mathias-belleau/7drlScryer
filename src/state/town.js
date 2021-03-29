//class for keeping track of population

import world from "./ecs"
import * as components from "./component"
import * as Units from "../systems/units"

const { times } = require("lodash")
const villageColors = ["green","blue","orange","purple","white","yellow","pink"]

const DefMap = ['q','w','e','r','t','y']
const AtkMap = ['a','s','d','f','g','h']

export class Town {
    constructor(population, townName) {
        this.CurrrentActivePlayer = 0
        this.CurrrentActivePlayerIndex = 0
        this.ActiveHunters = []
        this.CurrentActivePlayerAbilityMap = []

        this.townName = townName

        this.population = {}
        //for each population we need to make a new default villager and add it
        for(var x = 0; x < population; x++){
            var newVillager =  world.createPrefab("PlayerBeing", {
                appearance: {char: "@", color: villageColors[x]}
              });
              Units.Init(newVillager)
            this.population[newVillager.id] = newVillager
        }
    }

    GetVillager(eid){
        return this.population[eid]
    }

    GetActive(){
        return this.GetVillager(this.CurrrentActivePlayer)
    }

    GetNextActive(){
        if(this.CurrrentActivePlayerIndex + 1 >= this.ActiveHunters.length){
            this.CurrrentActivePlayerIndex = 0
          }else {
            this.CurrrentActivePlayerIndex++
          }

          this.CurrrentActivePlayer = this.ActiveHunters[this.CurrrentActivePlayerIndex]
          if(world.getEntity(this.CurrrentActivePlayer).has(components.IsDead)){
              this.GetNextActive()
          }
          this.SetHunterMapping()
    }

    GetHunters(){
        return this.ActiveHunters
    }

    SetHunters(){
        var hunts = []
        //for now just return the first 4 hunters
        for (const [key, value] of Object.entries(this.population)) {
            //console.log(`${key}: ${value}`);
            hunts.push(key)
          }
        this.CurrrentActivePlayer = hunts[0]
        this.SetHunterMapping()
        this.ActiveHunters=hunts
    }

    SetHunterMapping(){
        //dictionary of keys to map hunter abilities.
        var defIndex = 0
        var atkIndex = 0
        this.CurrentActivePlayerAbilityMap = []
        //defensive abilities map to qwerty
        //attack abilities map to asdfgh
        var active = this.GetVillager(this.CurrrentActivePlayer)
        for(var x = 0; x < active.abilityGrabBagList.abilities.length;x++){
            if(active.abilityGrabBagList.abilities[x].abilityPhase.phase == "Attack"){
                this.CurrentActivePlayerAbilityMap[AtkMap[atkIndex]] = x
                atkIndex++;
            }else {
                this.CurrentActivePlayerAbilityMap[DefMap[defIndex]] = x
                defIndex++;
            }
        }
    }

    GetCurrentHunterAbilityMap(){
        return this.CurrentActivePlayerAbilityMap
    }

    GetCurrentHunterAbility(keyName){
        // var active = this.GetVillager(this.CurrrentActivePlayer)
        var hunt = this.GetActive()
        var index = this.CurrentActivePlayerAbilityMap[keyName]
        return hunt.abilityGrabBagList.abilities[index]
    }
}

var gameTown = new Town(4,"beep")
export default gameTown;