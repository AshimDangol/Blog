# Keep Your Render Service Alive (Free Tier) - 30+ Days Uptime Guide

Render's free tier spins down services after **15 minutes of inactivity**. This is a platform limitation that cannot be changed. However, with proper keep-alive setup, your service can stay active for **30+ days or indefinitely**.

## How It Works

- Render's timeout: **15 minutes** (fixed, cannot be changed)
- Solution: Ping your service every **5-10 minutes** to prevent inactivity
- Result: Service stays alive for **30+ days continuously** as long as pings continue

## Option 1: External Ping Services (Recommended) 🎯

The most reliable way is to use external services that ping your API endpoint regularly.

### A. UptimeRobot (Free & Recommended)
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Sign up for a free account (50 monitors free)
3. Click "Add New Monitor"
4. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Blog API Keep-Alive
   - **URL**: `https://blog-fuj3.onrender.com/health`
   - **Monitoring Interval**: 5 minutes (minimum on free tier)
5. Click "Create Monitor"

This will ping your service every 5 minutes, keeping it alive.

### B. cron-job.org (Free)
1. Go to [cron-job.org](https://cron-job.org)
2. Sign up for a free account
3. Create a new cron job:
   - **URL**: `https://blog-fuj3.onrender.com/health`
   - **Schedule**: Every 10 minutes (`*/10 * * * *`)
   - **Request Method**: GET
4. Save and activate

### C. EasyCron
1. Go to [EasyCron.com](https://www.easycron.com)
2. Create a free account
3. Add a cron job to ping `https://blog-fuj3.onrender.com/health` every 10-14 minutes

## Option 2: Internal Keep-Alive (Less Reliable)

You can enable an internal keep-alive mechanism, but note: **if the service is spun down, it can't ping itself**, so this only works if the service is already running.

To enable:
1. In Render Dashboard → Environment Variables
2. Add:
   - `ENABLE_KEEP_ALIVE` = `true`
   - `RENDER_EXTERNAL_URL` = `https://blog-fuj3.onrender.com`
3. Redeploy

**Note**: This is less effective on free tier since the service needs to be running to ping itself.

## Option 3: Upgrade to Paid Tier

Render's paid plans ($7/month+) don't spin down services. This is the most reliable but costs money.

## Recommended Solution

**Use UptimeRobot** - it's free, reliable, and widely used. Set it to ping your `/health` endpoint every 5 minutes.

## Testing Your Health Endpoint

Your service now has a dedicated health check endpoint:

```bash
# Local
curl http://localhost:5000/health

# Production
curl https://blog-fuj3.onrender.com/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-03T02:41:37.000Z",
  "uptime": 123.45,
  "mongodb": "connected"
}
```

## Long-Term Uptime (30+ Days)

With UptimeRobot or similar services configured correctly, your service will:
- ✅ Stay alive for **30+ days continuously**
- ✅ Remain active as long as the ping service is running
- ✅ Avoid spin-downs completely (no 15-minute timeout if pings continue)
- ✅ Have zero downtime (except for actual deployments or Render maintenance)

**Key**: Set the ping interval to **5-10 minutes** (less than Render's 15-minute timeout) to ensure continuous uptime.

## Important Notes

- Render's 15-minute inactivity timeout is a platform limitation and **cannot be changed via code**
- With proper ping setup (every 5-10 minutes), your service can stay alive **indefinitely** (30+ days)
- Free tier services will still have a cold start delay (~30 seconds) ONLY if they spin down (which won't happen with proper pings)
- The `/health` endpoint is lightweight and perfect for monitoring
- External ping services are the most reliable solution for free tier
- **30-day+ uptime is achievable** with continuous ping services like UptimeRobot

