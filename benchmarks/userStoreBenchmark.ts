import { getUserProfile } from '../src/server/agent/services/userStore';

async function runBenchmark() {
    const userId = 'user-123';
    const iterations = 1000000;
    console.log(`Running benchmark: ${iterations} iterations of getUserProfile('${userId}')`);

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        await getUserProfile(userId);
    }
    const end = Date.now();

    const totalTime = end - start;
    const avgTime = (totalTime / iterations) * 1000; // in microseconds

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per call: ${avgTime.toFixed(4)}μs`);
}

runBenchmark().catch(console.error);
