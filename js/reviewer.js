async function loadPending() {
  const user = (await supabaseClient.auth.getUser()).data.user;

  const { data: docs } = await supabaseClient
    .from("document")
    .select("*")
    .eq("status", "PENDING");

  let html = "";

  for (let doc of docs) {
    const { data: step } = await supabaseClient
      .from("workflow_step")
      .select("*")
      .eq("template_id", doc.template_id)
      .eq("step_order", doc.current_step)
      .single();

    if (step.reviewer_id === user.id) {
      html += `
        <div>
          ${doc.title}
          <button onclick="approve(${doc.id})">Approve</button>
        </div>
      `;
    }
  }

  list.innerHTML = html;
}

async function approve(id) {
  const { data: doc } = await supabaseClient
    .from("document")
    .select("*")
    .eq("id", id)
    .single();

  const next = doc.current_step + 1;

  const { data: steps } = await supabaseClient
    .from("workflow_step")
    .select("*")
    .eq("template_id", doc.template_id)
    .eq("step_order", next);

  if (steps.length === 0) {
    await supabaseClient.from("document")
      .update({ status: "APPROVED" })
      .eq("id", id);
  } else {
    await supabaseClient.from("document")
      .update({ current_step: next })
      .eq("id", id);
  }

  loadPending();
}

loadPending();