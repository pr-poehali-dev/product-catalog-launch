const AUTH_URL = "https://functions.poehali.dev/477ef20b-c20b-44db-8a14-98c2e0b5610a";
const PRODUCTS_URL = "https://functions.poehali.dev/5d45e902-cea5-45c6-9fce-8879cddab14c";

function getSessionId(): string {
  return localStorage.getItem("session_id") || "";
}

async function request(url: string, options: RequestInit = {}) {
  const sessionId = getSessionId();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "X-Session-Id": sessionId } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// AUTH
export async function apiRegister(body: {
  name: string; company: string; inn: string; email: string;
  password: string; role: string; country?: string; description?: string;
}) {
  return request(AUTH_URL, { method: "POST", body: JSON.stringify({ action: "register", ...body }) });
}

export async function apiLogin(email: string, password: string) {
  return request(AUTH_URL, { method: "POST", body: JSON.stringify({ action: "login", email, password }) });
}

export async function apiGetMe() {
  return request(`${AUTH_URL}?action=me`);
}

// PRODUCTS
export async function apiGetProducts(params?: {
  category?: string; q?: string; in_stock?: boolean; verified?: boolean;
  sort?: string; seller_id?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.q) qs.set("q", params.q);
  if (params?.in_stock) qs.set("in_stock", "true");
  if (params?.verified) qs.set("verified", "true");
  if (params?.sort) qs.set("sort", params.sort);
  if (params?.seller_id) qs.set("seller_id", params.seller_id);
  const suffix = qs.toString() ? `?${qs}` : "";
  return request(`${PRODUCTS_URL}${suffix}`);
}

export async function apiCreateProduct(body: {
  name: string; category: string; price: string; price_unit: string;
  min_order: string; description: string; specs: { key: string; value: string }[];
  tags: string | string[]; in_stock: boolean;
}) {
  return request(PRODUCTS_URL, { method: "POST", body: JSON.stringify(body) });
}

export async function apiUpdateProduct(id: string, body: object) {
  return request(`${PRODUCTS_URL}/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiSendInquiry(productId: string, body: {
  buyer_name: string; buyer_company: string; buyer_phone: string;
  buyer_email?: string; quantity?: string; note?: string;
}) {
  return request(`${PRODUCTS_URL}/${productId}/inquiry`, { method: "POST", body: JSON.stringify(body) });
}
