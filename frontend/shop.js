document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".btn");
  
    buttons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in to add items to your cart.");
          return;
        }
  
        const itemName = btn.parentElement.querySelector("h3").innerText.split('\n')[0].trim();
        const priceText = btn.parentElement.querySelector("span").innerText;
        const price = parseFloat(priceText.replace('$', ''));
        const quantity = 1;
  
        try {
          const response = await fetch("http://localhost:5000/api/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ itemName, price, quantity })
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert("Added to cart!");
          } else {
            alert(data.error || "Failed to add to cart");
          }
        } catch (err) {
          console.error("Add to cart error:", err);
          alert("Server error");
        }
      });
    });
  });
  