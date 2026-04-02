const token = localStorage.getItem("token");
async function loadPending() {
  const res = await fetch("/api/reviewer/pending", {
    headers: { "Authorization": token }
  });
  const docs = await res.json();
  list.innerHTML = docs.map(d => `
    <tr>
      <td>${d.title}</td>
      <td>
        <button onclick="approve(${d.id})">Approve</button>
        <button onclick="reject(${d.id})">Reject</button>
      </td>
    </tr>
  `).join("");
}
async function approve(id) {
  await fetch(`/api/reviewer/approve/${id}`, {
    method: "POST",
    headers: { "Authorization": token }
  });

  loadPending();
}
async function reject(id) {
  await fetch(`/api/reviewer/reject/${id}`, {
    method: "POST",
    headers: { "Authorization": token }
  });
  loadPending();
}
loadPending();