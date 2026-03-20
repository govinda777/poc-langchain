// Extracted logic from perceptionNode for benchmarking
const WEATHER_REGEX = /clima|weather/;
const TRANSFER_REGEX = /transfer|pagar|pay/;
const CALENDAR_REGEX = /calendar|agenda|reuniao|meeting|evento|schedule/;

function optimizedPerceptionRegex(content: string): string {
    content = content.toLowerCase();
    if (WEATHER_REGEX.test(content)) return 'weather';
    if (TRANSFER_REGEX.test(content)) return 'transfer';
    if (CALENDAR_REGEX.test(content)) return 'calendar';
    return 'conversation';
}

// Logic as it was before optimization
function originalPerception(content: string): string {
    content = content.toLowerCase();
    let intent = 'conversation';
    if (content.includes('clima') || content.includes('weather')) {
        intent = 'weather';
    } else if (content.includes('transfer') || content.includes('pagar') || content.includes('pay')) {
        intent = 'transfer';
    } else if (['calendar', 'agenda', 'reuniao', 'meeting', 'evento', 'schedule'].some(k => content.includes(k))) {
        intent = 'calendar';
    }
    return intent;
}

async function runBenchmark() {
    const iterations = 1000000;
    const testCases = [
        "How is the weather today?",
        "Eu quero ver o clima em São Paulo",
        "I need to transfer some money",
        "Pagar a conta de luz",
        "Schedule a meeting for tomorrow",
        "Ver minha agenda",
        "Just a normal conversation",
        "What is the event today?",
        "Pay my friend",
        "Reuniao as 10h"
    ];

    console.log(`Running benchmark: ${iterations} iterations`);

    // Original Logic
    const start1 = performance.now();
    for (let i = 0; i < iterations; i++) {
        originalPerception(testCases[i % testCases.length]);
    }
    const end1 = performance.now();
    console.log(`Original: ${(end1 - start1).toFixed(4)}ms (avg: ${((end1 - start1) / iterations).toFixed(6)}ms)`);

    // Regex Logic
    const start2 = performance.now();
    for (let i = 0; i < iterations; i++) {
        optimizedPerceptionRegex(testCases[i % testCases.length]);
    }
    const end2 = performance.now();
    console.log(`Regex: ${(end2 - start2).toFixed(4)}ms (avg: ${((end2 - start2) / iterations).toFixed(6)}ms)`);
}

runBenchmark().catch(console.error);
