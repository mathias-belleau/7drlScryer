//class for keeping track of population

import world from "./ecs"

const { times } = require("lodash")
const villageColors = ["green","blue","red","purple","white","yellow","pink"]

export class Town {
    constructor(population, townName) {
        this.CurrrentActivePlayer = 0
        this.CurrrentActivePlayerIndex = 0
        this.ActiveHunters = []

        this.townName = townName

        this.population = {}
        //for each population we need to make a new default villager and add it
        for(var x = 0; x < population; x++){
            var newVillager =  world.createPrefab("PlayerBeing", {
                appearance: {char: "@", color: villageColors[x]}
              });
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
        this.ActiveHunters=hunts
    }
}

var gameTown = new Town(4,"beep")
export default gameTown;