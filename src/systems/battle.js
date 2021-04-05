import {SetGameState, GetGameState, StartTurnProcess,EnemyAttackTurn,CheckActiveDead,SetPreviousState,
    PlayerAttemptMove,PlayerTurnDefend,CheckDefeat,ProcessDmgTilesProjectiles,ExamineTargetDisable,TargetMove,
    EndTurnProcess,CheckVictory,SetupGame,FetchFreeTileTargetDungeon,enemyEntities,playerEntities,allyEntities} from "../index"
import {render, SetEntityToRender} from "./render"
import gameTown from "../state/town"
import {HideHelpMenu} from "../state/helpMenu"
import * as Target from "./target"

export function DoBattlePhase(userInput) {
    if(GetGameState() == "setup"){
        FetchFreeTileTargetDungeon({x:2,y:2},3)
        SetGameState("EnemyTurnDefend") 
      }else if(GetGameState() == "EnemyTurnDefend") {
  
        //EnemyDefendTurn()
  
        SetGameState("EnemyTurnAttack")
        render()
        //set to playerturndefend
        //check win/lose  
      }else if(GetGameState() == "EnemyTurnAttack"){
        StartTurnProcess(enemyEntities.get())
        EnemyAttackTurn()
        //fire end turn for all enemy units
        EndTurnProcess(enemyEntities.get())
  
        //if active player is dead +1
  
        CheckActiveDead()
        //fire start turn for all players
        StartTurnProcess(playerEntities.get())
  
        SetGameState("PlayerTurnDefend") 
        render()
      }else if(GetGameState() == "PlayerTurnDefend") {
        processUserInput(userInput)
        //set to playerturnattack
        //check win/lose
      }else if(GetGameState() == "PlayerTurnAttack") {
        processUserInput(userInput)
        //set to enemy turn
        //check win/lose
  
        //fire endTurn for all player units
        
      }else if(GetGameState() == "MessageLog" || GetGameState()=="examine" || GetGameState() =="targeting" || GetGameState() == "Help" || GetGameState() == "AbilityInfo" || GetGameState() == "DamageShow" || GetGameState() == "EnemyNumbers"){
        processUserInput(userInput)
        //render entities under current reticle
  
        
      }else if (GetGameState() == "gameover") {
      }else {
        SetupGame()
      }
}

