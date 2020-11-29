import {
    IRoute,
    RequestMethod
} from '../IRoute';
import {
    ICombatActionResponse,
    IAddTemporaryHitPointsRequest
} from '../../../types';
import {
    processAddTempHP
} from '../../actions/processAction';
import DatabaseAdapter from '../../DatabaseAdapter';

const route: IRoute = {
    method: RequestMethod.POST,
    handler: async (req, res) => {
        // Extending express req in TypeScript is non-trivial due
        // to the fact that many types are hiding in serve-static-core
        // therefore, we take advantage of default "any" type here to
        // tell express the shape of the body.
        const body: IAddTemporaryHitPointsRequest = req.body;

        const {
            temporaryHitPoints
        } = body;

        const response: Partial<ICombatActionResponse> = {};

        const character = await DatabaseAdapter.loadCharacter(body.targetId);

        if (!character) {
            response.errorMessage = 'Requested resource was not found.';
            res.status(404);
        } else {
            const preRequestTemporaryHitPoints = character.temporaryHitPoints;
            const updated = processAddTempHP({
                target: character,
                temporaryHitPoints
            });

            if (updated.temporaryHitPoints !== preRequestTemporaryHitPoints) {
                await DatabaseAdapter.saveCharacter(character);
            }

            response.targetData = updated;

            res.status(200);
        }
        res.json(response);

        return;
    },
    path: '/api/add-temporary-hit-points'
};

export default route;