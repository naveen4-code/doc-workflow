async function signup() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await supabaseClient.from("users").insert({
    id: data.user.id,
    email,
    role: "user"
  });

  alert("Signup successful");
}

async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const { data: user } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (user.role === "admin") window.location.href = "admin.html";
  else if (user.role === "reviewer") window.location.href = "reviewer.html";
  else window.location.href = "user.html";
}