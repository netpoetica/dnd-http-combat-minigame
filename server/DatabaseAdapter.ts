import * as redis from 'redis';
import {
    promisify
} from 'util';
import {
    ICharacter
} from '../types';

class DatabaseAdapter {
    client: redis.RedisClient;
    connected: boolean = false;

    constructor() {
        const port = typeof process.env.REDIS_PORT === 'string'
            ? parseInt(process.env.REDIS_PORT, 10)
            : 6379;

        const host = process.env.REDIS_HOST || '127.0.0.1';

        const pass = process.env.REDIS_PASS || 'dnd-http-combat-minigame';

        const options: redis.ClientOpts = {
            port,
            host,
            auth_pass: pass
        };

        const client = redis.createClient(options);

        client.on('connect', () => {
            this.connected = true;
        });

        client.on("error", (error) => {
            // Allow errors to write to stderr for docker logs
            // tslint:disable-next-line: no-console
            console.error(error);
        });

        this.client = client;

        // Wrap with promisify to allow async/await, avoid callbacks
        const setAsync = promisify(this.client.set).bind(this.client);
        this.setAsync = setAsync;
        const getAsync = promisify(this.client.get).bind(this.client);
        this.getAsync = getAsync;
        const flushAllAsync = promisify(this.client.flushall).bind(this.client);
        this.flushAllAsync = flushAllAsync;
    }

    // TODO: Investigate if we can use Promise<boolean>. I suspect unknown is incorrect.
    setAsync: (key: string, value: string) => Promise<unknown>;
    getAsync: (key: string) => Promise<string | null>;
    flushAllAsync: () => Promise<unknown>;

    // Note: this syntax is not standard ES6. Babel's proposal-class-properties plugin enables this syntax.
    // See babel.config.js
    saveCharacter = async (character: ICharacter) => {
        const result =  await this.setAsync(character.id, JSON.stringify(character));
        // "OK" is expected.
        return result;
    }

    loadCharacter = async (id: string) => {
        const result =  await this.getAsync(id);
        if (typeof result === 'string') {
            return JSON.parse(result) as ICharacter;
        }
    }
}

export default new DatabaseAdapter();
