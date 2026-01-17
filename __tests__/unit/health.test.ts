import { GET } from '@/app/api/health/route'

describe('Health Check API', () => {
  it('should return 200 and valid json', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('uptime')
  })
})
