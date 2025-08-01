// frontend/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const updateForm = document.getElementById("updateProfileForm");
  if (updateForm) {
    updateForm.onsubmit = async (e) => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5050/api/donor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id, // ensure _id is stored in login response
          fullName: document.getElementById("fullName").value,
          age: document.getElementById("age").value,
          bloodGroup: document.getElementById("bloodGroup").value,
          contact: document.getElementById("contact").value,
        }),
      });
      const data = await res.json();
      document.getElementById("updateMessage").textContent = data.message;
    };
  }
});