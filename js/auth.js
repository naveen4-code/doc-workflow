async function signup() {
  const email = emailInput.value;
  const password = passwordInput.value;
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });
  if (error) return alert(error.message);

  await supabaseClient.from("users").insert({
    id: data.user.id,
    email,
    role: "user"
  });
  alert("Signup success");
}
async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });
  if (error) return alert(error.message);

  const { data: user } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (user.role === "admin") location.href = "admin.html";
  else if (user.role === "reviewer") location.href = "reviewer.html";
  else location.href = "user.html";
}