import {
    DamageTuple,
    ICharacter
} from '../../types/';

export interface IDealDamage {
    target: ICharacter;
    damagePoints: DamageTuple[];
}