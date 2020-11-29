import {
    ICharacter
} from '../';

export interface ICombatActionResponse {
    /**
     * The full character object updated
     * with any changes reflected.
     */
    targetData: ICharacter;
    /**
     * Optionally present if there was an error.
     */
    errorMessage?: string;
}