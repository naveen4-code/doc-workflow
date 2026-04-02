async function loadDropdowns() {
  const { data: sectors } = await supabaseClient.from("sector").select("*");
  const { data: types } = await supabaseClient.from("document_type").select("*");

  sector.innerHTML = sectors.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
  type.innerHTML = types.map(t => `<option value="${t.id}">${t.name}</option>`).join("");
}

async function upload() {
  const user = (await supabaseClient.auth.getUser()).data.user;
  const file = fileInput.files[0];

  const { data } = await supabaseClient.storage
    .from("documents")
    .upload(`docs/${Date.now()}-${file.name}`, file);

  const url = `${SUPABASE_URL}/storage/v1/object/public/documents/${data.path}`;

  await supabaseClient.from("document").insert({
    title: title.value,
    file_url: url,
    user_id: user.id,
    sector_id: sector.value,
    type_id: type.value,
    template_id: 1
  });

  loadDocs();
}

async function loadDocs() {
  const user = (await supabaseClient.auth.getUser()).data.user;

  const { data } = await supabaseClient
    .from("document")
    .select("*")
    .eq("user_id", user.id);

  docs.innerHTML = data.map(d => `
    <div>
      ${d.title} - ${d.status}
    </div>
  `).join("");
}

loadDropdowns();
loadDocs();