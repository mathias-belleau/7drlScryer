import world from "../state/ecs";

export const Ability = {
    Phase: 'Any',
    Speed: 'Instant',
    Stamina: 'Any',
    canUse: () => {
        console.log('canUse')
        return true;
    },
    onUse: (ability, entity) => {
        console.log('used')
        console.log(ability.Phase)
        entity.fireEvent("gain-movement", 3)
    }
}

export const AbilityMove = {
    Phase: 'Any',
    Speed: 'Instant',
    Stamina: 'Any',    
    canUse: (ability,entity) => {
        return true
    },
    onUse: (ability, entity) => {
        entity.fireEvent("gain-movement", 3);
    }
}