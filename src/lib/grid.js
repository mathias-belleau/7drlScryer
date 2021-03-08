export const toCell = (cellOrId) => {
    let cell = cellOrId;
    if (typeof cell === "string") cell = idToCell(cell);
  
    return cell;
  };
  
  export const toLocId = (cellOrId) => {
    let locId = cellOrId;
    if (typeof locId !== "string") locId = cellToId(locId);
  
    return locId;
  };


  const idToCell = (id) => {
    const coords = id.split(",");
    return { x: parseInt(coords[0], 10), y: parseInt(coords[1], 10) };
  };
  
  const cellToId = ({ x, y }) => `${x},${y}`;