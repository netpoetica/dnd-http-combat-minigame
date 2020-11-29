import {
    IRoute,
    RequestMethod
} from '../IRoute';
import {
    ICharacter,
    ICombatActionResponse,
    IHealRequest
} from '../../../types';
import {
    processHealHP
} from '../../actions/processAction';
import DatabaseAdapter from '../../DatabaseAdapter';

const route: IRoute = {
    method: RequestMethod.POST,
    handler: async (req, res) => {
        const body: IHealRequest = req.body;

        const {
            targetId,
            totalHitPoints
        } = body;

        const response: Partial<ICombatActionResponse> = {};

        const character = await DatabaseAdapter.loadCharacter(targetId);

        if (!character) {
            response.errorMessage = 'Requested resource was not found.';
            res.status(404);
        } else {
            const updated = processHealHP({
                target: character,
                totalHitPoints
            });

            await DatabaseAdapter.saveCharacter(updated);

            response.targetData = updated;

            res.status(200);
        }

        res.json(response);
    },
    path: '/api/heal'
};

export default route;