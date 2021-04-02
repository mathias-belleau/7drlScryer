import {display, displayMsg,divMSg, grid } from "../lib/canvas"

var messageLog = []
export function AddLog(text){
    messageLog.push(text)
}

export function GetLogs(lines){
    return messageLog.slice(Math.max(messageLog.length - lines, 0))
}

AddLog("hello 1")
AddLog("hello 2")
AddLog("hello 3")
AddLog("hello 4")
AddLog("hello 5")
AddLog("123456789012345678901234567890")
AddLog("hello 7")
AddLog("hello 8")
AddLog("hello 9")
AddLog("hello 0")

console.log(GetLogs(5))