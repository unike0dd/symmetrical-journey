const createImage = ({ label, primary, secondary, accent }) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
        <radialGradient id="glow" cx="0.2" cy="0.2" r="0.6">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.85" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="420" rx="32" fill="url(#bg)" />
      <circle cx="120" cy="110" r="140" fill="url(#glow)" />
      <g fill="rgba(255,255,255,0.85)" font-family="Plus Jakarta Sans, sans-serif">
        <text x="48" y="330" font-size="34" font-weight="700">${label}</text>
        <text x="48" y="368" font-size="20" opacity="0.75">Elite Cafe</text>
      </g>
    </svg>
  `)}`;

// Link/Reference: Product data used by UI and cart actions.
const products = [
  {
    id: "combo-north",
    name: "Northern Sunrise Combo",
    price: 14.5,
    category: "Combos",
    description: "Golden waffle stack, herb eggs, and roasted tomatoes.",
    ingredients: ["Sourdough waffle", "Herb eggs", "Roasted tomatoes", "Maple butter"],
    badge: "Signature",
    badgeActive: true,
    image: createImage({
      label: "Sunrise Combo",
      primary: "#5c3b2e",
      secondary: "#f2b680",
      accent: "#f6d365",
    }),
    imageAlt: "Waffles, herb eggs, and roasted tomatoes",
  },
  {
    id: "combo-luxe",
    name: "Luxe Brunch Pairing",
    price: 16.0,
    category: "Combos",
    description: "Avocado toast duo, citrus salad, and a crafted latte.",
    ingredients: ["Avocado toast", "Citrus salad", "Oat latte", "Chili oil"],
    badge: "Popular",
    badgeActive: true,
    image: createImage({
      label: "Luxe Brunch",
      primary: "#3c4f6b",
      secondary: "#b7c6f5",
      accent: "#a8ff78",
    }),
    imageAlt: "Avocado toast, citrus salad, and latte",
  },
  {
    id: "soup-mushroom",
    name: "Silky Mushroom Soup",
    price: 7.25,
    category: "Soups",
    description: "Creamy porcini blend with toasted garlic brioche.",
    ingredients: ["Porcini blend", "Garlic brioche", "Thyme oil", "Cream"],
    badge: "Seasonal",
    image: createImage({
      label: "Mushroom Soup",
      primary: "#2d2a26",
      secondary: "#7f5a3a",
      accent: "#f0c27b",
    }),
    imageAlt: "Creamy mushroom soup with brioche",
  },
  {
    id: "salad-harvest",
    name: "Harvest Greens",
    price: 9.75,
    category: "Salads",
    description: "Baby kale, roasted squash, cranberries, and feta.",
    ingredients: ["Baby kale", "Roasted squash", "Cranberries", "Feta"],
    badge: "Integrity",
    badgeType: "integrity",
    image: createImage({
      label: "Harvest Greens",
      primary: "#1f3a2d",
      secondary: "#90c695",
      accent: "#b7e4a1",
    }),
    imageAlt: "Harvest greens with squash and feta",
  },
  {
    id: "main-bowl",
    name: "Charcoal Grain Bowl",
    price: 12.5,
    category: "Mains",
    description: "Saffron rice, grilled chicken, and smoked paprika.",
    ingredients: ["Saffron rice", "Grilled chicken", "Paprika", "Pickled onions"],
    badge: "Top pick",
    badgeActive: true,
    image: createImage({
      label: "Grain Bowl",
      primary: "#2b2f3a",
      secondary: "#f4a261",
      accent: "#e9c46a",
    }),
    imageAlt: "Grain bowl with chicken and paprika",
  },
  {
    id: "main-pasta",
    name: "Velvet Pesto Pasta",
    price: 11.9,
    category: "Mains",
    description: "Spinach linguine with pistachio basil pesto.",
    ingredients: ["Spinach linguine", "Pistachio pesto", "Parmesan", "Basil"],
    badge: "Chef",
    image: createImage({
      label: "Pesto Pasta",
      primary: "#264653",
      secondary: "#2a9d8f",
      accent: "#a8ff78",
    }),
    imageAlt: "Spinach linguine with pistachio pesto",
  },
  {
    id: "dessert-tart",
    name: "Amber Citrus Tart",
    price: 6.5,
    category: "Desserts",
    description: "Shortcrust tart with yuzu custard and berry glaze.",
    ingredients: ["Shortcrust", "Yuzu custard", "Berry glaze", "Citrus zest"],
    badge: "Limited",
    image: createImage({
      label: "Citrus Tart",
      primary: "#5d2e46",
      secondary: "#f4a261",
      accent: "#f7d794",
    }),
    imageAlt: "Citrus tart with berry glaze",
  },
  {
    id: "drink-latte",
    name: "Velvet Oat Latte",
    price: 4.25,
    category: "Drinks",
    description: "Single-origin espresso with oat milk microfoam.",
    ingredients: ["Single-origin espresso", "Oat milk", "Microfoam", "Cinnamon"],
    badge: "Barista",
    image: createImage({
      label: "Oat Latte",
      primary: "#3e2f2b",
      secondary: "#d7b49e",
      accent: "#f3d5b5",
    }),
    imageAlt: "Oat latte with microfoam",
  },
];

// Reference: Application state.
const state = {
  cart: JSON.parse(localStorage.getItem("elite_cart") || "{}"),
  activeSelection: "all",
  heroIndex: 0,
};

// Reference: DOM nodes.
const heroTrack = document.getElementById("hero-track");
const heroPrev = document.getElementById("hero-prev");
const heroNext = document.getElementById("hero-next");
const filterSelect = document.getElementById("filter-select");
const productGrid = document.getElementById("product-grid");
const menuToggle = document.getElementById("menu-toggle");
const menuPanel = document.getElementById("menu-panel");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const serviceFeeEl = document.getElementById("service-fee");
const vatEl = document.getElementById("vat");
const totalEl = document.getElementById("total");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const serviceFee = 3.5;

// Function: Format values for display.
const currency = (value) => `$${value.toFixed(2)}`;

// Action: Persist cart state.
const updateStorage = () => {
  localStorage.setItem("elite_cart", JSON.stringify(state.cart));
};

// Action: Toggle cart visibility.
const setCartOpen = (open) => {
  cartPanel.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
};

// Event trigger: Open/close cart.
document.getElementById("open-cart").addEventListener("click", () => setCartOpen(true));
overlay.addEventListener("click", () => setCartOpen(false));

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", () => {
    const isCollapsed = menuPanel.classList.toggle("is-collapsed");
    menuToggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
}

