//used for drawing the help menu

import {display, displayHelp,divHelp, grid } from "../lib/canvas"

export const DrawHelpMenu = () => {
    MakeVisible()

    var helpText = "Welcome to my bad game, this is just placeholder help text for now"

    helpText += "\n\nEnemy attacks at end of player defend turn"
    helpText += "\nyou need to use dodge to get out of red attacks"
    helpText += "\nYou regen 4 stamina - the amount used this turn"

    helpText += "\nplayer attacks resolve at end of player attack turn"

    helpText += "\n\nHOTKEYS:"
    helpText += "\nArrow Keys to move"
    helpText += "\nEnter to end turn / confirm target"
    helpText += "\nn: select next character"
    helpText += "\n1-6 are to select stamina die"
    helpText += "\nqwerty selects abilites"
    helpText += "\nshift+qwerty for info"
    helpText += "\nz: shows enemy numbers"
    helpText += "\nc: shows dmg that will hit tile"
    helpText += "\nEscape to exit this and most menus"

    displayHelp.drawText(2,5,helpText)
}

export const HideHelpMenu = () => {
    displayHelp.clear()
    divHelp.style.visibility = 'hidden'
}

const MakeVisible = () => {
    //make it visible
    divHelp.style.visibility = 'visible'

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

const WriteAbility = (abil) => {
    var toWrite = ""

    toWrite += "\n"+abil.description.name
    toWrite += "\n"+abil.description.description
    toWrite += "\n"+abil.abilityPhase.phase
    toWrite += "\n"+abil.abilityPhase.speed

    return toWrite
}