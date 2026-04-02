async function addSector() {
  await supabaseClient.from("sector").insert({
    name: sectorName.value
  });
}

async function addType() {
  await supabaseClient.from("document_type").insert({
    name: typeName.value
  });
}