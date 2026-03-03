import { hydrationNode } from '../src/server/agent/nodes';
import { AgentState } from '../src/server/agent/state';

async function runBenchmark() {
    const userId = 'user-123';
    const iterations = 50;

    // Baseline: Call hydrationNode repeatedly without profile in state
    const stateWithoutProfile: AgentState = {
        messages: [],
        userId: userId,
        sessionId: 'session-123'
    };

    console.log(`Running benchmark: ${iterations} iterations of hydrationNode without profile in state`);
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
        await hydrationNode(stateWithoutProfile);
    }
    const end1 = performance.now();
    const timeWithoutProfile = end1 - start1;

    // After optimization (or simulating it): Call hydrationNode with profile already in state
    const profile = {
        id: userId,
        name: 'Alice',
        preferences: { theme: 'dark' }
    };
    const stateWithProfile: AgentState = {
        messages: [],
        userId: userId,
        userProfile: profile,
        sessionId: 'session-123'
    };

    console.log(`Running benchmark: ${iterations} iterations of hydrationNode with profile in state`);
    const start2 = performance.now();
    for (let i = 0; i < iterations; i++) {
        await hydrationNode(stateWithProfile);
    }
    const end2 = performance.now();
    const timeWithProfile = end2 - start2;

    console.log(`Time without profile (baseline): ${timeWithoutProfile.toFixed(4)}ms`);
    console.log(`Time with profile: ${timeWithProfile.toFixed(4)}ms`);
    console.log(`Average time per call (baseline): ${(timeWithoutProfile / iterations).toFixed(4)}ms`);
    console.log(`Average time per call: ${(timeWithProfile / iterations).toFixed(4)}ms`);
}

runBenchmark().catch(console.error);
