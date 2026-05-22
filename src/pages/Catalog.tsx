import { useState } from "react";
import { useApp, Product } from "@/context/AppContext";
import Icon from "@/components/ui/icon";

const CATEGORIES = ["Все", "Насосное оборудование", "Компрессоры", "Запорная арматура", "КИПиА", "Электрооборудование", "Инструмент и оснастка"];

const priceRanges = [
  { label: "До 10 000 ₽", min: 0, max: 10000 },
  { label: "10 000 — 50 000 ₽", min: 10000, max: 50000 },
  { label: "50 000 — 200 000 ₽", min: 50000, max: 200000 },
  { label: "Свыше 200 000 ₽", min: 200000, max: Infinity },
];

interface InquiryModalProps {
  product: Product;
  onClose: () => void;
  onSend: () => void;
}

function InquiryModal({ product, onClose, onSend }: InquiryModalProps) {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", qty: "1", note: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white max-w-lg w-full shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="bg-[var(--navy)] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="section-label text-[10px]">Запрос цены</div>
            <h2 className="font-semibold text-sm mt-0.5 truncate max-w-sm">{product.name}</h2>
          </div>
          <button onClick={onClose}><Icon name="X" size={18} className="text-gray-300 hover:text-white" /></button>
        </div>
        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <Icon name="CheckCircle2" size={40} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-[var(--navy)] mb-2">Запрос отправлен продавцу</h3>
              <p className="text-sm text-gray-400">Поставщик <span className="font-medium text-[var(--navy)]">{product.sellerName}</span> получит ваш запрос и ответит в течение 24 часов</p>
              <button onClick={onClose} className="btn-primary mt-6">Закрыть</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="bg-[var(--surface)] p-3 text-xs text-gray-500 mb-4 flex items-center gap-2">
                <Icon name="Store" size={13} className="text-[var(--gold)]" />
                Запрос уйдёт продавцу: <span className="font-semibold text-[var(--navy)]">{product.sellerName}</span>
                <span className="text-gray-400">· {product.sellerCountry}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Имя *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="Иван Петров" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Компания *</label>
                  <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="ООО «Заказчик»" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Телефон *</label>
                  <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="+7 (___) ___-__-__" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="mail@co.ru" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Количество</label>
                <input value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)] font-mono-num"
                  placeholder={`Мин. заказ: ${product.minOrder}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Комментарий</label>
                <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                  rows={2} className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)] resize-none"
                  placeholder="Уточните требования, условия поставки..." />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                <Icon name="Send" size={14} /> Отправить запрос продавцу
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose, onInquiry }: { product: Product; onClose: () => void; onInquiry: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="bg-[var(--navy)] text-white px-6 py-5 flex items-start justify-between">
          <div>
            <div className="section-label text-[10px] mb-1">{product.category}</div>
            <h2 className="font-bold text-lg leading-snug">{product.name}</h2>
          </div>
          <button onClick={onClose} className="ml-4 mt-0.5"><Icon name="X" size={20} className="text-gray-300 hover:text-white" /></button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5 p-3 bg-[var(--surface)] border border-gray-100">
            <div className="w-9 h-9 bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
              <Icon name="Store" size={16} className="text-[var(--gold)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--navy)] text-sm">{product.sellerName}</span>
                {product.sellerVerified && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 flex items-center gap-0.5"><Icon name="BadgeCheck" size={10} />Верифицирован</span>}
              </div>
              <div className="text-xs text-gray-400">{product.sellerCountry} · {product.inquiries} запросов получено</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.description}</p>

          {product.specs.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Характеристики</h3>
              <div className="border border-gray-100 overflow-hidden">
                {product.specs.map((spec, i) => (
                  <div key={i} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-[var(--surface)]" : "bg-white"}`}>
                    <span className="text-gray-500">{spec.key}</span>
                    <span className="font-medium text-[var(--navy)]">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500">{tag}</span>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-5 flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-[var(--navy)] font-mono-num">{product.price} ₽ / {product.priceUnit}</div>
              <div className="text-xs text-gray-400 mt-0.5">Мин. заказ: {product.minOrder}</div>
              <div className={`text-xs mt-1 font-semibold ${product.inStock ? "text-green-600" : "text-amber-600"}`}>
                {product.inStock ? "В наличии" : "Под заказ"}
              </div>
            </div>
            <button onClick={onInquiry} className="btn-primary flex items-center gap-2 text-sm">
              <Icon name="MessageSquare" size={15} /> Запросить цену
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  const { products, sendInquiry } = useApp();
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  const parsePrice = (p: string) => parseInt(p.replace(/\s/g, ""), 10) || 0;

  let filtered = products.filter(p => {
    if (activeCategory !== "Все" && p.category !== activeCategory) return false;
    if (activePriceRange !== null) {
      const r = priceRanges[activePriceRange];
      const price = parsePrice(p.price);
      if (price < r.min || price > r.max) return false;
    }
    if (inStockOnly && !p.inStock) return false;
    if (verifiedOnly && !p.sellerVerified) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sellerName.toLowerCase().includes(q) && !p.tags.some(t => t.includes(q))) return false;
    }
    return true;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  if (sortBy === "popular") filtered = [...filtered].sort((a, b) => b.inquiries - a.inquiries);

  const hasFilters = activeCategory !== "Все" || activePriceRange !== null || inStockOnly || verifiedOnly || searchQuery;

  const resetFilters = () => {
    setActiveCategory("Все");
    setActivePriceRange(null);
    setInStockOnly(false);
    setVerifiedOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="section-label mb-1">Маркетплейс</div>
            <h1 className="text-2xl font-bold text-[var(--navy)]">Каталог товаров</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Товар, поставщик, тег..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border border-gray-200 pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-[var(--navy)] transition-colors" />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)] bg-white">
              <option value="default">По умолчанию</option>
              <option value="popular">Популярные</option>
              <option value="price-asc">Цена: дешевле</option>
              <option value="price-desc">Цена: дороже</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--navy)] text-sm flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={14} /> Фильтры
              </h3>
              {hasFilters && <button onClick={resetFilters} className="text-xs text-[var(--gold)] hover:underline">Сбросить</button>}
            </div>

            <div className="mb-5">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Категория</div>
              <div className="space-y-0.5">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2 transition-all ${activeCategory === cat ? "bg-[var(--navy)] text-white font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 border-t border-gray-100 pt-4">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Цена</div>
              {priceRanges.map((range, i) => (
                <button key={i} onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
                  className={`w-full text-left text-xs py-1.5 px-2 flex items-center gap-2 transition-all ${activePriceRange === i ? "bg-amber-50 text-[var(--navy)] font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                  <div className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${activePriceRange === i ? "border-[var(--gold)] bg-[var(--gold)]" : "border-gray-300"}`}>
                    {activePriceRange === i && <Icon name="Check" size={8} className="text-white" />}
                  </div>
                  {range.label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-1">
              <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Продавец</div>
              {([
                { label: "Только в наличии", value: inStockOnly, set: setInStockOnly },
                { label: "Верифицированные", value: verifiedOnly, set: setVerifiedOnly },
              ] as { label: string; value: boolean; set: (v: boolean) => void }[]).map(({ label, value, set }) => (
                <button key={label} onClick={() => set(!value)}
                  className="w-full text-left text-xs py-1.5 px-2 flex items-center gap-2">
                  <div className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${value ? "border-[var(--gold)] bg-[var(--gold)]" : "border-gray-300"}`}>
                    {value && <Icon name="Check" size={8} className="text-white" />}
                  </div>
                  <span className={value ? "text-[var(--navy)] font-medium" : "text-gray-600"}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-4">
            Найдено: <span className="font-semibold text-[var(--navy)]">{filtered.length}</span> товаров
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 p-16 text-center">
              <Icon name="PackageSearch" size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">По вашему запросу ничего не найдено</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-[var(--gold)] hover:underline">Сбросить фильтры</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="card-product bg-white flex flex-col">
                  <div className="p-4 flex-1 cursor-pointer" onClick={() => setDetailProduct(product)}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 ${product.inStock ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {product.inStock ? "В наличии" : "Под заказ"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono-num">{product.inquiries} запр.</span>
                    </div>
                    <h3 className="font-semibold text-[var(--navy)] text-sm mb-2 leading-snug line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">{product.description}</p>
                    {product.specs.slice(0, 2).map(spec => (
                      <div key={spec.key} className="text-xs text-gray-400 flex gap-1">
                        <span>{spec.key}:</span>
                        <span className="text-gray-600 font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2 bg-[var(--surface)] border-t border-gray-100 flex items-center gap-2">
                    <div className="w-5 h-5 bg-[var(--navy)] flex items-center justify-center flex-shrink-0">
                      <Icon name="Store" size={11} className="text-[var(--gold)]" />
                    </div>
                    <span className="text-xs text-gray-500 truncate">{product.sellerName}</span>
                    {product.sellerVerified && <Icon name="BadgeCheck" size={12} className="text-green-500 flex-shrink-0" />}
                    <span className="text-[10px] text-gray-400 ml-auto">{product.sellerCountry}</span>
                  </div>

                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[var(--navy)] text-base font-mono-num">{product.price} ₽</div>
                      <div className="text-[10px] text-gray-400">за {product.priceUnit} · от {product.minOrder}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setInquiryProduct(product); }}
                      className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5">
                      <Icon name="MessageSquare" size={12} /> Запросить цену
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {detailProduct && !inquiryProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onInquiry={() => { setInquiryProduct(detailProduct); setDetailProduct(null); }}
        />
      )}

      {inquiryProduct && (
        <InquiryModal
          product={inquiryProduct}
          onClose={() => setInquiryProduct(null)}
          onSend={() => sendInquiry(inquiryProduct.id)}
        />
      )}
    </div>
  );
}
