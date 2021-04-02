//used for drawing the help menu

import {display, displayHelp,divHelp, grid } from "../lib/canvas"
import * as Message from "./messagelog"

export const DrawHelpMenu = () => {
    MakeVisible()

    var helpText = "Welcome to my bad game"

    helpText += "\nExample, hit [1] key to activate die"
    helpText += "\nhit [q] key to activate movement"
    helpText += "\nyou now have movement pts in top left"
    helpText += "\nnow you can move with arrow keys"
    helpText += "\ndon't forget your other char [n]"

    helpText += "\n\nEnemies attack at end of playerdefendturn"
    helpText += "\nyou need to use dodge to get out of red attacks"
    helpText += "\nYou regen 4 stamina minus the amount used this turn"

    helpText += "\nplayer attacks resolve at end of the playerattackturn"

    helpText += "\n\nHOTKEYS:"
    helpText += "\nArrow Keys to move"
    helpText += "\nEnter to end turn / confirm target"
    helpText += "\nn: select next character"
    helpText += "\n1-6 are to select stamina dice"
    helpText += "\nqwerty keys selects abilites"
    helpText += "\nshift+qwerty keys for info"
    helpText += "\nz: shows enemy numbers matched on right"
    helpText += "\nc: shows dmg that will hit tile"
    helpText += "\nEscape to exit this and most menus"

    displayHelp.drawText(2,5,helpText)
}

export const HideHelpMenu = () => {
    displayHelp.clear()
    divHelp.setAttribute("class", 'helpMenuHidden')
}

const MakeVisible = () => {
    //make it visible
    divHelp.setAttribute("class", 'helpMenuVisible')

    var banner = "#".repeat(grid.helpMenu.width);
    displayHelp.drawText(0,0,banner)
}

export const ShowAbilityInfo = (abil) => {
    MakeVisible()
    var toWrite = WriteAbility(abil)
    displayHelp.drawText(2,5,toWrite)
    //Ability name
    //Ability short name
    //description
    //phase
}

export function ShowMessageLog(){
    MakeVisible()
    var getMsgs = Message.GetLogs(30)
    for(var y = 0; y < getMsgs.length; y++){
        displayHelp.drawText(1, y+1, getMsgs[y])
    }
}

const WriteAbility = (abil) => {
    var toWrite = ""

    toWrite += "\n"+abil.description.name
    toWrite += "\n"+abil.description.description
    toWrite += "\n"+abil.abilityPhase.phase
    toWrite += "\n"+abil.abilityPhase.speed

    return toWrite
}