async function addSector() {
  const name = document.getElementById("sector").value;

  await supabaseClient.from("sector").insert({ name });

  loadSectors();
}

async function loadSectors() {
  const { data } = await supabaseClient
    .from("sector")
    .select("*");

  let html = "";
  data.forEach(sec => {
    html += `<p>${sec.name}</p>`;
  });

  document.getElementById("sectors").innerHTML = html;
}
async function protectPage() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "index.html";
  }
}
async function createWorkflow() {
  const name = prompt("Workflow name");

  const { data: template } = await supabaseClient
    .from("workflow_template")
    .insert({ name })
    .select()
    .single();

  // Add steps manually
  const reviewer1 = prompt("Step 1 reviewer email");
  const reviewer2 = prompt("Step 2 reviewer email");

  await supabaseClient.from("workflow_step").insert([
    { template_id: template.id, step_order: 1, reviewer_email: reviewer1 },
    { template_id: template.id, step_order: 2, reviewer_email: reviewer2 }
  ]);

  alert("Workflow created!");
}
protectPage();
loadSectors();