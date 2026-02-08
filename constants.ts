
export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx_YOUR_ACTUAL_ID/exec";

export const DEFAULT_ADMIN_SETTINGS = {
  vatRate: 0.12,
  deliveryFee: 2.50,
  ownerEmail: 'manager@elitecafe.com',
  isLocked: true,
  categories: ['COMBO', 'DRINK', 'COFFEE', 'TEA', 'SNACK']
};

export const DEMO_PRODUCTS = [
  {
    sku: "CMB-01",
    name: "Golden Morning Combo",
    price: 8.50,
    category: "COMBO",
    image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop",
    active: true,
    description: "Espresso, Avocado Toast, and a Fresh Fruit Bowl."
  },
  {
    sku: "CMB-02",
    name: "Executive Lunch",
    price: 12.90,
    category: "COMBO",
    image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    active: true,
    description: "Grilled Salmon, Quinoa Salad, and Sparkling Water."
  },
  {
    sku: "CMB-03",
    name: "Artisan Coffee Flight",
    price: 9.20,
    category: "COMBO",
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    active: true,
    description: "Three single-origin roasts with almond biscotti."
  },
  {
    sku: "CMB-04",
    name: "Sweet Afternoon",
    price: 7.50,
    category: "COMBO",
    image_url: "https://images.unsplash.com/photo-1559622214-f8a9850965bb?q=80&w=800&auto=format&fit=crop",
    active: true,
    description: "Latte with a handcrafted pistachio macaron."
  },
  {
    sku: "DRK-01",
    name: "Midnight Cold Brew",
    price: 4.50,
    category: "COFFEE",
    image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400&auto=format&fit=crop",
    active: true
  },
  {
    sku: "DRK-02",
    name: "Matcha Zen Latte",
    price: 5.20,
    category: "TEA",
    image_url: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=400&auto=format&fit=crop",
    active: true
  },
  {
    sku: "SNK-01",
    name: "Truffle Fries",
    price: 6.00,
    category: "SNACK",
    image_url: "https://images.unsplash.com/photo-1573016608244-7d5f17136f86?q=80&w=400&auto=format&fit=crop",
    active: true
  },
  {
    sku: "SNK-02",
    name: "Artisan Scone",
    price: 3.50,
    category: "SNACK",
    image_url: "https://images.unsplash.com/photo-1581451006509-0d268595462f?q=80&w=400&auto=format&fit=crop",
    active: true
  },
  {
    sku: "DRK-03",
    name: "Sparkling Hibiscus",
    price: 4.00,
    category: "DRINK",
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400&auto=format&fit=crop",
    active: true
  }
] as any[];
