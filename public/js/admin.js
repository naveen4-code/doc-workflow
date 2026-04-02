const token = localStorage.getItem("token");
async function addSector() {
  await fetch("/api/admin/sector", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ name: sectorName.value })
  });

  alert("Sector added");
}
async function addType() {
  await fetch("/api/admin/type", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ name: typeName.value })
  });
  alert("Type added");
}
async function addStep() {
  await fetch("/api/admin/workflow-step", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      template_id: templateId.value,
      step_order: stepOrder.value,
      reviewer_id: reviewerId.value
    })
  });
  alert("Workflow step added");
}