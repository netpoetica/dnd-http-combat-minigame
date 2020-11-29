import {
    ICharacter
} from '../';

export interface ICombatResponse {
    combatants: {
        player: ICharacter;
        // This is always a "goblin". But for brevity, I am just
        // re-using a generated character as the bad-guy. Realistically,
        // monster stat blocks would be a subset of a character, or
        // completely unique.
        enemy: ICharacter;
    };
    errorMessage?: string;
}