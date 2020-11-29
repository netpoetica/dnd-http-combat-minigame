
import {
    DamageTuple
} from '../';

export interface IDealDamageRequest {
    targetId: string;
    damagePoints: DamageTuple[];
}
