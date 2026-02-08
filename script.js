const products = [
  {
    id: "combo-north",
    name: "Northern Sunrise Combo",
    price: 14.5,
    category: "Combos",
    description: "Golden waffle stack, herb eggs, and roasted tomatoes.",
    badge: "Signature",
    badgeActive: true,
  },
  {
    id: "combo-luxe",
    name: "Luxe Brunch Pairing",
    price: 16.0,
    category: "Combos",
    description: "Avocado toast duo, citrus salad, and a crafted latte.",
    badge: "Popular",
    badgeActive: true,
  },
  {
    id: "soup-mushroom",
    name: "Silky Mushroom Soup",
    price: 7.25,
    category: "Soups",
    description: "Creamy porcini blend with toasted garlic brioche.",
    badge: "Seasonal",
  },
  {
    id: "salad-harvest",
    name: "Harvest Greens",
    price: 9.75,
    category: "Salads",
    description: "Baby kale, roasted squash, cranberries, and feta.",
    badge: "Integrity",
    badgeType: "integrity",
  },
  {
    id: "main-bowl",
    name: "Charcoal Grain Bowl",
    price: 12.5,
    category: "Mains",
    description: "Saffron rice, grilled chicken, and smoked paprika.",
    badge: "Top pick",
    badgeActive: true,
  },
  {
    id: "main-pasta",
    name: "Velvet Pesto Pasta",
    price: 11.9,
    category: "Mains",
    description: "Spinach linguine with pistachio basil pesto.",
    badge: "Chef",
  },
  {
    id: "dessert-tart",
    name: "Amber Citrus Tart",
    price: 6.5,
    category: "Desserts",
    description: "Shortcrust tart with yuzu custard and berry glaze.",
    badge: "Limited",
  },
  {
    id: "drink-latte",
    name: "Velvet Oat Latte",
    price: 4.25,
    category: "Drinks",
    description: "Single-origin espresso with oat milk microfoam.",
    badge: "Barista",
  },
];

const state = {
  cart: JSON.parse(localStorage.getItem("elite_cart") || "{}"),
  activeSelection: "all",
};

const heroGrid = document.getElementById("hero-grid");
const filterSelect = document.getElementById("filter-select");
const productGrid = document.getElementById("product-grid");
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

const currency = (value) => `$${value.toFixed(2)}`;

const updateStorage = () => {
  localStorage.setItem("elite_cart", JSON.stringify(state.cart));
};

const setCartOpen = (open) => {
  cartPanel.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
};

document.getElementById("open-cart").addEventListener("click", () => setCartOpen(true));
overlay.addEventListener("click", () => setCartOpen(false));

const renderHero = () => {
  const featured = products.slice(0, 3);
  heroGrid.innerHTML = featured
    .map(
      (item) => `
        <div class="hero-card">
          <div class="badge ${item.badgeType === "integrity" ? "integrity" : ""}" data-active="${
            item.badgeActive ? "true" : "false"
          }">${item.badge}</div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="price-row">
            <span class="price">${currency(item.price)}</span>
            <button class="add-btn" data-add="${item.id}">Add</button>
          </div>
        </div>
      `
    )
    .join("");
};

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

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeLabel.textContent = isLight ? "Light" : "Dark";
};

const storedTheme = localStorage.getItem("elite_theme");
const initialTheme = storedTheme || "dark";
applyTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  localStorage.setItem("elite_theme", nextTheme);
  applyTheme(nextTheme);
});

const addToCart = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  state.cart[id] = state.cart[id] || { ...product, qty: 0 };
  state.cart[id].qty += 1;
  updateStorage();
  renderCart();
};

const updateQty = (id, delta) => {
  if (!state.cart[id]) return;
  state.cart[id].qty += delta;
  if (state.cart[id].qty <= 0) {
    delete state.cart[id];
  }
  updateStorage();
  renderCart();
};

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

filterSelect.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  state.activeSelection = target.value;
  renderFilters();
  renderProducts();
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (!Object.keys(state.cart).length) return;
  alert("Order confirmed! We'll have it ready shortly.");
  state.cart = {};
  updateStorage();
  renderCart();
  setCartOpen(false);
});

renderHero();
renderFilters();
renderProducts();
renderCart();
