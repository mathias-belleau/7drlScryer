export const DoAiTurnDefend = (entity) => {
    //for each defense ability check if we can use
        //for each can use ability, check if we want to

            //check if we are on a fast tile
            //if yes 
                // if check if we can use dodge and then move

            //check if we are on a slow tile.
            //if yes, check if we can use move,
                //if yes, move to free tile
}

export const DoAiTurnAttack = (entity) => {
    // var attackUsed = 0
    //for each attack ability, check if we can use

    //check if we are in range to use?
        //if not in range
            //attempt move?
        //if in range && attackUsed == 0
            //use attack on target
            //attackUsed = 1
}

const GetDie = (entity) => {
    let dieList = []
    for(var x = 0;x < entity.die.length; x++){
        if(!entity.die[x].exhausted){
            dieList.push(entity.die[x].number)
        }
    }

    dieList.sort()
    var counts = {};
    dieList.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    //console.log(counts)
    return counts;
}