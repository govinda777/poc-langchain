import { googleCalendarTool } from '../src/server/agent/tools/googleCalendar';

async function runBenchmark() {
    const query = 'list events';
    const iterations = 10;
    console.log(`Running benchmark: ${iterations} iterations of googleCalendarTool('${query}')`);

    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        await googleCalendarTool(query);
    }
    const end = Date.now();

    const totalTime = end - start;
    const avgTime = (totalTime / iterations);

    console.log(`Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`Average time per call: ${avgTime.toFixed(4)}ms`);
}

runBenchmark().catch(console.error);
