import { getUserProfile } from '../src/server/agent/services/userStore';

async function runBenchmark() {
    const userId = 'user-123';
    const iterations = 100;
    console.log(`Running benchmark: ${iterations} iterations of getUserProfile('${userId}')`);

    const start = Date.now();
    const promises = [];
    for (let i = 0; i < iterations; i++) {
        promises.push(getUserProfile(userId));
    }
    await Promise.all(promises);
    const end = Date.now();

    const totalTime = end - start;
    const avgTime = totalTime / iterations;

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per call: ${avgTime.toFixed(2)}ms`);
}

runBenchmark().catch(console.error);
