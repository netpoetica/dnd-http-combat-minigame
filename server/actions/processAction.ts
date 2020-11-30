import {
    IAddTempHP,
    IDealDamage,
    IHealHP
} from './IActions';
import {
    ICharacter
} from '../../types';
import {
    DefenseType
} from '../../types/enums';

export const processAddTempHP = (action: IAddTempHP) : ICharacter => {
    const {
        target,
        temporaryHitPoints
    } = action;

    // In D&D, temporary hit points do not stack.
    // The way it works is, we take the higher of
    // new candidate value vs. current value.

    // Rather than assigning Math.max(current, target), resulting in saving
    // to the database, we will only update the character if there is a change.
    if (target.temporaryHitPoints < temporaryHitPoints) {
        target.temporaryHitPoints = temporaryHitPoints;
    }

    return target;
};

export const processDealDamage = (action: IDealDamage) : ICharacter => {
    const {
        target,
        damagePoints
    } = action;

    // We will build up the total damage, which will be deducted first
    // from the temporary points. Then, the remainder will be deducted
    // from the regular hit points.
    let totalDamage = 0;

    for (const [type, total] of damagePoints) {
        // Negative damage cannot be dealt.
        if (total <= 0) continue;

        // Here we need to check vulnerabilities and resistances.
        const defense = target.defenses.find(def => def.damageType === type);

        // If you  have a vulnerability and a defense, they cancel each other out.
        const hasVulnerability = target.vulnerabilities.indexOf(type) > -1;

        // If no defences or vulnerabities found, or both a defense and vulnerability cancel each other out
        if (
            !(defense || hasVulnerability)
            || (defense && hasVulnerability)
        ) {
            totalDamage += total;
            continue;
        }

        switch (defense?.defenseType) {
            case DefenseType.Immunity:
                // No damage will be done.
                continue;
            case DefenseType.Resistance:
                // Damage will be halved.
                // In D&D, we alwlays round down.
                totalDamage += Math.floor(total / 2);
                continue;
            default:
                break;
        }

        // If we've made it to this point, we have vulnerability
        // and no defense, so we take double damage.
        totalDamage += Math.floor(total * 2);
    }

    target.temporaryHitPoints -= totalDamage;
    // If for example, you have 10 temp HP and take 5 damage, you now have 5 temp HP.
    // If you have 10 and you take 15 damage, you have -5 temp HP.
    // Now we just reapply the delta to your hitpoints, if there is is any.
    // Otherwise, your temp HP covered all the damage.
    if (target.temporaryHitPoints < 0) {
        // Use addition because number is negative. Faster than Math.abs()-ing value.
        target.currentHitPoints += target.temporaryHitPoints;
        // If your temp HP dipped below 0 from previous subtraction, zero it back out.
        target.temporaryHitPoints = 0;
    }

    // Guard from HP going below 0.
    target.currentHitPoints = Math.max(0, target.currentHitPoints);

    return target;
};

export const processHealHP = (action: IHealHP) : ICharacter => {
    const {
        target,
        totalHitPoints
    } = action;

    const {
        currentHitPoints,
        maxHitPoints
    } = target;

    const nextCurrentHitPoints = currentHitPoints + totalHitPoints;

    if (nextCurrentHitPoints <= maxHitPoints) {
        target.currentHitPoints = nextCurrentHitPoints;
    } else {
        // If healing would exceed max, cap at max.
        target.currentHitPoints = maxHitPoints;
    }

    return target;
};