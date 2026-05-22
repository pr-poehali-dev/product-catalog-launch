import { createContext, useContext, useState, ReactNode } from "react";

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
  setUser: (u: User | null) => void;
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "createdAt" | "inquiries" | "sellerId" | "sellerName" | "sellerCountry" | "sellerVerified">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sendInquiry: (productId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEMO_PRODUCTS: Product[] = [
  {
    id: "p1", sellerId: "s1", sellerName: "КМЗ Групп", sellerCountry: "Россия", sellerVerified: true,
    name: "Насос центробежный ЦНС 38-44", category: "Насосное оборудование",
    price: "84 500", priceUnit: "шт", minOrder: "1 шт",
    description: "Центробежный насос для перекачки чистой воды и жидкостей со схожими свойствами. Применяется в системах водоснабжения, теплоснабжения и технологических процессах.",
    specs: [{ key: "Мощность", value: "7.5 кВт" }, { key: "Подача", value: "38 м³/ч" }, { key: "Напор", value: "44 м" }, { key: "Масса", value: "68 кг" }],
    tags: ["насос", "центробежный", "водоснабжение"], inStock: true, createdAt: "2024-11-01", inquiries: 24,
  },
  {
    id: "p2", sellerId: "s2", sellerName: "ПКМП Завод", sellerCountry: "Россия", sellerVerified: true,
    name: "Компрессор поршневой АВО-5/10", category: "Компрессоры",
    price: "156 000", priceUnit: "шт", minOrder: "1 шт",
    description: "Поршневой компрессор для сжатия воздуха и нейтральных газов. Используется в промышленных пневмосетях, на производственных предприятиях.",
    specs: [{ key: "Мощность", value: "15 кВт" }, { key: "Подача", value: "5 м³/мин" }, { key: "Давление", value: "10 атм" }, { key: "Масса", value: "210 кг" }],
    tags: ["компрессор", "поршневой", "пневматика"], inStock: true, createdAt: "2024-10-20", inquiries: 18,
  },
  {
    id: "p3", sellerId: "s3", sellerName: "Dendor Арматура", sellerCountry: "Беларусь", sellerVerified: false,
    name: "Задвижка стальная 30с41нж Ду100", category: "Запорная арматура",
    price: "12 800", priceUnit: "шт", minOrder: "5 шт",
    description: "Стальная задвижка с обрезиненным клином. Предназначена для трубопроводов горячей и холодной воды, нефтепродуктов.",
    specs: [{ key: "Ду", value: "100 мм" }, { key: "Ру", value: "16 атм" }, { key: "Температура", value: "до +200°C" }, { key: "Материал", value: "Сталь" }],
    tags: ["задвижка", "арматура", "трубопровод"], inStock: true, createdAt: "2024-11-05", inquiries: 41,
  },
  {
    id: "p4", sellerId: "s1", sellerName: "КМЗ Групп", sellerCountry: "Россия", sellerVerified: true,
    name: "Насос вихревой ВКС 2/26", category: "Насосное оборудование",
    price: "34 200", priceUnit: "шт", minOrder: "1 шт",
    description: "Вихревой самовсасывающий насос для перекачки чистых маловязких жидкостей. Компактная конструкция, высокий напор.",
    specs: [{ key: "Мощность", value: "1.5 кВт" }, { key: "Подача", value: "2 м³/ч" }, { key: "Напор", value: "26 м" }, { key: "Масса", value: "18 кг" }],
    tags: ["насос", "вихревой", "самовсасывающий"], inStock: false, createdAt: "2024-11-10", inquiries: 9,
  },
  {
    id: "p5", sellerId: "s4", sellerName: "ТехноПоставка", sellerCountry: "Казахстан", sellerVerified: true,
    name: "Электродвигатель АИР 90L4", category: "Электрооборудование",
    price: "18 900", priceUnit: "шт", minOrder: "3 шт",
    description: "Асинхронный электродвигатель общепромышленного применения. Класс защиты IP54. Климатическое исполнение У1.",
    specs: [{ key: "Мощность", value: "2.2 кВт" }, { key: "Обороты", value: "1500 об/мин" }, { key: "Напряжение", value: "380 В" }, { key: "КПД", value: "82%" }],
    tags: ["электродвигатель", "асинхронный", "АИР"], inStock: true, createdAt: "2024-10-15", inquiries: 33,
  },
  {
    id: "p6", sellerId: "s3", sellerName: "Dendor Арматура", sellerCountry: "Беларусь", sellerVerified: false,
    name: "Клапан обратный 19с53нж Ду50", category: "Запорная арматура",
    price: "5 600", priceUnit: "шт", minOrder: "10 шт",
    description: "Обратный подъёмный клапан для предотвращения обратного тока рабочей среды. Фланцевое присоединение.",
    specs: [{ key: "Ду", value: "50 мм" }, { key: "Ру", value: "16 атм" }, { key: "Температура", value: "до +425°C" }, { key: "Материал", value: "Сталь 20" }],
    tags: ["клапан", "обратный", "фланцевый"], inStock: true, createdAt: "2024-11-08", inquiries: 15,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);

  const addProduct = (p: Omit<Product, "id" | "createdAt" | "inquiries" | "sellerId" | "sellerName" | "sellerCountry" | "sellerVerified">) => {
    if (!user) return;
    const newProduct: Product = {
      ...p,
      id: `p${Date.now()}`,
      sellerId: user.id,
      sellerName: user.company,
      sellerCountry: user.country || "Россия",
      sellerVerified: false,
      createdAt: new Date().toISOString().split("T")[0],
      inquiries: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, p: Partial<Product>) => {
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, ...p } : prod));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  const sendInquiry = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, inquiries: p.inquiries + 1 } : p));
  };

  return (
    <AppContext.Provider value={{ user, setUser, products, addProduct, updateProduct, deleteProduct, sendInquiry }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
