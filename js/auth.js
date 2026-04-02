async function login() {
  const email = document.getElementById("email").value;

  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email: email
  });

  alert("Check your email for login link");
}

async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user;
}