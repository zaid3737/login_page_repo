function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");
  const success = document.getElementById("success");

  error.textContent = "";
  success.textContent = "";

  if (!email || !password) {
    error.textContent = "Please fill in all fields.";
  } else {
    success.textContent = "Login successful";
  }
}
