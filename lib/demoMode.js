export const isDemoMode = process.env.NEXT_PUBLIC_ENV === "demo";

const DEMO_USER_ID_KEY = "elhodaDemoUserId";
const DEMO_CART_KEY = "elhodaDemoCart";
const DEMO_FAVS_KEY = "elhodaDemoFavs";

const readStorage = (key, fallback = null) => {
  if (typeof window === "undefined") return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getDemoImageSrc = (image) => {
  const src = Array.isArray(image) ? image[0] : image;
  return src || "/hero.png";
};

export const fetchDemoUsers = async () => {
  const response = await fetch("/demo/users.json");
  const json = await response.json();
  return json.data || [];
};

export const fetchDemoProducts = async () => {
  const response = await fetch("/demo/products.json");
  const json = await response.json();
  return json.data || [];
};

export const fetchDemoCategories = async () => {
  const response = await fetch("/demo/categories.json");
  const json = await response.json();
  return json.data || [];
};

export const fetchDemoFeaturedProducts = async () => {
  const products = await fetchDemoProducts();
  return products.filter((product) => product.isFeatured);
};

export const fetchDemoProduct = async (id) => {
  const products = await fetchDemoProducts();
  return products.find((product) => product._id === id) || null;
};

export const fetchDemoOrders = async () => {
  const response = await fetch("/demo/orders.json");
  const json = await response.json();
  return json.data || [];
};

export const fetchDemoOrder = async (orderId) => {
  const orders = await fetchDemoOrders();
  return orders.find((order) => order.orderId.toString() === orderId.toString()) || null;
};

export const loginDemoUser = (user) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_USER_ID_KEY, user.id);
};

export const logoutDemoUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_USER_ID_KEY);
};

export const getStoredDemoUserId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DEMO_USER_ID_KEY);
};

export const getDemoCart = () => readStorage(DEMO_CART_KEY, []);

export const saveDemoCart = (cart) => {
  writeStorage(DEMO_CART_KEY, cart);
  return cart;
};

export const addDemoCartItem = async (productId, quantity = 1, color = "", size = "") => {
  const product = await fetchDemoProduct(productId);
  if (!product) return [];

  const cart = getDemoCart();
  const existingItem = cart.find((item) => (
    item.productId === productId &&
    item.color === color &&
    item.size === size
  ));

  if (existingItem) {
    existingItem.quantity += quantity;
    return saveDemoCart(cart);
  }

  return saveDemoCart([
    ...cart,
    {
      _id: `${productId}-${color || "default"}-${size || "default"}`,
      productId,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice || product.price,
      image: getDemoImageSrc(product.images),
      quantity,
      color,
      size,
    },
  ]);
};

export const updateDemoCartItem = (itemId, quantity) => {
  const cart = getDemoCart()
    .map((item) => item._id === itemId ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);

  return saveDemoCart(cart);
};

export const removeDemoCartItem = (itemId) => {
  const cart = getDemoCart().filter((item) => item._id !== itemId);
  return saveDemoCart(cart);
};

export const clearDemoCart = () => saveDemoCart([]);

export const getDemoFavs = async () => {
  const favIds = readStorage(DEMO_FAVS_KEY, []);
  const products = await fetchDemoProducts();

  return favIds
    .map((productId) => {
      const product = products.find((item) => item._id === productId);
      return product ? { _id: `fav-${productId}`, productId: product } : null;
    })
    .filter(Boolean);
};

export const addDemoFav = async (productId) => {
  const favIds = readStorage(DEMO_FAVS_KEY, []);
  if (!favIds.includes(productId)) {
    writeStorage(DEMO_FAVS_KEY, [...favIds, productId]);
  }
  return getDemoFavs();
};

export const removeDemoFav = async (productId) => {
  const favIds = readStorage(DEMO_FAVS_KEY, []).filter((id) => id !== productId);
  writeStorage(DEMO_FAVS_KEY, favIds);
  return getDemoFavs();
};
