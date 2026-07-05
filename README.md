# Tableau Public "Live-Updating" E-Commerce Dashboard — Setup Guide

## Important honesty check first

Tableau Public **cannot** auto-refresh a published web dashboard on its own — that capability (scheduled extract refresh, live database connections) only exists in Tableau Server/Cloud, which need a paid license. This isn't a limitation of this setup — it's a limitation of the Public tier itself.

**What we're building instead**, which is the best legitimate approximation and a good interview talking point:
- A Google Sheet that **updates itself automatically in the background** (via a script, running on Google's servers — not your laptop) every few minutes with new simulated orders.
- A Tableau Public dashboard connected to that sheet.
- A `Data > Refresh` step you do manually before republishing — this pulls the newest rows into your dashboard.


---

## Step 1 — Create the Google Sheet

1. Go to **sheets.google.com** → create a new blank spreadsheet
2. Rename it: `live_orders_seed` (File → Rename)
3. **Rename the first tab** (bottom left, right-click the tab) to exactly: `live_orders_seed` — the script depends on this exact name
4. Import the seed data: **File → Import → Upload** → select `live_orders_seed.csv` (provided below) → choose **"Replace current sheet"** → Import

## Step 2 — Set up the auto-updating script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any placeholder code in the editor
3. Paste the entire contents of `live_order_generator.gs` (provided below)
4. Click the **disk/save icon** (or Ctrl+S)
5. Click the **clock icon** on the left sidebar (labeled "Triggers")
6. Click **"+ Add Trigger"** (bottom right)
7. Set:
   - Function to run: `addLiveOrders`
   - Event source: `Time-driven`
   - Type: `Minutes timer` → `Every 5 minutes` (or 10/15 — your choice)
8. Click **Save**
9. Google will ask you to authorize the script — click through the prompts (it may show an "unverified app" warning since this is your own personal script; click **Advanced → Go to [project name] (unsafe)** → Allow). This is normal and safe since you wrote the code yourself.

From this point on, new rows will keep appearing in your sheet automatically, every 5 minutes, even with your laptop closed.

## Step 3 — Connect Tableau Public to the Google Sheet

1. Open **Tableau Public Desktop** (the free app you download to build/edit — different from the web gallery)
2. On the start screen, under "Connect", click **Google Sheets**
3. Sign in with the same Google account
4. Select your `live_orders_seed` spreadsheet
5. Drag the `live_orders_seed` sheet onto the canvas
6. Click **Sheet 1** (bottom tab) to start building

## Step 4 — Build the dashboard

Create these worksheets, then combine them into one dashboard (Dashboard → New Dashboard):

| Worksheet | Chart type | Fields |
|---|---|---|
| **Revenue Trend** | Line chart | X: `order_date` (continuous, by day or week), Y: `SUM(revenue)` |
| **Revenue by Category** | Horizontal bar | Rows: `category`, Columns: `SUM(revenue)`, sorted descending |
| **Orders by City** | Map or bar chart | `city`, `COUNT(order_id)` |
| **Payment Method Split** | Pie or donut | `payment_method`, `COUNT(order_id)` |
| **KPI Cards** | Text/Big Number | Total Revenue, Total Orders, Avg Order Value — use "Show Me" or just format a text table with big font |
| **Acquisition Channel** | Bar or Treemap | `acquisition_channel`, `SUM(revenue)` |

**Layout tip**: put the 3 KPI cards across the top, revenue trend line below them (full width), then category/city/payment charts in a 3-column row underneath.

**Add a filter**: drag `order_date` to the Filters shelf on the dashboard, set it as a relative date filter (e.g. "Last 30 days") so it automatically shows recent activity as new rows come in.

## Step 5 — Demo the "live" refresh

Right before your interview or demo:
1. In Tableau Public Desktop, go to **Data → [your data source] → Refresh**
2. Watch the KPI numbers and charts update with whatever new rows the script added since you last opened the file
3. Click **File → Save to Tableau Public** to republish with the fresh data

## Step 6 — Publish & get your public link

1. **File → Save to Tableau Public As...**
2. Sign in / create a free Tableau Public account if you haven't
3. Give it a title, e.g. "E-Commerce Live Sales Dashboard"
4. It'll upload and give you a public URL — this is what you share on your resume/LinkedIn

---

## Files in this package

- `live_orders_seed.csv` — ~13,000 rows of realistic order data (last 90 days) to seed your Google Sheet
- `live_order_generator.gs` — the Apps Script code that auto-generates new orders every few minutes

