document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     MEDVANCE CART
  ====================================================== */

  const WHATSAPP_NUMBER = "23491669826418";

  const STORAGE_KEY = "medvance_cart";


  /* =====================================================
     DOM ELEMENTS
  ====================================================== */

  const cartButton =
    document.getElementById("cartButton");

  const cartDrawer =
    document.getElementById("cartDrawer");

  const closeCart =
    document.getElementById("closeCart");

  const cartOverlay =
    document.getElementById("cartOverlay");

  const cartItems =
    document.getElementById("cartItems");

  const cartCount =
    document.getElementById("cartCount");

  const cartTotal =
    document.getElementById("cartTotal");

  const checkoutButton =
    document.getElementById("checkoutButton");

  const toast =
    document.getElementById("toast");


  /* =====================================================
     CART STATE
  ====================================================== */

  let cart = loadCart();


  /* =====================================================
     LOAD CART FROM LOCAL STORAGE
  ====================================================== */

  function loadCart() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed =
        JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed;

    } catch (error) {

      console.error(
        "Unable to load cart:",
        error
      );

      return [];

    }

  }


  /* =====================================================
     SAVE CART
  ====================================================== */

  function saveCart() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
      );

    } catch (error) {

      console.error(
        "Unable to save cart:",
        error
      );

    }

  }


  /* =====================================================
     CURRENCY
  ====================================================== */

  function formatCurrency(amount) {

    return (
      "₦" +
      Number(amount).toLocaleString(
        "en-NG"
      )
    );

  }


  /* =====================================================
     OPEN CART
  ====================================================== */

  function openCart() {

    if (!cartDrawer) {
      return;
    }


    cartDrawer.classList.add(
      "cart-open"
    );


    if (cartOverlay) {

      cartOverlay.classList.add(
        "cart-overlay-visible"
      );

    }


    document.body.style.overflow =
      "hidden";


    cartDrawer.setAttribute(
      "aria-hidden",
      "false"
    );


    if (cartButton) {

      cartButton.setAttribute(
        "aria-expanded",
        "true"
      );

    }

  }


  /* =====================================================
     CLOSE CART
  ====================================================== */

  function closeCartDrawer() {

    if (!cartDrawer) {
      return;
    }


    cartDrawer.classList.remove(
      "cart-open"
    );


    if (cartOverlay) {

      cartOverlay.classList.remove(
        "cart-overlay-visible"
      );

    }


    document.body.style.overflow =
      "";


    cartDrawer.setAttribute(
      "aria-hidden",
      "true"
    );


    if (cartButton) {

      cartButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  }


  /* =====================================================
     CART BUTTON
  ====================================================== */

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        openCart();

      }
    );

  }


  /* =====================================================
     CLOSE BUTTON
  ====================================================== */

  if (closeCart) {

    closeCart.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        closeCartDrawer();

      }
    );

  }


  /* =====================================================
     OVERLAY
  ====================================================== */

  if (cartOverlay) {

    cartOverlay.addEventListener(
      "click",
      closeCartDrawer
    );

  }


  /* =====================================================
     ESCAPE KEY
  ====================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        cartDrawer &&
        cartDrawer.classList.contains(
          "cart-open"
        )
      ) {

        closeCartDrawer();

      }

    }
  );


  /* =====================================================
     ADD TO CART
  ====================================================== */

  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".add-cart"
        );


      if (!button) {
        return;
      }


      event.preventDefault();
      event.stopPropagation();


      const productName =
        button.dataset.product;


      const price =
        Number(
          button.dataset.price
        );


      if (
        !productName ||
        !Number.isFinite(price) ||
        price < 0
      ) {

        console.error(
          "Invalid product:",
          {
            productName,
            price
          }
        );

        return;

      }


      /* Find existing product */

      const existing =
        cart.find(
          (item) =>
            item.name === productName
        );


      if (existing) {

        existing.quantity += 1;

      } else {

        cart.push({

          name: productName,

          price: price,

          quantity: 1

        });

      }


      saveCart();

      renderCart();


      /* Button feedback */

      const originalText =
        button.textContent;


      button.textContent =
        "Added ✓";


      button.classList.add(
        "added"
      );


      setTimeout(() => {

        button.textContent =
          originalText;

        button.classList.remove(
          "added"
        );

      }, 1000);


      showToast(
        `${productName} added to cart`
      );


      /*
        Automatically open the cart
        after adding a product.
      */

      openCart();

    }
  );


  /* =====================================================
     CART QUANTITY CONTROLS
  ====================================================== */

  document.addEventListener(
    "click",
    (event) => {

      const quantityButton =
        event.target.closest(
          "[data-cart-action]"
        );


      if (!quantityButton) {
        return;
      }


      const action =
        quantityButton.dataset.cartAction;


      const index =
        Number(
          quantityButton.dataset.index
        );


      if (
        !Number.isInteger(index) ||
        !cart[index]
      ) {

        return;

      }


      if (action === "increase") {

        cart[index].quantity += 1;

      }


      if (action === "decrease") {

        cart[index].quantity -= 1;


        if (
          cart[index].quantity <= 0
        ) {

          cart.splice(index, 1);

        }

      }


      saveCart();

      renderCart();

    }
  );


  /* =====================================================
     REMOVE ITEM
  ====================================================== */

  document.addEventListener(
    "click",
    (event) => {

      const removeButton =
        event.target.closest(
          ".remove-item"
        );


      if (!removeButton) {
        return;
      }


      const index =
        Number(
          removeButton.dataset.index
        );


      if (
        !Number.isInteger(index) ||
        !cart[index]
      ) {

        return;

      }


      cart.splice(index, 1);

      saveCart();

      renderCart();

      showToast(
        "Product removed from cart"
      );

    }
  );


  /* =====================================================
     RENDER CART
  ====================================================== */

  function renderCart() {

    if (!cartItems) {
      return;
    }


    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(
      (item) => {

        totalItems +=
          item.quantity;

        totalPrice +=
          item.price *
          item.quantity;

      }
    );


    /* Cart count */

    if (cartCount) {

      cartCount.textContent =
        totalItems;

    }


    /* Cart total */

    if (cartTotal) {

      cartTotal.textContent =
        formatCurrency(
          totalPrice
        );

    }


    /* Empty cart */

    if (cart.length === 0) {

      cartItems.innerHTML = `

        <div class="cart-empty-state">

          <div class="cart-empty-icon">
            🛒
          </div>

          <h3>
            Your cart is empty
          </h3>

          <p>
            Add products to get started.
          </p>

        </div>

      `;


      updateCheckoutLink();

      return;

    }


    /* Products */

    cartItems.innerHTML =
      cart
        .map(
          (item, index) => {

            const itemTotal =
              item.price *
              item.quantity;


            return `

              <div class="cart-item">

                <div class="cart-item-info">

                  <h3>
                    ${escapeHTML(item.name)}
                  </h3>

                  <p class="cart-item-price">
                    ${formatCurrency(item.price)}
                    each
                  </p>


                  <div class="cart-item-actions">

                    <div class="quantity-control">

                      <button
                        type="button"
                        data-cart-action="decrease"
                        data-index="${index}"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>


                      <span>
                        ${item.quantity}
                      </span>


                      <button
                        type="button"
                        data-cart-action="increase"
                        data-index="${index}"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                    </div>


                    <button
                      type="button"
                      class="remove-item"
                      data-index="${index}"
                    >
                      Remove
                    </button>

                  </div>

                </div>


                <div class="cart-item-total">

                  ${formatCurrency(itemTotal)}

                </div>

              </div>

            `;

          }
        )
        .join("");


    updateCheckoutLink();

  }


  /* =====================================================
     ESCAPE HTML
  ====================================================== */

  function escapeHTML(value) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );

  }


  /* =====================================================
     WHATSAPP CHECKOUT
  ====================================================== */

  function updateCheckoutLink() {

    if (!checkoutButton) {
      return;
    }


    if (cart.length === 0) {

      checkoutButton.href =
        "#";

      checkoutButton.setAttribute(
        "aria-disabled",
        "true"
      );

      checkoutButton.style.opacity =
        "0.55";

      checkoutButton.style.pointerEvents =
        "none";

      return;

    }


    let message =
      "Hello Medvance Pharmacy,%0A%0A";

    message +=
      "I would like to place an order:%0A%0A";


    let total = 0;


    cart.forEach(
      (item) => {

        const itemTotal =
          item.price *
          item.quantity;

        total += itemTotal;


        message +=
          `• ${encodeURIComponent(item.name)} x${item.quantity} - ${encodeURIComponent(formatCurrency(itemTotal))}%0A`;

      }
    );


    message +=
      `%0ATotal: ${encodeURIComponent(formatCurrency(total))}`;

    message +=
      "%0A%0APlease let me know the next steps.";


    checkoutButton.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    checkoutButton.setAttribute(
      "aria-disabled",
      "false"
    );


    checkoutButton.style.opacity =
      "1";

    checkoutButton.style.pointerEvents =
      "auto";

  }


  /* =====================================================
     CHECKOUT BUTTON
  ====================================================== */

  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      (event) => {

        if (cart.length === 0) {

          event.preventDefault();

          showToast(
            "Your cart is empty"
          );

        }

      }
    );

  }


  /* =====================================================
     TOAST
  ====================================================== */

  function showToast(message) {

    if (!toast) {
      return;
    }


    const text =
      toast.querySelector("p");


    if (text) {

      text.textContent =
        message;

    }


    toast.classList.add(
      "show"
    );


    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

  }


  /* =====================================================
     SEARCH
  ====================================================== */

  const searchToggle =
    document.getElementById(
      "searchToggle"
    );

  const searchPanel =
    document.getElementById(
      "searchPanel"
    );

  const closeSearch =
    document.getElementById(
      "closeSearch"
    );

  const searchInput =
    document.getElementById(
      "searchInput"
    );


  if (
    searchToggle &&
    searchPanel
  ) {

    searchToggle.addEventListener(
      "click",
      () => {

        searchPanel.classList.toggle(
          "open"
        );


        if (
          searchPanel.classList.contains(
            "open"
          ) &&
          searchInput
        ) {

          searchInput.focus();

        }

      }
    );

  }


  if (closeSearch) {

    closeSearch.addEventListener(
      "click",
      () => {

        searchPanel.classList.remove(
          "open"
        );


        if (searchInput) {

          searchInput.value =
            "";

        }


        filterProducts();

      }
    );

  }


  /* =====================================================
     PRODUCT FILTERS
  ====================================================== */

  let selectedCategory =
    "all";


  const filterButtons =
    document.querySelectorAll(
      ".filter-button"
    );


  filterButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          filterButtons.forEach(
            (item) => {

              item.classList.remove(
                "active"
              );

            }
          );


          button.classList.add(
            "active"
          );


          selectedCategory =
            button.dataset.category ||
            "all";


          filterProducts();

        }
      );

    }
  );


  if (searchInput) {

    searchInput.addEventListener(
      "input",
      filterProducts
    );

  }


  function filterProducts() {

    const searchTerm =
      searchInput
        ? searchInput.value
            .toLowerCase()
            .trim()
        : "";


    const products =
      document.querySelectorAll(
        ".product-card"
      );


    let visibleCount =
      0;


    products.forEach(
      (product) => {

        const category =
          product.dataset.category ||
          "all";


        const name =
          (
            product.dataset.name ||
            ""
          ).toLowerCase();


        const categoryMatch =
          selectedCategory === "all" ||
          category === selectedCategory;


        const searchMatch =
          searchTerm === "" ||
          name.includes(searchTerm);


        if (
          categoryMatch &&
          searchMatch
        ) {

          product.style.display =
            "";

          visibleCount++;

        } else {

          product.style.display =
            "none";

        }

      }
    );


    const empty =
      document.getElementById(
        "productsEmpty"
      );


    if (empty) {

      empty.classList.toggle(
        "show",
        visibleCount === 0
      );

    }

  }


  /* =====================================================
     MOBILE MENU
  ====================================================== */

  const mobileMenuButton =
    document.getElementById(
      "mobileMenuButton"
    );

  const mobileNav =
    document.getElementById(
      "mobileNav"
    );


  if (
    mobileMenuButton &&
    mobileNav
  ) {

    mobileMenuButton.addEventListener(
      "click",
      () => {

        mobileNav.classList.toggle(
          "open"
        );

      }
    );


    mobileNav
      .querySelectorAll("a")
      .forEach(
        (link) => {

          link.addEventListener(
            "click",
            () => {

              mobileNav.classList.remove(
                "open"
              );

            }
          );

        }
      );

  }


  /* =====================================================
     NEWSLETTER
  ====================================================== */

  const newsletterForm =
    document.getElementById(
      "newsletterForm"
    );


  if (newsletterForm) {

    newsletterForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        showToast(
          "Thanks for subscribing!"
        );


        newsletterForm.reset();

      }
    );

  }


  /* =====================================================
     YEAR
  ====================================================== */

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =====================================================
     INITIALIZE
  ====================================================== */

  renderCart();

  filterProducts();


});