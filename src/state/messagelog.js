import {display, displayMsg,divMSg, grid } from "../lib/canvas"

var messageLog = []
export function AddLog(text){
    messageLog.push(text)
}

export function GetLogs(lines){
    return messageLog.slice(Math.max(messageLog.length - lines, 0))
}

AddLog("good luck")

console.log(GetLogs(5))