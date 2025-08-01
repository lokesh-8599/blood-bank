// frontend/admin/login.js
async function adminLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  try {
    const res = await fetch("http://localhost:5050/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      msg.style.color = "green";
      msg.innerText = result.message;
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      msg.style.color = "red";
      msg.innerText = result.message;
    }
  } catch (err) {
    msg.innerText = "Something went wrong";
    msg.style.color = "red";
  }
}