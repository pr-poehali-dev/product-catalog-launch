import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  apiGetProducts, apiCreateProduct, apiUpdateProduct, apiSendInquiry,
  apiLogin, apiRegister, apiGetMe
} from "@/api";

export type UserRole = "buyer" | "seller" | null;

export interface User {
  id: string;
  name: string;
  company: string;
  inn: string;
  email: string;
  role: UserRole;
  country?: string;
  description?: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCountry: string;
  sellerVerified: boolean;
  name: string;
  category: string;
  price: string;
  priceUnit: string;
  minOrder: string;
  description: string;
  specs: { key: string; value: string }[];
  tags: string[];
  inStock: boolean;
  createdAt: string;
  inquiries: number;
}

interface AppContextValue {
  user: User | null;
  authLoading: boolean;
  productsLoading: boolean;
  setUser: (u: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string; company: string; inn: string; email: string;
    password: string; role: string; country?: string; description?: string;
  }) => Promise<void>;
  logout: () => void;
  products: Product[];
  loadProducts: (params?: object) => Promise<void>;
  addProduct: (p: {
    name: string; category: string; price: string; priceUnit: string;
    minOrder: string; description: string;
    specs: { key: string; value: string }[]; tags: string; inStock: boolean;
  }) => Promise<void>;
  updateProduct: (id: string, p: {
    name: string; category: string; price: string; priceUnit: string;
    minOrder: string; description: string;
    specs: { key: string; value: string }[]; tags: string; inStock: boolean;
  }) => Promise<void>;
  deleteProduct: (id: string) => void;
  sendInquiry: (productId: string, data: {
    buyer_name: string; buyer_company: string; buyer_phone: string;
    buyer_email?: string; quantity?: string; note?: string;
  }) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function mapProduct(raw: Record<string, unknown>): Product {
  return {
    id: String(raw.id),
    sellerId: String(raw.seller_id),
    sellerName: String(raw.seller_name ?? raw.sellerName ?? ""),
    sellerCountry: String(raw.seller_country ?? raw.sellerCountry ?? ""),
    sellerVerified: Boolean(raw.seller_verified ?? raw.sellerVerified ?? false),
    name: String(raw.name),
    category: String(raw.category),
    price: String(raw.price),
    priceUnit: String(raw.price_unit ?? raw.priceUnit ?? "шт"),
    minOrder: String(raw.min_order ?? raw.minOrder ?? "1 шт"),
    description: String(raw.description ?? ""),
    specs: (raw.specs as { key: string; value: string }[]) ?? [],
    tags: (raw.tags as string[]) ?? [],
    inStock: Boolean(raw.in_stock ?? raw.inStock ?? true),
    createdAt: String(raw.created_at ?? raw.createdAt ?? ""),
    inquiries: Number(raw.inquiries_count ?? raw.inquiries ?? 0),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Восстановить сессию при загрузке
  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");
    if (!sessionId) { setAuthLoading(false); return; }
    apiGetMe()
      .then((u) => setUserState(u as User))
      .catch(() => localStorage.removeItem("session_id"))
      .finally(() => setAuthLoading(false));
  }, []);

  // Загрузить продукты при старте
  useEffect(() => {
    loadProducts();
  }, []);

  const login = async (email: string, password: string) => {
    const u = await apiLogin(email, password) as User;
    localStorage.setItem("session_id", u.id);
    setUserState(u);
  };

  const register = async (data: Parameters<AppContextValue["register"]>[0]) => {
    const u = await apiRegister(data) as User;
    localStorage.setItem("session_id", u.id);
    setUserState(u);
  };

  const logout = () => {
    localStorage.removeItem("session_id");
    setUserState(null);
  };

  const setUser = (u: User | null) => {
    if (!u) logout();
    else setUserState(u);
  };

  const loadProducts = async (params?: object) => {
    setProductsLoading(true);
    try {
      const data = await apiGetProducts(params as Parameters<typeof apiGetProducts>[0]);
      setProducts((data as Record<string, unknown>[]).map(mapProduct));
    } finally {
      setProductsLoading(false);
    }
  };

  const addProduct = async (p: Parameters<AppContextValue["addProduct"]>[0]) => {
    const raw = await apiCreateProduct({
      name: p.name, category: p.category, price: p.price,
      price_unit: p.priceUnit, min_order: p.minOrder,
      description: p.description, specs: p.specs,
      tags: p.tags, in_stock: p.inStock,
    });
    const newProduct = mapProduct(raw as Record<string, unknown>);
    if (user) {
      newProduct.sellerName = user.company;
      newProduct.sellerCountry = user.country || "Россия";
    }
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = async (id: string, p: Parameters<AppContextValue["updateProduct"]>[1]) => {
    const raw = await apiUpdateProduct(id, {
      name: p.name, category: p.category, price: p.price,
      price_unit: p.priceUnit, min_order: p.minOrder,
      description: p.description, specs: p.specs,
      tags: p.tags, in_stock: p.inStock,
    });
    const updated = mapProduct(raw as Record<string, unknown>);
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, ...updated } : prod));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  const sendInquiry = async (productId: string, data: Parameters<AppContextValue["sendInquiry"]>[1]) => {
    await apiSendInquiry(productId, data);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, inquiries: p.inquiries + 1 } : p));
  };

  return (
    <AppContext.Provider value={{
      user, authLoading, productsLoading, setUser,
      login, register, logout,
      products, loadProducts,
      addProduct, updateProduct, deleteProduct, sendInquiry,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
