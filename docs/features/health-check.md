# Health Check API

This feature provides a simple endpoint to verify the system status and uptime.

## Endpoint

`GET /api/health`

## Response

Returns a JSON object with the following fields:

- `status`: String "ok" indicating the system is running.
- `timestamp`: ISO 8601 string of the current server time.
- `uptime`: Number representing the process uptime in seconds.

## Usage

```bash
curl http://localhost:3000/api/health
```

## Implementation Details

Located at `src/app/api/health/route.ts`.
