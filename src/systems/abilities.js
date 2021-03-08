import world from "../state/ecs";

export const Ability = {
    canUse: (ability,entity) => {
        console.log('canUse')
        return true;
    },
    onUse: (ability, entity) => {
        console.log('used')
        console.log(ability)
        console.log(ability.abilityPhase.phase)
        entity.fireEvent("gain-movement", 3)
    }
}

export const AbilityMove = {
    canUse: (ability,entity) => {
        return true
    },
    onUse: (ability, entity) => {
        entity.fireEvent("gain-movement", 3);
    }
}