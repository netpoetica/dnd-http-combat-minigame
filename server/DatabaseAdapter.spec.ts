import DatabaseAdapter from './DatabaseAdapter';
import {
    ICharacter
} from '../types';
import * as Character from './models/Character';
import characterData from './data/characters/briv.json';
import * as uuid from 'uuid';

// Raw data JSON parsed as obj on import, here we tell compiler the type is ICharacter.
const briv = Character.fromObject(characterData);
briv.id = uuid.v4();

/**
 * This test can only be enabled if Docker env is running or a local redis.
 * Using end-to-end testing in unit tests is not recommended. Instead, it
 * should be mocked, but for purpose of not spending too many hours, this
 * is an end-to-end test for simple verification.
 */
describe.skip('DabaseAdapter', () => {
    it('should be able to write and read record', async (done) => {
        const saved = await DatabaseAdapter.saveCharacter(briv);
        const loaded = await DatabaseAdapter.loadCharacter(briv.id) as ICharacter;
        if (loaded) {
            expect(loaded.id).toBe(briv.id);
        }
        done();
    });
    it('should be able to flush all records', async (done) => {
        // Save a character, then confirm it is flushed
        const saved = await DatabaseAdapter.saveCharacter(briv);
        let loaded = await DatabaseAdapter.loadCharacter(briv.id) as ICharacter;
        expect(loaded.id).toBe(briv.id);
        await DatabaseAdapter.flushAllAsync();
        loaded = await DatabaseAdapter.loadCharacter(briv.id) as ICharacter;
        expect(loaded).toBe(undefined);
        done();
    });
});