function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");
  const success = document.getElementById("success");

  error.textContent = "";
  success.textContent = "";

  if (!email || !password) {
    error.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      success.textContent = data.message;
    } else {
      error.textContent = data.message;
    }
  } catch (err) {
    error.textContent = "Server error. Please try again.";
    console.error(err);
  }
}

