document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in to view your orders.");
      window.location.href = "login.html";
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/cart/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await res.json();
      const orderList = document.getElementById("orderList");
      const noOrders = document.getElementById("noOrders");
  
      if (res.ok && data.length > 0) {
        data.forEach(order => {
          const div = document.createElement("div");
          div.className = "cart-item";
          div.innerHTML = `
            <h3>${order.itemName}</h3>
            <p>Price: $${order.price}</p>
            <p>Quantity: ${order.quantity}</p>
            <p><small>Ordered on: ${new Date(order.createdAt).toLocaleString()}</small></p>
            <hr>
          `;
          orderList.appendChild(div);
        });
      } else {
        noOrders.style.display = "block";
      }
  
    } catch (err) {
      console.error("Order fetch error:", err);
      alert("Something went wrong while loading your order history.");
    }
  });
  