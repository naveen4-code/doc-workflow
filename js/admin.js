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

loadSectors();