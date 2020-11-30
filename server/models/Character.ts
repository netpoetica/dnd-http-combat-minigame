import {
    v4
} from 'uuid';
import {
    ClassName
} from '../../types/enums';
import {
    ICharacterClass,
    ICharacter
} from '../../types/Character';
import * as FantasyContentGenerator from 'fantasy-content-generator';

export const hitDiceByClass = {
    [ClassName.Cleric]: 8,
    [ClassName.Fighter]: 10,
    [ClassName.Rogue]: 8,
    [ClassName.Wizard]: 6
};

const standardPointArray = [
    15,
    14,
    13,
    12,
    10,
    8
];

const rollAbilityScore = () => {
    const rolls: number[] = [];
    let totalRolls = 4;
    while (totalRolls--) {
        // 6-sided die, minimum 1
        rolls.push(Math.ceil(Math.random() * 6));
    }
    // Pop off the least of the four
    const bestRolls =  rolls.sort().slice(0, rolls.length - 1);
    const reducer = (accumulator: number, current: number) => {
        return accumulator + current;
    };
    // Sum the rest
    return bestRolls.reduce(reducer, 0);
};

// See: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Fisher_and_Yates'_original_method
const fisherYatesShuffle = (arr: number[]) => {
    // Make a copy; do not mutate.
    // It's OK not to deep copy/dereference here, because
    // we are not modifying the values. We just need a new
    // array with a different order of values.
    const result: number[] = [ ...arr ];
    let i = result.length - 1;
    for( ; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * i);
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
    return result;
};

// Realistically, these would be hosted resources on S3 somewhere, stored
// in the database record of individual characters. I do not love having
// the backend know anything about filenames of image resources, but, for
// simplicity:
const defaultProfileImageFilenames = [
    'FlareFemale3.png',
    'FlareFemale4.png',
    'FlareFemale5.png',
    'FlareFemale6.png'
];

const getRandomProfileImage = () => defaultProfileImageFilenames[
    Math.floor(Math.random() * defaultProfileImageFilenames.length)
];

export const getAbilityScoreModifier = (score: number) => {
    return Math.floor((score - 10) / 2);
};

export const getTotalHitPoints = (classes: ICharacterClass[], constitutionScore: number) => {
    // Constitution modifier is added to each roll of the hitDie.
    const constitutionModifier = getAbilityScoreModifier(constitutionScore);
    return classes.reduce((acc, curr) => {
        const hitDice = hitDiceByClass[curr.name];
        // The first level of a class is always the maximum hit die.
        acc += (hitDice + constitutionModifier);
        // Each subsequent level is rolled randomly.
        let remainingLevels = curr.classLevel - 1; // Offset by 1 for first level.
        while (remainingLevels--) {
            // Minimum of 1
            acc += Math.floor(Math.random() * hitDice + 1);
        }
        return acc;
    }, 0);
};

export const fromJson = (json: string) => {
    return JSON.parse(json) as ICharacter;
};

export const fromObject = (obj: object) => {
    return obj as ICharacter;
};

export const generateRandom = () => {
    const generatedName = FantasyContentGenerator.Names.generate();
    // We want to generally have 1 class, with a small
    // chance of multi-class. We'll go with 10% chance.
    let numClasses = Math.ceil(Math.random() * 10) === 10 ? 2 : 1;
    const classes: ICharacterClass[] = [];
    const classKeys = Object.keys(hitDiceByClass) as ClassName[];
    const level = Math.ceil(Math.random() * 20);
    // Roll abilities or use standard array?
    // 50/50 chance of either method.
    const useStandardArray = Math.ceil(Math.random() * 2) === 2;
    while (numClasses--) {
        const classKey = classKeys[
            Math.floor(Math.random() * classKeys.length)
        ];
        classes.push({
            name: classKey,
            hitDiceValue: hitDiceByClass[classKey],
            classLevel: level
        });
    }

    const stats = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    };

    const statKeys = Object.keys(stats);
    if (useStandardArray) {
        const scorePool = fisherYatesShuffle(standardPointArray);
        statKeys.forEach(stat => stats[stat] = scorePool.pop());
    } else {
        statKeys.forEach(stat => stats[stat] = rollAbilityScore());
    }

    const hp = getTotalHitPoints(classes, stats.constitution);

    const character: ICharacter = {
        id: v4(),
        name: generatedName.name,
        profileImage: getRandomProfileImage(),
        maxHitPoints: hp,
        currentHitPoints: hp,
        temporaryHitPoints: 0,
        classes,
        // sum all class levels
        level: classes.reduce((acc, curr) => {
            return acc + curr.classLevel;
        }, 0),
        stats,
        items: [],
        defenses: [],
        vulnerabilities: []
    };
    return character;
};
