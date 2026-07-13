const hamMenu = document.querySelector(".harmbuger");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

// Simulate login status (change this to true when user is logged in)
let isLoggedIn = !!localStorage.getItem("token");


// Get the profile container and dropdown elements
const profileContainers = document.querySelectorAll('.profile-container');

profileContainers.forEach((container) => {
  const dropdown = container.querySelector('.dropdown-content');
  const preLogin = dropdown.querySelector('.pre-login');
  const postLogin = dropdown.querySelector('.post-login');

  // Hover In
  container.addEventListener('mouseenter', () => {
    dropdown.style.display = 'block';

    if (isLoggedIn) {
      preLogin.classList.add('hidden');
      postLogin.classList.remove('hidden');
    } else {
      preLogin.classList.remove('hidden');
      postLogin.classList.add('hidden');
    }
  });

  // Hover Out
  container.addEventListener('mouseleave', () => {
    dropdown.style.display = 'none';
  });
});
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/cart", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok && Array.isArray(data)) {
      const totalItems = data.reduce((acc, item) => acc + item.quantity, 0);

      // Update Cart link text in both navs
      const cartLinks = document.querySelectorAll('a[href="cart.html"]');
      cartLinks.forEach(link => {
        link.innerText = `Cart (${totalItems})`;
      });
    }
  } catch (err) {
    console.error("Cart fetch error:", err);
  }
});

