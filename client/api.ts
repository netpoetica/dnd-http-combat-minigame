
import {
    ICharacter,
    ICombatActionResponse
} from '../types';

export const attack = async (enemy: ICharacter) => {
    const requestData = {
        targetId: enemy.id,
        damagePoints: [
            // This is not scientific. Just adding some fun varibility here
            [ 'slashing', Math.round(Math.random() * enemy.stats.strength + 5) ]
        ]
    };

    const response = await fetch('/api/deal-damage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const parsed: ICombatActionResponse  = await response.json();
    return parsed;
};

export const castSpell = async (enemy: ICharacter) => {
    const requestData = {
        targetId: enemy.id,
        damagePoints: [
            // This is not scientific. Just adding some fun varibility here
            [ 'fire' , Math.round(Math.random() * enemy.stats.intelligence + 5) ]
        ]
    };

    const response = await fetch('/api/deal-damage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const parsed: ICombatActionResponse = await response.json();
    return parsed;
};

export const heal = async (character: ICharacter) => {
    const requestData = {
        targetId: character.id,
        totalHitPoints: Math.round(Math.random() * (character.maxHitPoints / 2))
    };

    const response = await fetch('/api/heal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const parsed: ICombatActionResponse = await response.json();
    return parsed;
};

export const requestBoon = async (character: ICharacter) => {
    const requestData = {
        targetId: character.id,
        temporaryHitPoints: Math.round(Math.random() * 10)
    };

    const response = await fetch('/api/add-temporary-hit-points', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    const parsed: ICombatActionResponse = await response.json();
    return parsed;
};