const featuredItems = products.slice(0, 3);

const updateHeroCarousel = () => {
  heroTrack.style.transform = `translateX(-${state.heroIndex * 100}%)`;
};

// Function: Render hero cards.
const renderHero = () => {
  heroTrack.innerHTML = featuredItems
    .map(
      (item) => `
        <div class="hero-slide">
          <div class="hero-card">
            <div class="hero-card-media">
              <div class="badge ${item.badgeType === "integrity" ? "integrity" : ""}" data-active="${
                item.badgeActive ? "true" : "false"
              }">${item.badge}</div>
              <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
            </div>
            <div class="hero-card-content">
              <div>
                <span class="hero-eyebrow">${item.category}</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
              </div>
              <div class="hero-meta">
                <div>
                  <span class="hero-label">Ingredients</span>
                  <ul class="hero-ingredients">
                    ${item.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
                  </ul>
                </div>
                <div class="hero-price-row">
                  <div>
                    <span class="hero-label">Investment</span>
                    <div class="price">${currency(item.price)}</div>
                  </div>
                  <button class="add-btn" data-add="${item.id}">Add to order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
  updateHeroCarousel();
  const disabled = featuredItems.length <= 1;
  heroPrev.disabled = disabled;
  heroNext.disabled = disabled;
};

// Function: Render filter options.
const renderFilters = () => {
  const selections = [
    { value: "all", label: "All" },
    { value: "Combos", label: "Combos" },
    { value: "Soups", label: "Soups" },
    { value: "Salads", label: "Salads" },
    { value: "Mains", label: "Mains" },
    { value: "Desserts", label: "Desserts" },
    { value: "Drinks", label: "Drinks" },
  ];

  filterSelect.innerHTML = selections
    .map(
      (selection) => `
        <option value="${selection.value}">${selection.label}</option>
      `
    )
    .join("");
  filterSelect.value = state.activeSelection;
};

// Function: Render product cards.
const renderProducts = () => {
  const visible =
    state.activeSelection === "all"
      ? products
      : products.filter((p) => p.category === state.activeSelection);
  productGrid.innerHTML = visible
    .map(
      (item) => `
        <div class="card">
          <div class="badge ${item.badgeType === "integrity" ? "integrity" : ""}" data-active="${
            item.badgeActive ? "true" : "false"
          }">${item.badge}</div>
          <div class="card-media">
            <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="price-row">
            <span class="price">${currency(item.price)}</span>
            <button class="add-btn" data-add="${item.id}">Add to cart</button>
          </div>
        </div>
      `
    )
    .join("");
};

// Function: Render cart panel.
const renderCart = () => {
  const items = Object.values(state.cart);
  cartCount.textContent = items.reduce((sum, item) => sum + item.qty, 0);
  cartItems.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="cart-item">
              <div>
                <h4>${item.name}</h4>
                <small>${currency(item.price)} each</small>
              </div>
              <div class="cart-actions">
                <button class="qty-btn" data-qty="${item.id}" data-delta="-1">-</button>
                <strong>${item.qty}</strong>
                <button class="qty-btn" data-qty="${item.id}" data-delta="1">+</button>
              </div>
            </div>
          `
        )
        .join("")
    : `<p class="text-muted">Your cart is empty. Add something delicious.</p>`;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat + (items.length ? serviceFee : 0);

  subtotalEl.textContent = currency(subtotal);
  vatEl.textContent = currency(vat);
  serviceFeeEl.textContent = items.length ? currency(serviceFee) : currency(0);
  totalEl.textContent = currency(total);
};

