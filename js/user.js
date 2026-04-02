async function upload() {
  const user = await supabaseClient.auth.getUser();
  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;

  const { data: fileData } = await supabaseClient.storage
    .from("documents")
    .upload(`docs/${Date.now()}-${file.name}`, file);

  const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/documents/${fileData.path}`;

  // Insert document
  const { data: doc } = await supabaseClient
    .from("document")
    .insert({
      title,
      file_url: fileUrl,
      user_id: user.data.user.id,
      status: "PENDING"
    })
    .select()
    .single();

  // Assign workflow instance
  await supabaseClient.from("workflow_instance").insert({
    document_id: doc.id
  });

  alert("Uploaded with workflow!");
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
async function loadHistory(docId) {
  const { data } = await supabaseClient
    .from("approval_log")
    .select("*")
    .eq("document_id", docId);

  console.log(data);
}
protectPage();

loadUserInfo();
loadDocs();