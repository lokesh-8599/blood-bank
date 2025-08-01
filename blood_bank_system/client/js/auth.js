// ✅ Set correct base URL
const API = 'http://localhost:5050/api';

// 🔐 REGISTER
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').onsubmit = async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      role: document.getElementById('role').value
    };

    const msg = document.getElementById('registerMessage');

    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        msg.style.color = 'green';
        msg.textContent = result.message;
        setTimeout(() => (window.location.href = 'login.html'), 1000);
      } else {
        msg.style.color = 'red';
        msg.textContent = result.message || 'Registration failed.';
      }
    } catch (err) {
      msg.style.color = 'red';
      msg.textContent = 'Server error. Please try again later.';
      console.error('Register Error:', err);
    }
  };
}

// 🔑 LOGIN
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();

    const msg = document.getElementById('loginMessage');

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('loginEmail').value,
          password: document.getElementById('loginPassword').value
        })
      });

      const result = await res.json();

      if (res.ok) {
        // Store token & user details
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        // Redirect to dashboard or role-based page
        window.location.href = 'dashboard.html';
      } else {
        msg.style.color = 'red';
        msg.textContent = result.message || 'Login failed.';
      }
    } catch (err) {
      msg.style.color = 'red';
      msg.textContent = 'Server error. Please try again later.';
      console.error('Login Error:', err);
    }
  };
}
