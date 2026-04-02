const token = localStorage.getItem("token");
async function loadDropdowns() {
  const sectorRes = await fetch("/api/admin/sectors");
  const typeRes = await fetch("/api/admin/types");
  const sectors = await sectorRes.json();
  const types = await typeRes.json();
  sector.innerHTML = sectors.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  type.innerHTML = types.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
}
async function upload() {
  const formData = new FormData();
  formData.append("file", file.files[0]);
  formData.append("title", title.value);
  formData.append("sector_id", sector.value);
  formData.append("type_id", type.value);
  await fetch("/api/documents/upload", {
    method: "POST",
    headers: { "Authorization": token },
    body: formData
  });
  alert("Uploaded");
  loadDocs();
}
async function loadDocs() {
  const res = await fetch("/api/documents/my", {
    headers: { "Authorization": token }
  });
  const data = await res.json();
  docs.innerHTML = data.map(d => `
    <tr>
      <td>${d.title}</td>
      <td>${d.status}</td>
    </tr>
  `).join("");
}
loadDropdowns();
loadDocs();