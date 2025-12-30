import fetch from "node-fetch";

// Replace with your backend URL
const BASE_URL = "http://localhost:3500/api/drivers";

// Replace with your driver credentials
const DRIVER_EMAIL = "driver@example.com";
const DRIVER_PASSWORD = "DriverPassword123";

// Time between polls in ms
const POLL_INTERVAL = 5000;

// Time to simulate delivery in ms
const DELIVERY_DELAY = 7000;

let driverToken = "";
let driverId = "";

// Driver login
async function loginDriver() {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DRIVER_EMAIL, password: DRIVER_PASSWORD }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  driverToken = data.token;
  driverId = data.driver._id;
  console.log("Driver logged in. Token:", driverToken);
}

// Update driver location
async function updateLocation(lat = 16.9000, long = 79.8740, status = "Available") {
  const res = await fetch(`${BASE_URL}/update-location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${driverToken}`,
    },
    body: JSON.stringify({ latitude: lat, longitude: long, status }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Failed to update location:", data.message);
    return;
  }

  console.log("Location updated:", data.driver.location.coordinates, "Status:", data.driver.status);
}

// Fetch assigned orders
async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${driverToken}` },
  });
  const orders = await res.json();
  return orders.filter(order => order.driverStatus === "Assigned" || order.driverStatus === "Pending");
}

// Update order status
async function deliverOrder(orderId) {
  const res = await fetch(`${BASE_URL}/update-order-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${driverToken}`,
    },
    body: JSON.stringify({ orderId, status: "Delivered" }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Failed to update order:", data.message);
    return;
  }

  console.log(`Order ${orderId} delivered`);
}

// Driver workflow loop
async function driverWorkflow() {
  await loginDriver();
  await updateLocation();

  console.log("Driver workflow started. Polling for orders every 5 seconds...");

  setInterval(async () => {
    const orders = await fetchOrders();
    console.log(`Assigned orders: ${orders.length}`);

    for (const order of orders) {
      console.log(`Order ${order._id}, Status: ${order.driverStatus}`);

      // Simulate delivery for orders still assigned
      if (order.driverStatus === "Assigned") {
        console.log(`Processing order ${order._id} for ${order.user.name}`);
        setTimeout(() => deliverOrder(order._id), DELIVERY_DELAY);
      }
    }
  }, POLL_INTERVAL);
}

// Start workflow
driverWorkflow().catch(err => console.error(err));
