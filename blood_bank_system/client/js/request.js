document.getElementById('requestForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'recipient') {
    alert('Please login as a recipient.');
    window.location.href = '../login.html';
    return;
  }

  const bloodGroup = document.getElementById('bloodGroup').value;
  const hospital = document.getElementById('hospital').value;
  const reason = document.getElementById('reason').value;

  const res = await fetch('http://localhost:5050/api/recipient/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({
      email: user.email,
      hospital,
      units: 1,
      date: new Date().toLocaleDateString()
    })
  });

  const data = await res.json();
  const msgEl = document.getElementById('msg');

  if (res.ok) {
    msgEl.style.color = 'green';
    msgEl.textContent = '✅ Request submitted successfully!';
  } else {
    msgEl.style.color = 'red';
    msgEl.textContent = `❌ ${data.error || "Something went wrong"}`;
  }
});