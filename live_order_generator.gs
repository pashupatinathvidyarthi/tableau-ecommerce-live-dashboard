/**
 * live_order_generator.gs
 * -------------------------
 * Paste this into your Google Sheet's Apps Script editor
 * (Extensions -> Apps Script), then set up a time-based trigger
 * so it runs automatically every few minutes -- this is what makes
 * your data "live" without needing your laptop running.
 *
 * WHAT IT DOES:
 * Every time it runs, it appends 1-5 new random "orders" to the
 * bottom of your sheet, using realistic values based on the same
 * categories/cities/payment methods as your original dataset.
 *
 * SETUP STEPS (do this after pasting the code):
 * 1. Click the clock icon on the left sidebar ("Triggers")
 * 2. Click "+ Add Trigger" (bottom right)
 * 3. Choose function: addLiveOrders
 * 4. Event source: Time-driven
 * 5. Type: Minutes timer -> Every 5 minutes (or 10/15, your choice)
 * 6. Click Save -> it may ask you to authorize the script (click
 *    "Advanced" -> "Go to [project name] (unsafe)" if Google warns you --
 *    this is normal for personal scripts you wrote yourself)
 *
 * From then on, new rows will appear in your sheet automatically,
 * even with your laptop closed. In Tableau Public's desktop app,
 * click "Data > Refresh" before republishing to pull in the new rows.
 */

function addLiveOrders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("live_orders_seed");
  const lastRow = sheet.getLastRow();

  // Read existing order_id and customer_id columns to keep IDs increasing / realistic
  const lastOrderId = Math.max(...sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().map(Number));

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Patna", "Jaipur"];
  const channels = ["Organic", "Paid Ads", "Referral", "Email", "Social Media"];
  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Books", "Grocery", "Toys"];
  const payments = ["Card", "UPI", "COD", "Wallet"];
  const genders = ["M", "F"];

  const numNewOrders = Math.floor(Math.random() * 5) + 1; // 1 to 5 new orders per run
  const today = new Date();
  const dateStr = today.getFullYear() + "-" +
                   String(today.getMonth() + 1).padStart(2, "0") + "-" +
                   String(today.getDate()).padStart(2, "0");

  const rowsToAdd = [];

  for (let i = 0; i < numNewOrders; i++) {
    const orderId = lastOrderId + i + 1;
    const customerId = Math.floor(Math.random() * 5000) + 1;
    const city = cities[Math.floor(Math.random() * cities.length)];
    const age = Math.floor(Math.random() * 47) + 18;
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const itemPrice = Math.round((Math.random() * 3000 + 200) * 100) / 100;
    const revenue = Math.round(itemPrice * quantity * 100) / 100;
    const orderValue = Math.round((revenue * (Math.random() * 0.5 + 1)) * 100) / 100;
    const discountApplied = Math.random() < 0.3 ? 1 : 0;
    const paymentMethod = payments[Math.floor(Math.random() * payments.length)];

    rowsToAdd.push([
      orderId, dateStr, customerId, city, age, gender, channel,
      category, quantity, itemPrice, revenue, orderValue, discountApplied, paymentMethod
    ]);
  }

  sheet.getRange(lastRow + 1, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
}
