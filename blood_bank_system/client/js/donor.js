// Ensure user is logged in and is a donor
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'donor') {
  window.location.href = "../login.html";
}

// Show welcome name
document.addEventListener("DOMContentLoaded", () => {
  const welcomeEl = document.getElementById('welcome');
  if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.name}`;
});

// -------------------- Profile Update --------------------
if (document.getElementById("profileForm")) {
  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const bloodGroup = document.getElementById("bloodGroup").value;
    const contact = document.getElementById("contact").value;

    try {
      const res = await fetch("http://localhost:5050/api/donor/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: user.email, bloodGroup, contact }),
      });

      const data = await res.json();
      alert(data.message || "Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile.");
      console.error(err);
    }
  });
}

// -------------------- Schedule Donation --------------------
if (document.getElementById("donateForm")) {
  document.getElementById("donateForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const date = document.getElementById("donationDate").value;
    const location = document.getElementById("location").value;

    try {
      const res = await fetch("http://localhost:5050/api/donor/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: user.email, date, location }),
      });

      const data = await res.json();
      alert(data.message || "Donation scheduled successfully");
    } catch (err) {
      alert("Error scheduling donation.");
      console.error(err);
    }
  });
}

// -------------------- View Donation History --------------------
if (document.getElementById("donationTable")) {
  fetch(`http://localhost:5050/api/donor/history?email=${user.email}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const table = document.getElementById("donationTable");
      if (data.history && data.history.length > 0) {
        data.history.forEach((donation, index) => {
          const row = `<tr>
            <td>${index + 1}</td>
            <td>${donation.date}</td>
            <td>${donation.location}</td>
          </tr>`;
          table.innerHTML += row;
        });
      } else {
        table.innerHTML += `<tr><td colspan="3">No donation history found.</td></tr>`;
      }
    })
    .catch((err) => {
      console.error("Error loading history:", err);
    });
}