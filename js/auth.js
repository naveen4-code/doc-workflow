async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("Logged in successfully!");
    window.location.href = "user.html";
  }
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Sign-up failed: " + error.message);
  } else {
    alert("Sign-up successful! You can now login.");
  }
}