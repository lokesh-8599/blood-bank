console.log("✅ adminstats.js loaded");

window.onload = async function () {

  try {
    const res = await fetch("http://localhost:5050/api/admin/stats");

    if (!res.ok) throw new Error("Failed to fetch dashboard stats");

    const data = await res.json();

    document.getElementById("donors").textContent = data.donors || 0;
    document.getElementById("recipients").textContent = data.recipients || 0;
    document.getElementById("requests").textContent = data.requests || 0;
  } catch (err) {
    console.error("❌ Error loading dashboard data:", err.message);
    alert("Failed to load admin stats.");
  }
};
