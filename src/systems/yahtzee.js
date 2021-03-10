export const CheckSingles = (counts, amountToMatch = 1, Allowed = [1,2,3,4,5,6]) => {
    return (CheckSames(counts,1))
}

export const CheckDoubles = (counts) => {
    return (CheckSames(counts,2))
}

export const CheckTriples = (counts) => {
    return (CheckSames(counts,3))
}

export const CheckQuads = (counts) => {
    return (CheckSames(counts,4))
}

export const CheckSames = (counts, match) => {
    var found = false;
    for (let x = 1; x < 7; x++) {
        if(counts[x] && counts[x] == match){
            console.log("found match")
            found = true
        }
    }
    console.log(counts)
    console.log(found)
    console.log("match:" + match)
    return found
}

export const CheckStraight = (counts, match) => {
    var found = false;
    var matched = 1;
    for(var x = 1; x < 7; x++){
        if(counts[x] || 0) { //make sure this die exists
            if(counts[x-1] || 0){ //make sure previous die exists
                if(counts[x] == counts[x-1]){ //if current die equals previous die
                    matched++; //we found a match so up it
                    if(matched == match){ // if our matched count equals our straight target found = true
                        found = true
                    }
                }else {
                    matched = 1; //current doesn't match previous set matched back to count 1
                }
            }
        }
    }

    console.log(counts)

    return found
}