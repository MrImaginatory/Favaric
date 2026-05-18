# Implementation Plan: Favaric Service Status Page

This document outlines the proposed design, architecture, and step-by-step implementation plan for a **simple, sober, and highly professional** status page dashboard for the **Favaric Ecommerce Store** backend.

---

## 1. System Architecture & How It Works

The status page will be built as a self-contained feature within our Express server. It will serve two formats:

1. **HTML Dashboard (`/status`)**: A clean, sober, responsive status panel designed for human operators.
2. **JSON Endpoint (`/api/v1/status` or `/status/json`)**: A machine-readable status document for uptime monitors (like UptimeRobot, Pingdom) or automated alerting tools.

### What Metrics & Services We Check

To give an accurate status of the system, the server will check:

* **API Server Operational Status**: Checks if the Express app is running and active.
* **System Resource Metrics**:
  * **Server Uptime**: Time since the server process started (formatted cleanly in Days, Hours, Minutes, Seconds).
  * **Memory Usage**: Process memory consumption (`heapUsed` / `heapTotal` and total system RSS memory) formatted in MB.
  * **Platform & Environment**: Node.js version, OS platform (e.g., win32, linux), and runtime environment (e.g., development).
* **Database (PostgreSQL via Sequelize)**:
  * We run `sequelize.authenticate()` to ensure the backend can actively query the database.
  * *Green (Operational)* if successful; *Red (Outage)* with failure error details if the database connection drops.
* **Cache Store (Redis via ioredis)**:
  * We inspect the `redis.status` state (e.g., `'ready'`, `'connect'`) or run a fast `redis.ping()` command.
  * *Green (Operational)* if connected; *Red (Outage)* if Redis is offline.

---

## 2. Sober & Simple Design Specification

In line with your request for a **simple and sober** design, we avoid flashy animations, high-contrast neon highlights, or dark gamer themes. Instead, we adopt a premium, clean corporate status look inspired by Github Status, Slack Status, and Stripe:

* **Color Palette**:
  * **Background**: Neutral light-grey (`#f8fafc`) for a clean, minimal look.
  * **Primary Card Background**: Pure white (`#ffffff`) with subtle, soft-grey borders (`#e2e8f0`).
  * **Text colors**: Dark slate charcoal (`#0f172a`) for main headings, medium grey (`#475569`) for metadata.
  * **Status colors**:
    * **Operational (Green)**: Soft, calm forest-green (Background `#f0fdf4`, Border `#bbf7d0`, Text `#166534`, Indicator `#22c55e`).
    * **Issues/Outages (Red)**: Soft rose-red (Background `#fef2f2`, Border `#fecaca`, Text `#991b1b`, Indicator `#ef4444`).
* **Typography**:
  * Standard professional system-font stack (Inter, system-ui, -apple-system, sans-serif) for high legibility and zero external font loading latency.
* **Layout**:
  * **Header Section**: Clean, minimal title "System Status" and system indicator "Favaric Store Backend".
  * **Global Status Banner**: A full-width header card stating:
    * `🟢 All Systems Operational` if all checks pass.
    * `🔴 Service Disruptions Detected` if one or more services are down.
  * **Individual Service Grid**: Two-column layout on desktop, single-column on mobile.
    * **API Server Card**: Shows system info, uptime, memory, Node version.
    * **Postgres Database Card**: Shows connection status and DB host.
    * **Redis Cache Card**: Shows connection status and port.
  * **Footer**: "Last Checked: HH:MM:SS" with a subtle **Auto-Refresh Indicator** (refreshes the page every 30 seconds to keep stats real-time).

---

## 3. Step-by-Step Implementation Strategy

Here is exactly how we will write the code to create this status dashboard:

### Step 1: Create a Status Controller

We will create a new controller: [status.controller.ts](file:///e:/PrabhatTasks/test/EcommerceStore/backend/src/controller/status.controller.ts)
This controller will:

* Collect Node/OS process metrics (uptime, memory).
* Test database connectivity using `sequelize.authenticate()`.
* Test Redis connectivity by pinging the Redis client or checking its status.
* Compute the overall system status (operational or disrupted).
* Format and return either **HTML** (using a simple template literal with styled inline CSS) or **JSON** depending on the request type or route.

### Step 2: Define Status Routes

We will register a new route file: [status.route.ts](file:///e:/PrabhatTasks/test/EcommerceStore/backend/src/routes/status.route.ts)
We will register two endpoints:

* `GET /status` - Serves the HTML Status Dashboard.
* `GET /api/v1/status` - Serves the clean status JSON data for monitoring services.

### Step 3: Mount Routes in Express App

We will import and mount `statusRouter` in the main server app file: [app.ts](file:///e:/PrabhatTasks/test/EcommerceStore/backend/src/app.ts).
We will mount it directly at `/status` for super-easy browser access, and `/api/v1/status` for JSON format.

---

## 4. Visual Preview of the Design (Sober HTML & CSS Mockup)

Here is a conceptual look at the HTML template we will render dynamically:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>System Status | Favaric</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 680px;
    }
    .header {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .logo span {
      font-weight: 400;
      color: #64748b;
    }
    .banner {
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .banner.success {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
    }
    .banner.error {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
    }
    .card-title {
      font-size: 15px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot.green { background-color: #22c55e; }
    .dot.red { background-color: #ef4444; }
    .metrics-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      font-size: 13px;
    }
    .metric-item {
      display: flex;
      flex-direction: column;
    }
    .metric-label {
      color: #64748b;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }
    .metric-value {
      font-weight: 500;
      color: #334155;
    }
    .footer {
      text-align: center;
      color: #64748b;
      font-size: 12px;
      margin-top: 32px;
    }
  </style>
</head>
<body>
  ...
</body>
</html>
```

---

## 5. Next Steps

Please review this plan. Once you give me the green light, I will proceed to:

1. Create the `status.controller.ts` file under `backend/src/controller/`.
2. Create the `status.route.ts` file under `backend/src/routes/`.
3. Mount it in `backend/src/app.ts`.
4. Validate that it runs perfectly on `http://localhost:3001/status`.
