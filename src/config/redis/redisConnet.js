const setting = {
    host: '127.0.0.1',
    port: 6379,
};

const keyName = 'test:condorlabs-npm-helpers:counter';

try {
    const redis = require('@condor-labs/redis')(setting);
    (async () => {

        const client = await redis.getClient();

        const redisBatch = client.batch();
        await redisBatch.incr(keyName);
        await redisBatch.expire(keyName, 1);
        const resolve = await redisBatch.execAsync();

        console.log(
            resolve && resolve.length > 0 && resolve[0] > 0
                ? `REDIS Client connected OK!!!`
                : `REDIS Client connection failed :(`
        );
    })();
} catch (error) {
    console.error(error);
}