// Action: Apply selected theme.
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeLabel.textContent = isLight ? "Light" : "Dark";
};

const storedTheme = localStorage.getItem("elite_theme");
const initialTheme = storedTheme || "dark";
applyTheme(initialTheme);

// Event trigger: Theme toggle action.
themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  localStorage.setItem("elite_theme", nextTheme);
  applyTheme(nextTheme);
});

// Action: Add item to cart.
const addToCart = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  state.cart[id] = state.cart[id] || { ...product, qty: 0 };
  state.cart[id].qty += 1;
  updateStorage();
  renderCart();
};

// Action: Update item quantity.
const updateQty = (id, delta) => {
  if (!state.cart[id]) return;
  state.cart[id].qty += delta;
  if (state.cart[id].qty <= 0) {
    delete state.cart[id];
  }
  updateStorage();
  renderCart();
};

// Event trigger: Delegate add/qty actions.
document.addEventListener("click", (event) => {
  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    addToCart(addBtn.dataset.add);
  }

  const qtyBtn = event.target.closest("[data-qty]");
  if (qtyBtn) {
    updateQty(qtyBtn.dataset.qty, Number(qtyBtn.dataset.delta));
  }
});

// Event triggers: Hero carousel navigation.
heroPrev.addEventListener("click", () => {
  state.heroIndex = (state.heroIndex - 1 + featuredItems.length) % featuredItems.length;
  updateHeroCarousel();
});

heroNext.addEventListener("click", () => {
  state.heroIndex = (state.heroIndex + 1) % featuredItems.length;
  updateHeroCarousel();
});

// Event trigger: Apply active filter.
filterSelect.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  state.activeSelection = target.value;
  renderFilters();
  renderProducts();
});

// Event trigger: Checkout action.
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (!Object.keys(state.cart).length) return;
  alert("Order confirmed! We'll have it ready shortly.");
  state.cart = {};
  updateStorage();
  renderCart();
  setCartOpen(false);
});

// Trigger: Initial render.
renderHero();
renderFilters();
renderProducts();
renderCart();
