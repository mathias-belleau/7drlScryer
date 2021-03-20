export const CheckSingles = (counts, Allowed = [1,2,3,4,5,6]) => {
    return (CheckSames(counts,1, Allowed))
}

export const CheckDoubles = (counts, Allowed = [1,2,3,4,5,6]) => {
    return (CheckSames(counts,2, Allowed))
}

export const CheckTriples = (counts, Allowed = [1,2,3,4,5,6]) => {
    return (CheckSames(counts,3, Allowed))
}

export const CheckQuads = (counts,  Allowed = [1,2,3,4,5,6]) => {
    return (CheckSames(counts,4, Allowed))
}

export const CheckSames = (counts, match, Allowed = [1,2,3,4,5,6]) => {
    var found = [];
    for (let x = 1; x < 7; x++) {
        if(counts[x] && counts[x] == match && Allowed.includes(x)){
            
            // console.log("found match")
            found.push(x)
        }
    }

    //if we went over allowed limit
    
    // console.log(counts)
    // console.log(found)
    // console.log("match:" + match)
    return found
}

export const CheckStraight = (counts, match) => {
    var found = [];
    var currentFound = []
    var matched = 1;
    for(var x = 1; x < 7; x++){
        if(counts[x] || false) { //make sure this die exists
            if(counts[x-1] || false){ //make sure previous die exists
                if(counts[x] == counts[x-1]){ //if current die equals previous die
                    matched++; //we found a match so up it
                    currentFound.push(x)
                    if(matched == match){ // if our matched count equals our straight target found = true
                        found = [...currentFound] //our found list should match current found
                    }
                }else {
                    matched = 1; //current doesn't match previous set matched back to count 1
                    currentFound = [] //clear current found list
                }
            }
        }
    }

    console.log(counts)

    return found
}