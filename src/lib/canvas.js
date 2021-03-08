const pixelRatio = window.devicePixelRatio || 1;
const canvas = document.querySelector("#game");
import * as ROT from "rot-js";

export const grid = {
    width: 50,
    height: 34,
  
    map: {
      width: 30,
      height: 15,
      x: 7,
      y: 3,
    },

    activePlayer: {
      width: 10,
      height: 2,
      x:2,
      y:2
    },

    dieMenu: {
      width:50,
      height:2,
      x: 7,
      y: 20
    },

    phaseMenu: {
      width: 20,
      height:1,
      x: 15,
      y: 2
    }
}

const displayOptions = {
    // Configure the display
    bg: "black", // background
    fg: "dimGrey", // foreground
    fontFamily: "Fira Mono", // font (use a monospace for esthetics)
    width: grid.width,
    height: grid.height, // canvas height and width
    fontSize: 18, // canvas fontsize
    forceSquareRatio: true // make the canvas squared ratio
  };

export const display = new ROT.Display(displayOptions);
document.body.appendChild(display.getContainer());
display.draw(grid.map.x + 5,  grid.map.y + 4, "@");
display.draw(grid.map.x-1, grid.map.y -1 , '#')
display.draw(grid.map.x-1+grid.map.width, grid.map.y -1 , '#')
display.draw(grid.map.x-1, grid.map.y -1+ grid.map.height , '#')
display.draw(grid.map.x-1+grid.map.width, grid.map.y -1 + grid.map.height, '#')
display.draw(49,5,"3")
display.draw(49,33,"3")

display.drawText(0,0,"Hello")

