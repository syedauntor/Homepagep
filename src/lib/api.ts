const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function getToken(): string | null {
  try {
    const session = localStorage.getItem("adminSession");
    if (!session) return null;
    const { token } = JSON.parse(session);
    return token || null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  // 204 No Content
  if (res.status === 204) return null as T;
  return res.json();
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const patch = <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) => post<{ token: string; email: string }>("/auth/login", { email, password }),
};

// ── Blog Posts ────────────────────────────────────────────────────────────────
export const blogApi = {
  list: (params?: { status?: string; limit?: number; sort?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.sort) q.set("sort", params.sort);
    return get<BlogPost[]>(`/blog-posts${q.toString() ? "?" + q : ""}`);
  },
  count: () => get<{ count: number }>("/blog-posts/count"),
  get: (idOrSlug: string) => get<BlogPost>(`/blog-posts/${idOrSlug}`),
  prev: (postId: string) => get<BlogPost | null>(`/blog-posts/${postId}/prev`),
  next: (postId: string) => get<BlogPost | null>(`/blog-posts/${postId}/next`),
  incrementViews: (postId: string) => post<{ success: boolean }>(`/blog-posts/${postId}/increment-views`, {}),
  create: (data: Partial<BlogPost>) => post<BlogPost>("/blog-posts", data),
  update: (id: string, data: Partial<BlogPost>) => put<BlogPost>(`/blog-posts/${id}`, data),
  delete: (id: string) => del<{ success: boolean }>(`/blog-posts/${id}`),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => get<Category[]>("/categories"),
  get: (idOrSlug: string) => get<Category>(`/categories/${idOrSlug}`),
  postsByCategory: (categoryId: string) => get<BlogPost[]>(`/categories/${categoryId}/posts`),
  create: (data: Partial<Category>) => post<Category>("/categories", data),
  update: (id: string, data: Partial<Category>) => put<Category>(`/categories/${id}`, data),
  delete: (id: string) => del<{ success: boolean }>(`/categories/${id}`),
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params?: { is_active?: boolean; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.is_active !== undefined) q.set("is_active", String(params.is_active));
    if (params?.limit) q.set("limit", String(params.limit));
    return get<Product[]>(`/products${q.toString() ? "?" + q : ""}`);
  },
  count: () => get<{ count: number }>("/products/count"),
  get: (id: string, is_active?: boolean) => {
    const q = is_active !== undefined ? `?is_active=${is_active}` : "";
    return get<Product>(`/products/${id}${q}`);
  },
  create: (data: Partial<Product>) => post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) => put<Product>(`/products/${id}`, data),
  delete: (id: string) => del<{ success: boolean }>(`/products/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  list: () => get<Order[]>("/orders"),
  stats: () => get<{ orders: Order[]; total_revenue: number; recent: Order[] }>("/orders/stats"),
  get: (id: string) => get<{ order: Order; items: OrderItem[] }>(`/orders/${id}`),
  create: (data: { customer_email: string; customer_name: string; total_amount: number; items: { product_id: string; quantity: number; price: number }[] }) =>
    post<Order>("/orders", data),
  updateStatus: (id: string, status: string) => patch<Order>(`/orders/${id}/status`, { status }),
};

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) => post<ContactSubmission>("/contact", data),
  list: () => get<ContactSubmission[]>("/contact"),
  count: () => get<{ count: number }>("/contact/count"),
  delete: (id: string) => del<{ success: boolean }>(`/contact/${id}`),
};

// ── Pages ─────────────────────────────────────────────────────────────────────
export const pagesApi = {
  list: (is_published?: boolean) => {
    const q = is_published !== undefined ? `?is_published=${is_published}` : "";
    return get<Page[]>(`/pages${q}`);
  },
  get: (slug: string) => get<Page>(`/pages/${slug}`),
  create: (data: Partial<Page>) => post<Page>("/pages", data),
  update: (id: string, data: Partial<Page>) => put<Page>(`/pages/${id}`, data),
  togglePublished: (id: string) => patch<Page>(`/pages/${id}/toggle-published`),
  delete: (id: string) => del<{ success: boolean }>(`/pages/${id}`),
};

// ── Menu ──────────────────────────────────────────────────────────────────────
export const menuApi = {
  list: (params?: { location?: string; is_active?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.location) q.set("location", params.location);
    if (params?.is_active !== undefined) q.set("is_active", String(params.is_active));
    return get<MenuItem[]>(`/menu${q.toString() ? "?" + q : ""}`);
  },
  create: (data: Partial<MenuItem>) => post<MenuItem>("/menu", data),
  update: (id: string, data: Partial<MenuItem>) => put<MenuItem>(`/menu/${id}`, data),
  delete: (id: string) => del<{ success: boolean }>(`/menu/${id}`),
};

// ── Authors ───────────────────────────────────────────────────────────────────
export const authorsApi = {
  list: (params?: { show_on_home?: boolean; is_active?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.show_on_home !== undefined) q.set("show_on_home", String(params.show_on_home));
    if (params?.is_active !== undefined) q.set("is_active", String(params.is_active));
    return get<Author[]>(`/authors${q.toString() ? "?" + q : ""}`);
  },
  getByName: (name: string) => get<Author>(`/authors/by-name/${encodeURIComponent(name)}`),
  create: (data: Partial<Author>) => post<Author>("/authors", data),
  update: (id: string, data: Partial<Author>) => put<Author>(`/authors/${id}`, data),
  toggleActive: (id: string) => patch<Author>(`/authors/${id}/toggle-active`),
  delete: (id: string) => del<{ success: boolean }>(`/authors/${id}`),
};

// ── Site Settings ─────────────────────────────────────────────────────────────
export const settingsApi = {
  list: () => get<SiteSetting[]>("/settings"),
  get: (key: string) => get<SiteSetting>(`/settings/${key}`),
  update: (key: string, value: string) => put<SiteSetting>(`/settings/${key}`, { value }),
};

// ── Images ────────────────────────────────────────────────────────────────────
export const imagesApi = {
  list: () => get<GalleryImage[]>("/images"),
  save: (data: { filename: string; storage_path: string; public_url: string; size: number; mime_type?: string }) =>
    post<GalleryImage>("/images", data),
  delete: (id: string) => del<{ success: boolean }>(`/images/${id}`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => get<DashboardStats>("/dashboard/stats"),
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  author?: string;
  image_url?: string;
  featured_image?: string;
  image_alt?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  status: string;
  views?: number;
  published_at?: string;
  modified_at?: string;
  lock_modified_date?: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  position?: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock?: number;
  is_active: boolean;
  file_type?: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_title?: string;
  product_image?: string;
  file_type?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  is_published: boolean;
  is_system?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  menu_location: string;
  label: string;
  url: string;
  target: string;
  display_order: number;
  parent_id?: string | null;
  is_active: boolean;
}

export interface Author {
  id: string;
  name: string;
  designation?: string;
  bio?: string;
  avatar_url?: string;
  avatar_alt?: string;
  email?: string;
  role?: string;
  access_enabled?: boolean;
  fb_url?: string;
  ig_url?: string;
  x_url?: string;
  pinterest_url?: string;
  linkedin_url?: string;
  show_on_home?: boolean;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  group: string;
  created_at: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  size: number;
  mime_type?: string;
  created_at: string;
}

export interface DashboardStats {
  blog_count: number;
  product_count: number;
  message_count: number;
  order_count: number;
  total_revenue: number;
  recent_orders: Order[];
}
