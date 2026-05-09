import { googleCalendarTool } from '../src/server/agent/tools/googleCalendar';

async function verify() {
  console.log("Verifying Google Calendar Tool functionality...");

  const listResult = await googleCalendarTool("list my events");
  console.log("List Result:", listResult);
  if (!listResult.includes("Daily Standup")) {
    throw new Error("List functionality failed");
  }

  const scheduleResult = await googleCalendarTool("schedule a meeting");
  console.log("Schedule Result:", scheduleResult);
  if (!scheduleResult.includes("SUCCESS")) {
    throw new Error("Schedule functionality failed");
  }

  const unknownResult = await googleCalendarTool("random query");
  console.log("Unknown Result:", unknownResult);
  if (!unknownResult.includes("Unknown command")) {
    throw new Error("Unknown command handling failed");
  }

  console.log("All functionalities verified successfully!");
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
