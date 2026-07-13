document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Save token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
  
        alert("Login successful!");
        window.location.href = "index.html"; // redirect to homepage
      } else {
        alert(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error!");
    }
  });
  