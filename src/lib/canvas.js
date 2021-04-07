const pixelRatio = window.devicePixelRatio || 1;
const canvas = document.querySelector("#game");
import * as ROT from "rot-js";

export const grid = {
    width: 50,
    height: 22,
  
    map: {
      width: 20,
      height: 10,
      x: 10,
      y: 3,
    },

    enemies: {
      width:10,
      height:10,
      x: 31,
      y: 3
    },

    activePlayer: {
      width: 10,
      height: 2,
      x:0,
      y:3
    },

    dieMenu: {
      width:50,
      height:2,
      x: 11,
      y: 14
    },

    abilityMenu: {
      width:30,
      height:1,
      x:11,
      y:17
    },

    phaseMenu: {
      width: 20,
      height:1,
      x: 12,
      y: 2
    },

    helpMenu: {
      width:45,
      height:30
    },

    messageLog: {
      width: 50,
      height: 5,
      x: 2,
      y: 0
    },

    town: {
      townMenu: {
        x: 5,
        y: 2
      },
      villagerMenu:{
        x:5,
        y:2
      },
      villagerInfo:{
        x: 25,
        y:2
      },
    }
}

const displayOptions = {
    // Configure the display
    bg: "black", // background
    fg: "Grey", // foreground
    fontFamily: "Fira Mono", // font (use a monospace for esthetics)
    width: grid.width,
    height: grid.height, // canvas height and width
    fontSize: 18, // canvas fontsize
    forceSquareRatio: true // make the canvas squared ratio
  };

export const display = new ROT.Display(displayOptions);
document.body.appendChild(display.getContainer());

const displayOptionsHelp = {
  // Configure the display
  bg: "black", // background
  fg: "Grey", // foreground
  fontFamily: "Fira Mono", // font (use a monospace for esthetics)
  width: grid.helpMenu.width,
  height: grid.helpMenu.height, // canvas height and width
  fontSize: 18, // canvas fontsize
  forceSquareRatio: false // make the canvas squared ratio
}

export const  divHelp = document.createElement('div');
divHelp.id = 'helpMenu';
divHelp.setAttribute("class", 'helpMenuHidden')

document.body.appendChild(divHelp);

export const displayHelp = new ROT.Display(displayOptionsHelp);
divHelp.appendChild(displayHelp.getContainer())
displayHelp.drawText(0,0,"HELLO CAN YOU SEE THIS")


const displayOptionsMsg = {
  // Configure the display
  bg: "black", // background
  fg: "Grey", // foreground
  fontFamily: "Fira Mono", // font (use a monospace for esthetics)
  width: grid.messageLog.width,
  height: grid.messageLog.height, // canvas height and width
  fontSize: 18, // canvas fontsize
  forceSquareRatio: false // make the canvas squared ratio
}

export const  divMSG = document.createElement('div');
divMSG.id = 'divMSG';
divMSG.setAttribute("class", 'divMsgHidden')

export const displayMsg = new ROT.Display(displayOptionsMsg);
document.body.appendChild(divMSG);
divMSG.appendChild(displayMsg.getContainer())