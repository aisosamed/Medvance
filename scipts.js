/* ==========================================
   MEDVANCE PHARMACY
   Static Ecommerce Functionality
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     CONFIGURATION
  ========================================== */

  /*
    IMPORTANT:
    Replace this with the actual WhatsApp number.

    Nigeria example:
    2348012345678

    Do NOT include:
    +234
    spaces
    brackets
    dashes
  */

  const WHATSAPP_NUMBER = "2349012345678";


  /* ==========================================
     ELEMENTS
  ========================================== */

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const mobileNav =
    document.getElementById("mobileNav");

  const searchToggle =
    document.getElementById("searchToggle");

  const searchPanel =
    document.getElementById("searchPanel");

  const closeSearch =
    document.getElementById("closeSearch");

  const searchInput =
    document.getElementById("searchInput");

  const productsGrid =
    document.getElementById("productsGrid");

  const productsEmpty =
    document.getElementById("productsEmpty");

  const filterButtons =
    document.querySelectorAll(".filter-button");

  const cartButton =
    document.getElementById("cartButton");

  const cartDrawer =
    document.getElementById("cartDrawer");

  const closeCart =
    document.getElementById("closeCart");

  const overlay =
    document.getElementById("overlay");

  const cartItems =
    document.getElementById("cartItems");

  const cartCount =
    document.getElementById("cartCount");

  const cartTotal =
    document.getElementById("cartTotal");

  const toast =
    document.getElementById("toast");

  const newsletterForm =
    document.getElementById("newsletterForm");

  const year =
    document.getElementById("year");


  /* ==========================================
     CURRENT YEAR
  ========================================== */

  year.textContent = new Date().getFullYear();


  /* ==========================================
     MOBILE MENU
  ========================================== */

  mobileMenuButton.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });


  document.querySelectorAll(".mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
    });
  });


  /* ==========================================
     SEARCH
  ========================================== */

  searchToggle.addEventListener("click", () => {
    searchPanel.classList.add("open");
    searchInput.focus();
  });


  closeSearch.addEventListener("click", () => {
    searchPanel.classList.remove("open");
    searchInput.value = "";
    filterProducts();
  });


  searchInput.addEventListener("input", () => {
    filterProducts();
  });


  /* ==========================================
     PRODUCT FILTERING
  ========================================== */

  let currentCategory = "all";


  filterButtons.forEach(button => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      currentCategory =
        button.dataset.category;

      filterProducts();

    });

  });


  function filterProducts() {

    const searchTerm =
      searchInput.value.toLowerCase().trim();

    const products =
      document.querySelectorAll(".product-card");

    let visibleProducts = 0;

    products.forEach(product => {

      const category =
        product.dataset.category;

      const name =
        product.dataset.name.toLowerCase();

      const matchesCategory =
        currentCategory === "all" ||
        category === currentCategory;

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm);

      if (
        matchesCategory &&
        matchesSearch
      ) {

        product.style.display = "";

        visibleProducts++;

      } else {

        product.style.display = "none";

      }

    });


    productsEmpty.classList.toggle(
      "show",
      visibleProducts === 0
    );

  }


  /* ==========================================
     CART
  ========================================== */

  let cart = [];


  document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

      const productName =
        button.dataset.product;

      const existingProduct =
        cart.find(
          item => item.name === productName
        );


      if (existingProduct) {

        existingProduct.quantity++;

      } else {

        const productCard =
          button.closest(".product-card");

        const priceText =
          productCard
            .querySelector(".product-bottom strong")
            .textContent
            .replace(/[₦,]/g, "");

        cart.push({
          name: productName,
          price: Number(priceText),
          quantity: 1
        });

      }


      updateCart();

      showToast(
        `${productName} added to cart.`
      );

    });

  });


  function updateCart() {

    const totalItems =
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

    const totalPrice =
      cart.reduce(
        (total, item) =>
          total +
          item.price *
          item.quantity,
        0
      );


    cartCount.textContent =
      totalItems;


    cartTotal.textContent =
      formatCurrency(totalPrice);


    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <div>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add products to get started.</p>
        </div>
      `;

      return;

    }


    cartItems.innerHTML =
      cart.map((item, index) => {

        return `
          <div class="cart-item">

            <div>
              <h3>${item.name}</h3>
              <p>
                ${formatCurrency(item.price)}
                × ${item.quantity}
              </p>
            </div>

            <button
              class="remove-item"
              data-index="${index}"
            >
              Remove
            </button>

          </div>
        `;

      }).join("");


    document
      .querySelectorAll(".remove-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          cart.splice(index, 1);

          updateCart();

        });

      });

  }


  function formatCurrency(amount) {

    return "₦" +
      amount.toLocaleString("en-NG");

  }


  /* ==========================================
     CART DRAWER
  ========================================== */

  cartButton.addEventListener("click", () => {
    openCart();
  });


  closeCart.addEventListener("click", () => {
    closeCartDrawer();
  });


  overlay.addEventListener("click", () => {
    closeCartDrawer();
  });


  function openCart() {

    cartDrawer.classList.add("open");
    overlay.classList.add("show");

    document.body.style.overflow =
      "hidden";

  }


  function closeCartDrawer() {

    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");

    document.body.style.overflow =
      "";

  }


  /* ==========================================
     TOAST
  ========================================== */

  let toastTimeout;


  function showToast(message) {

    toast.querySelector("p").textContent =
      message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout =
      setTimeout(() => {

        toast.classList.remove("show");

      }, 2500);

  }


  /* ==========================================
     NEWSLETTER
  ========================================== */

  newsletterForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const email =
        document.getElementById("email").value;

      if (!email) {
        return;
      }

      showToast(
        "Thank you for subscribing."
      );

      newsletterForm.reset();

    }
  );


  /* ==========================================
     WHATSAPP LINKS
  ========================================== */

  document
    .querySelectorAll(
      'a[href*="wa.me"]'
    )
    .forEach(link => {

      const currentHref =
        link.getAttribute("href");

      if (
        WHATSAPP_NUMBER &&
        currentHref
      ) {

        const message =
          currentHref.includes("?text=")
            ? currentHref.split("?text=")[1]
            : "";

        const newHref =
          `https://wa.me/${WHATSAPP_NUMBER}` +
          (message
            ? `?text=${message}`
            : "");

        link.setAttribute(
          "href",
          newHref
        );

      }

    });


  /* ==========================================
     SMOOTH ACTIVE NAV
  ========================================== */

  const sections =
    document.querySelectorAll("main section[id]");

  const navLinks =
    document.querySelectorAll(
      ".desktop-nav a"
    );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            navLinks.forEach(link => {
              link.classList.remove("active");
            });

            const activeLink =
              document.querySelector(
                `.desktop-nav a[href="#${entry.target.id}"]`
              );

            if (activeLink) {
              activeLink.classList.add("active");
            }

          }

        });

      },
      {
        threshold: 0.25
      }
    );


  sections.forEach(section => {
    observer.observe(section);
  });

});