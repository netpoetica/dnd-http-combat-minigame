import {
    ICharacter
} from '../../types';

export interface IHealHP {
    target: ICharacter;
    totalHitPoints: number;
}