document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const message = document.getElementById("message");

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      message.style.color = "green";
      message.innerText = "Registration successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      message.style.color = "red";
      message.innerText = data.error || "Something went wrong!";
    }
  } catch (error) {
    console.error("Error:", error);
    message.style.color = "red";
    message.innerText = "Network error!";
  }
});
