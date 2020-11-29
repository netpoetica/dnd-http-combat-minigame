import { IRoute, RequestMethod } from './IRoute';
import DatabaseAdapter from '../DatabaseAdapter';
import {
    ICombatResponse
} from '../../types/';
import {
    generateRandom
} from '../models/Character';

/**
 * @fileoverview Upon loading the combat simulation, the initialize API endpoint
 * is utilized to create a new "hero" instance, a.k.a. instantiate character data
 * and persist it in redis. It should return a handle to the character's ID, which
 * will be utilized in subsequent routes to determine which character to act upon,
 * and ultimately will be cleaned up with the combat session ends.
 */
const route: IRoute = {
    method: RequestMethod.GET,
    handler: async (req, res) => {
        // Create a player and an enemy
        const player = generateRandom();
        const enemy = generateRandom();

        const response: ICombatResponse = {
            // Pass data back to client
            combatants: {
                player,
                enemy
            }
        };

        const savedPlayer = await DatabaseAdapter.saveCharacter(player);
        const savedEnemy = await DatabaseAdapter.saveCharacter(enemy);

        if (savedPlayer && savedEnemy) {
            res.status(200);
        } else {
            response.errorMessage = 'Unable to persist character data.';
            res.status(400);
        }

        res.json(response);

        return;
    },
    path: '/api/initialize'
};

export default route;