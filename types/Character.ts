import {
    ClassName,
    DamageType,
    DefenseType
} from './';

export interface IItem {
    name: string;
    modifier: {
        affectedObject: string;
        affectedValue: string;
        value: number;
    };
}

export interface IDefense {
    damageType: DamageType;
    defenseType: DefenseType;
}

export interface ICharacterClass {
    name: ClassName;
    hitDiceValue: number;
    classLevel: number;
}

export interface ICharacter {
    id: string;
    name: string;
    level: number;
    profileImage: string;
    classes: ICharacterClass[];
    maxHitPoints: number;
    currentHitPoints: number;
    temporaryHitPoints: number;
    stats: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;
    };
    items: IItem[];
    defenses: IDefense[];
    vulnerabilities: DamageType[];
}