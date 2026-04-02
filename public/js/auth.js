async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) return alert(data);
  localStorage.setItem("token", data.token);
  if (data.role === "admin") location.href = "admin.html";
  else if (data.role === "reviewer") location.href = "reviewer.html";
  else location.href = "user.html";
}
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) return alert("Signup failed");
  alert("Signup successful");
  location.href = "login.html";
}