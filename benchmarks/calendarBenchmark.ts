import { googleCalendarTool } from '../src/server/agent/tools/googleCalendar';

async function runBenchmark() {
    const query = 'list events';
    const iterations = 10; // 500ms * 10 = 5s, enough for a baseline
    console.log(`Running benchmark: ${iterations} iterations of googleCalendarTool('${query}')`);

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        await googleCalendarTool(query);
    }
    const end = Date.now();

    const totalTime = end - start;
    const avgTime = totalTime / iterations;

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per call: ${avgTime.toFixed(2)}ms`);
}

runBenchmark().catch(console.error);
