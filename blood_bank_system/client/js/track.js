document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  const msg = document.getElementById('msg');
  const historyTable = document.getElementById('historyTable');

  if (!token || !email) {
    msg.innerText = "Login required to view request history.";
    msg.style.color = "red";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5050/api/recipient/history/${email}`, {
      headers: {
        'Authorization': token
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }

    const history = await response.json();

    if (!Array.isArray(history) || history.length === 0) {
      msg.innerText = "No request history available.";
      return;
    }

    history.forEach((req, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${req.bloodGroup || 'N/A'}</td>
        <td>${req.location || 'N/A'}</td>
        <td>${req.reason || 'Not Provided'}</td>
        <td>${req.date || 'Unknown'}</td>
      `;
      historyTable.querySelector('tbody').appendChild(row);
    });

  } catch (error) {
    console.error(error);
    msg.innerText = "Something went wrong while fetching history.";
    msg.style.color = "red";
  }
});