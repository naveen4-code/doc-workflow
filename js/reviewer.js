async function loadDocs() {
  const { data: userData } = await supabaseClient.auth.getUser();
  const email = userData.user.email;

  const { data } = await supabaseClient
    .from("workflow_instance")
    .select(`
      id,
      current_step,
      document:document_id (id, title)
    `);

  let html = "";

  for (let item of data) {
    // Get step info
    const { data: step } = await supabaseClient
      .from("workflow_step")
      .select("*")
      .eq("step_order", item.current_step)
      .single();

    if (step && step.reviewer_email === email) {
      html += `
        <div>
          ${item.document.title}
          <button onclick="approve(${item.document.id}, ${item.current_step})">Approve</button>
        </div>
      `;
    }
  }

  document.getElementById("list").innerHTML = html;
}

loadDocs();
async function approve(docId, step) {
  const { data: userData } = await supabaseClient.auth.getUser();
  const email = userData.user.email;

  // Log approval
  await supabaseClient.from("approval_log").insert({
    document_id: docId,
    step: step,
    reviewer_email: email,
    action: "APPROVED"
  });

  // Get next step
  const { data: nextStep } = await supabaseClient
    .from("workflow_step")
    .select("*")
    .eq("step_order", step + 1)
    .single();

  if (nextStep) {
    // Move to next step
    await supabaseClient
      .from("workflow_instance")
      .update({ current_step: step + 1 })
      .eq("document_id", docId);
  } else {
    // Final approval
    await supabaseClient
      .from("workflow_instance")
      .update({ status: "APPROVED" })
      .eq("document_id", docId);

    await supabaseClient
      .from("document")
      .update({ status: "APPROVED" })
      .eq("id", docId);
  }

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
async function protectPage() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "index.html";
  }
}

protectPage();
loadDocs();