import {
    IRoute,
    RequestMethod
} from '../IRoute';
import {
    IDealDamageRequest,
    ICombatActionResponse
} from '../../../types/';
import {
    processDealDamage
} from '../../actions/processAction';
import DatabaseAdapter from '../../DatabaseAdapter';

const route: IRoute = {
    method: RequestMethod.POST,
    handler: async (req, res) => {
        const body: IDealDamageRequest = req.body;

        const {
            targetId,
            damagePoints
        } = body;

        const response: Partial<ICombatActionResponse> = {};

        const character = await DatabaseAdapter.loadCharacter(targetId);

        if (!character) {
            response.errorMessage = 'Requested resource was not found.';
            res.status(404);
        } else {
            const updated = processDealDamage({
                target: character,
                damagePoints
            });

            await DatabaseAdapter.saveCharacter(updated);

            response.targetData = updated;

            res.status(200);
        }

        res.json(response);
    },
    path: '/api/deal-damage'
};

export default route;