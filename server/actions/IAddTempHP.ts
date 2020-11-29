import { ICharacter }  from '../../types';
export interface IAddTempHP {
    target: ICharacter;
    temporaryHitPoints: number;
}