const processUserInput = (userInput) => {
    //show help screen
      if(!userInput){
        return;
      }else if(GetGameState() == "PlayerTurnDefend" || GetGameState() == "PlayerTurnAttack"){
        if(userInput === "?") {
          SetPreviousState("Help")
          render()
    //select next player
        }else if (userInput == "M"){
          SetPreviousState("MessageLog")
          render()
        }else if (userInput === "n") {
          //change active player to next
          // console.log('input: ' + userInput)
          gameTown.GetNextActive()
    
          render()
    
    //die select
        }else if(userInput === "1" || userInput === "2" || userInput === "3" || userInput === "4" || userInput === "5" || userInput === "6" || userInput === "7" || userInput === "8" || userInput === "9") {
          // console.log("dice swap")
          //select die
          if(userInput - 1 < gameTown.GetActive().die.length) {
            // console.log(CurrrentActivePlayer.die[userInput-1])
            if(!gameTown.GetActive().die[userInput-1].exhausted){
              gameTown.GetActive().die[userInput-1].selected = !gameTown.GetActive().die[userInput-1].selected
            }
            render()
            
          }
          
    
    //movement
        }else if (userInput === "ArrowUp") {
          PlayerAttemptMove()
        }else if (userInput === "ArrowRight") {
          PlayerAttemptMove()
        }else if (userInput === "ArrowDown") {
          PlayerAttemptMove()
        }else if (userInput === "ArrowLeft") {
          PlayerAttemptMove()
        
    //ability use
        //}else if(userInput === "q" || userInput === "w" || userInput === "e" || userInput === "r" || userInput === "t" || userInput === "y") {
        }else if(userInput in gameTown.GetCurrentHunterAbilityMap()){
          //console.log("ability use")
          //var abilityIndex = ConvertSkillHotkey(userInput)
    
            //hit existing ability key
            let abil = gameTown.GetCurrentHunterAbility(userInput)
            let canUse = abil.abilityFunction.function.canUse(abil,gameTown.GetActive())
            var currentPhase = (GetGameState() == "PlayerTurnDefend") ? "Defend" : "Attack"
            if(canUse.length > 0 && (abil.abilityPhase.phase == "Defend" || abil.abilityPhase.phase == currentPhase)){
              //check if ability is instant or targeted
              if(abil.abilityFunction.function.onTarget){
                abil.abilityFunction.function.onTarget(abil, gameTown.GetActive())
    
              }else {
                abil.abilityFunction.function.onUse(abil, gameTown.GetActive(), Target.GetTargetEntityPos())
              }
            }
          render()
        
        //}else if(userInput === "Q" || userInput === "W" || userInput === "E" || userInput === "R" || userInput === "T" || userInput === "Y") {
        }else if (userInput.length == 1 && userInput.toLowerCase() in gameTown.GetCurrentHunterAbilityMap() ){
      //ability info
          //console.log("ability info")
          //var abilityIndex = ConvertSkillHotkey(userInput)
          SetPreviousState("AbilityInfo")
          //console.log(abilityIndex)
          //console.log(CurrrentActivePlayer.abilityList.abilities[abilityIndex])
          SetEntityToRender(gameTown.GetCurrentHunterAbility(userInput.toLowerCase()))
          render()
        
        }else if(userInput=="Enter"){
          //console.log("Enter")
          if(GetGameState() == "PlayerTurnDefend"){
            StartTurnProcess(allyEntities.get())
            PlayerTurnDefend()
            
            SetGameState("PlayerTurnAttack")
    
            CheckDefeat()
          }else if (GetGameState() == "PlayerTurnAttack"){
            //process playerAttack
            ProcessDmgTilesProjectiles()
    
            EndTurnProcess(allyEntities.get())
            EndTurnProcess(playerEntities.get())
            CheckVictory()
            
            SetGameState("EnemyTurnDefend")
            CheckDefeat()
          }
    
          render()
        }else if (userInput === 'x') {
          //set examine mode
          ExamineTargetEnable("examine")
    
          render()
        }else if (userInput === 'c') {
          SetPreviousState("DamageShow")
          render()
        }else if (userInput === 'z') {
          SetPreviousState("EnemyNumbers")
          render()
        }else if (userInput === 'p') {
          //used for testing
          //console.log(CurrrentActivePlayer)
          
        }
      }else if (GetGameState() === "examine" || GetGameState() === "targeting") {
          if (userInput === "Escape") {
            ExamineTargetDisable()
            render()
          }else if (userInput === "ArrowUp" || userInput === "ArrowRight" || userInput === "ArrowDown" || userInput === "ArrowLeft") {
            TargetMove()
            render()
          }else if(userInput === " " && GetGameState() === "targeting"){
            Target.UseAbility()
            // queuedAbility.abilityFunction.function.onUse(queuedAbility, queuedEntity, Target.GetTargetEntityPos())
            ExamineTargetDisable()
            render()
        }
      }else if (GetGameState() === "MessageLog" || GetGameState() === "Help" || GetGameState() == "AbilityInfo" || GetGameState() == "DamageShow" || GetGameState() == "EnemyNumbers" ) {
        if(userInput ==="Escape"){
          HideHelpMenu()
          ReturnPreviousGameState()
          render()
        }else if( GetGameState() == "DamageShow" && userInput == "c"){
          ReturnPreviousGameState()
          render()
        }else if( GetGameState() == "EnemyNumbers" && userInput == "z"){
          ReturnPreviousGameState()
          render()
        }
      }
        userInput = null
    }