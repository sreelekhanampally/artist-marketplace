document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("You must be logged in to view your cart.");
      window.location.href = "login.html";
      return;
    }
  
    const cartItemsDiv = document.getElementById("cartItems");
    const emptyMsg = document.getElementById("emptyCartMessage");
  
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await res.json();
  
      if (res.ok && data.length > 0) {
        let total = 0;
  
        data.forEach(item => {
          total += item.price * item.quantity;
  
          const div = document.createElement("div");
          div.className = "cart-item";
          div.innerHTML = `
            <h3>${item.itemName}</h3>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
            <hr>
          `;
          cartItemsDiv.appendChild(div);
        });
  
        // Show total
        const totalDiv = document.createElement("div");
        totalDiv.className = "cart-total";
        totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        cartItemsDiv.appendChild(totalDiv);
  
        // Add Clear All button
        const clearBtn = document.createElement("button");
        clearBtn.textContent = "🗑️ Clear All";
        clearBtn.className = "clear-cart-btn";
        cartItemsDiv.appendChild(clearBtn);
  
        clearBtn.addEventListener("click", async () => {
          if (confirm("Are you sure you want to clear the entire cart?")) {
            const clearRes = await fetch("http://localhost:5000/api/cart/clear", {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const result = await clearRes.json();
            if (clearRes.ok) {
              alert("Cart cleared!");
              location.reload();
            } else {
              alert(result.error || "Failed to clear cart");
            }
          }
        });
  
        // Add Checkout (dummy) button
        const checkoutBtn = document.createElement("button");
        checkoutBtn.textContent = "✅ Checkout";
        checkoutBtn.className = "checkout-btn";
        cartItemsDiv.appendChild(checkoutBtn);
  
        checkoutBtn.addEventListener("click", async () => {
            const confirmOrder = confirm("Are you sure you want to place your order?");
            if (!confirmOrder) return;
          
            try {
              const res = await fetch("http://localhost:5000/api/cart/checkout", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
          
              const data = await res.json();
              if (res.ok) {
                alert(data.message);
                location.reload();
              } else {
                alert(data.error || "Checkout failed.");
              }
            } catch (err) {
              console.error("Checkout error:", err);
              alert("Server error");
            }
          });
          
  
        // Add event listeners to Remove buttons
        document.querySelectorAll(".remove-btn").forEach(button => {
          button.addEventListener("click", async () => {
            const id = button.getAttribute("data-id");
  
            try {
              const delRes = await fetch(`http://localhost:5000/api/cart/remove/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
  
              const result = await delRes.json();
  
              if (delRes.ok) {
                alert("Item removed!");
                location.reload();
              } else {
                alert(result.error || "Failed to remove item");
              }
            } catch (err) {
              console.error("Delete error:", err);
              alert("Server error");
            }
          });
        });
  
      } else {
        emptyMsg.style.display = "block";
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
      alert("Something went wrong while fetching the cart.");
    }
  });
  // DELETE item from cart
router.delete('/remove/:id', authenticateToken, (req, res) => {
    const cartItemId = req.params.id;
  
    const query = `DELETE FROM cart WHERE id = ? AND userId = ?`;
  
    db.run(query, [cartItemId, req.userId], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to delete item' });
  
      res.json({ message: 'Item removed from cart' });
    });
  });
  // Clear all items in cart
router.delete('/clear', authenticateToken, (req, res) => {
    db.run(`DELETE FROM cart WHERE userId = ?`, [req.userId], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to clear cart' });
  
      res.json({ message: 'Cart cleared' });
    });
  });
  