async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

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
    email: email,
    role: role
  });

  alert("Signup successful!");
}
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login error: " + error.message);
    return;
  }

  const userId = data.user.id;

  // Fetch role
  const { data: userData, error: roleError } = await supabaseClient
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (roleError || !userData) {
    alert("Role fetch error");
    return;
  }

  // Redirect
  if (userData.role === "admin") {
    window.location.href = "admin.html";
  } else if (userData.role === "reviewer") {
    window.location.href = "reviewer.html";
  } else {
    window.location.href = "user.html";
  }
}
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}