const BASE_URL = "https://trafficiq-v1-backend.onrender.com";

const headers = { "ngrok-skip-browser-warning": "true" };

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
  return res.json();
}

export async function fetchPlates() {
  const res = await fetch(`${BASE_URL}/plates`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch plates: ${res.status}`);
  return res.json();
}

export async function searchPlates(plate: string) {
  const res = await fetch(`${BASE_URL}/plates/search?plate=${encodeURIComponent(plate)}`, { headers });
  if (!res.ok) throw new Error(`Failed to search plates: ${res.status}`);
  return res.json();
}

export async function fetchVehicleStats() {
  const res = await fetch(`${BASE_URL}/stats/vehicles`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch vehicle stats: ${res.status}`);
  return res.json();
}

export async function fetchCameraStats() {
  const res = await fetch(`${BASE_URL}/stats/cameras`, { headers });
  if (!res.ok) throw new Error(`Failed to fetch camera stats: ${res.status}`);
  return res.json();
}
