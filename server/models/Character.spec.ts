import {
    hitDiceByClass,
    getAbilityScoreModifier,
    getTotalHitPoints,
    generateRandom,
} from './Character';

describe('Character', () => {
    test('should calculate max hit points equal to hit dice for 1st level', () => {
        const constitutionScore = 10;
        for (const [className, hitDice] of Object.entries(hitDiceByClass)) {
            expect(getTotalHitPoints([
                {
                    classLevel: 1,
                    hitDiceValue: hitDice,
                    name: className as any
                }
            ], constitutionScore)).toEqual(hitDice);
        }
    });
    test('should calculate max hit points equal to hit dice for eacch 1st level class', () => {
        const rogue = {
            classLevel: 1,
            hitDiceValue: hitDiceByClass.rogue,
            name: 'rogue' as any
        };
        const cleric =  {
            classLevel: 1,
            hitDiceValue: hitDiceByClass.cleric,
            name: 'cleric' as any
        };
        const fighter =  {
            classLevel: 1,
            hitDiceValue: hitDiceByClass.fighter,
            name: 'fighter' as any
        };
        const wizard =  {
            classLevel: 1,
            hitDiceValue: hitDiceByClass.wizard,
            name: 'wizard' as any
        };
        expect(getTotalHitPoints([
            cleric, rogue
        ], 10)).toEqual(hitDiceByClass.rogue + hitDiceByClass.cleric);
        expect(getTotalHitPoints([
            cleric, rogue, wizard, fighter
        ], 10)).toEqual(
            hitDiceByClass.rogue
            + hitDiceByClass.cleric
            + hitDiceByClass.wizard
            + hitDiceByClass.fighter
        );
    });
    test('should produce accurate modifier given ability', () => {
        expect(getAbilityScoreModifier(1)).toEqual(-5);
        expect(getAbilityScoreModifier(2)).toEqual(-4);
        expect(getAbilityScoreModifier(3)).toEqual(-4);
        expect(getAbilityScoreModifier(4)).toEqual(-3);
        expect(getAbilityScoreModifier(5)).toEqual(-3);
        expect(getAbilityScoreModifier(6)).toEqual(-2);
        expect(getAbilityScoreModifier(7)).toEqual(-2);
        expect(getAbilityScoreModifier(8)).toEqual(-1);
        expect(getAbilityScoreModifier(9)).toEqual(-1);
        expect(getAbilityScoreModifier(10)).toEqual(0);
        expect(getAbilityScoreModifier(11)).toEqual(0);
        expect(getAbilityScoreModifier(12)).toEqual(1);
        expect(getAbilityScoreModifier(13)).toEqual(1);
        expect(getAbilityScoreModifier(14)).toEqual(2);
        expect(getAbilityScoreModifier(15)).toEqual(2);
        expect(getAbilityScoreModifier(16)).toEqual(3);
        expect(getAbilityScoreModifier(17)).toEqual(3);
        expect(getAbilityScoreModifier(18)).toEqual(4);
        expect(getAbilityScoreModifier(19)).toEqual(4);
        expect(getAbilityScoreModifier(20)).toEqual(5);
        expect(getAbilityScoreModifier(21)).toEqual(5);
    });
    test('should generate random character', () => {
        const character = generateRandom();
        expect(character).not.toBe(undefined);
        expect(character.id).not.toBe(undefined);
        expect(character.name).not.toBe(undefined);
        expect(character.level).toBeGreaterThan(0);
        Object.keys(character.stats).forEach(key => expect(character.stats[key]).toBeGreaterThan(0));
        for (const classObj of character.classes) {
            expect(classObj.classLevel).toBeGreaterThan(0);
            expect(classObj.hitDiceValue).toBeGreaterThan(0);
            expect(typeof classObj.name).toEqual('string');
        }
    });
});