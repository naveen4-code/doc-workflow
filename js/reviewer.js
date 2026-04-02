async function loadDocs() {
  const { data } = await supabaseClient
    .from("document")
    .select("*")
    .eq("status", "PENDING");

  let html = "";

  data.forEach(doc => {
    html += `
      <div>
        ${doc.title}
        <button onclick="approve(${doc.id})">Approve</button>
        <button onclick="reject(${doc.id})">Reject</button>
      </div>
    `;
  });

  document.getElementById("list").innerHTML = html;
}

async function approve(id) {
  await supabaseClient
    .from("document")
    .update({ status: "APPROVED" })
    .eq("id", id);

  await supabaseClient.from("approval_log").insert({
    document_id: id,
    action: "APPROVED"
  });

  loadDocs();
}

async function reject(id) {
  await supabaseClient
    .from("document")
    .update({ status: "REJECTED" })
    .eq("id", id);

  await supabaseClient.from("approval_log").insert({
    document_id: id,
    action: "REJECTED"
  });

  loadDocs();
}

loadDocs();