import axios, { AxiosInstance } from "axios";

// Use NEXT_PUBLIC_API_URL for Next.js client-side API base, fallback to localhost if missing.
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : undefined);

if (!apiBaseUrl) {
  if (typeof window !== "undefined") {
    // Warn if missing in production (will break all API calls in client)
    // eslint-disable-next-line no-console
    console.warn(
      "NEXT_PUBLIC_API_URL is not set! Please define it in your environment variables."
    );
  }
}

// For debugging: shows which base URL is being used (only in browser!)
if (typeof window !== "undefined") {
  console.log("API base URL:", apiBaseUrl);
}

// --- JWT TOKEN HANDLING ---
export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem("jwtToken", token);
}

export function getToken(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem("jwtToken")
    : null;
}

export function removeToken() {
  if (typeof window !== "undefined") localStorage.removeItem("jwtToken");
}

// Configure axios instance
const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API = {
  // Product endpoints
  getProducts: (params: Record<string, any> = {}) =>
    api.get("/products", { params }),

  getProduct: (id: string) => api.get(`/products/${id}`),

  // Featured products: accepts custom params (limit, sort, etc)
  getFeaturedProducts: (params: Record<string, any> = {}) =>
    api.get("/products", { params: { featured: true, ...params } }),

  // Pocket Friendly
  getPocketFriendlyProducts: ({
    maxPrice = 20000,
    limit = 10,
  }: { maxPrice?: number; limit?: number } = {}) =>
    api.get("/products", { params: { maxPrice, limit, sort: "price_asc" } }),

  // Deals/Promotions
  getDealsProducts: ({ limit = 30 }: { limit?: number } = {}) =>
    api.get("/products", { params: { isOnSale: true, limit } }),

  createProduct: (data: any) => api.post("/products", data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),

  // Category endpoints
  getCategories: () => api.get("/categories"),
  createCategory: (data: any) => api.post("/categories", data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
  createCategoryMultipart: (formData: FormData) =>
    api.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateCategoryMultipart: (id: string, formData: FormData) =>
    api.put(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Brand endpoints
  getBrands: () => api.get("/brands"),
  createBrand: (data: any) => api.post("/brands", data),
  updateBrand: (id: string, data: any) => api.put(`/brands/${id}`, data),
  deleteBrand: (id: string) => api.delete(`/brands/${id}`),
  createBrandMultipart: (formData: FormData) =>
    api.post("/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateBrandMultipart: (id: string, formData: FormData) =>
    api.put(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Dashboard stats (admin)
  getDashboardStats: () => api.get("/admin/dashboard"),

  // Order endpoints
  createOrder: (orderData: any) => api.post("/orders", orderData),
  getOrders: (params: Record<string, any> = {}) =>
    api.get("/orders", { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}`, { status }),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),

  // Cart endpoints
  getCart: () => api.get("/cart"),
  addToCart: (productId: string, quantity = 1) =>
    api.post("/cart", { productId, quantity }),
  updateCartItem: (itemId: string, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeCartItem: (itemId: string) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart"),

  // Admin endpoints
  getCustomers: (params: Record<string, any> = {}) =>
    api.get("/admin/customers", { params }),
  updateCustomer: (id: string, data: any) =>
    api.patch(`/admin/customers/${id}`, data),

  // ---- REVIEW ENDPOINTS ----
  getProductReviews: (productId: string) =>
    api.get(`/products/${productId}/reviews`),
  submitProductReview: (productId: string, data: any) =>
    api.post(`/products/${productId}/reviews`, data),
  getRecentReviews: () => api.get("/reviews/recent"),
  getAllReviews: () => api.get("/admin/reviews"),
  approveReview: (reviewId: string) =>
    api.patch(`/admin/reviews/${reviewId}/approve`),
  deleteReview: (reviewId: string) => api.delete(`/admin/reviews/${reviewId}`),

  // =======================
  // Auth/JWT
  // =======================
  login: async ({ password }: { password: string }) => {
    const response = await api.post("/auth/login", { password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response;
  },
  logout: () => {
    removeToken();
    return Promise.resolve();
  },
  checkAdmin: () => api.get("/auth/check"),

  // =======================
  // Product Advisor Bot (AI Chatbot)
  // =======================
  sendBotMessage: (message: string) => api.post("/product-bot", { message }),
};

export default API;