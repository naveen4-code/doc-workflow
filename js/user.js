async function upload() {
  const user = await getUser();
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;

  const { data } = await supabaseClient.storage
    .from("documents")
    .upload(`docs/${Date.now()}-${file.name}`, file);

  const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${data.path}`;

  await supabaseClient.from("document").insert({
    title,
    file_url: fileUrl,
    user_id: user.id,
    type_id: 1,
    sector_id: 1
  });

  alert("Uploaded");
  loadDocs();
}

async function loadDocs() {
  const user = await getUser();

  const { data } = await supabaseClient
    .from("document")
    .select("*")
    .eq("user_id", user.id);

  let html = "";
  data.forEach(doc => {
    html += `<p>${doc.title} - ${doc.status}</p>`;
  });

  document.getElementById("docs").innerHTML = html;
}
async function loadUserInfo() {
  const { data } = await supabaseClient.auth.getUser();

  document.getElementById("userEmail").innerText = data.user.email;
}
async function protectPage() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "index.html";
  }
}

protectPage();

loadUserInfo();
loadDocs();