import { useState } from "react";
import Icon from "@/components/ui/icon";

const categories = ["Все", "Насосное оборудование", "Компрессоры", "Запорная арматура", "КИПиА", "Электрооборудование"];

const products = [
  { id: 1, name: "Насос центробежный ЦНС 38-44", sku: "ЦНС-38-44", category: "Насосное оборудование", price: 84500, oldPrice: 92000, unit: "шт", inStock: true, brand: "КМЗ", power: "7.5 кВт", flow: "38 м³/ч" },
  { id: 2, name: "Компрессор поршневой АВО-5/10", sku: "АВО-5-10", category: "Компрессоры", price: 156000, oldPrice: null, unit: "шт", inStock: true, brand: "ПКМП", power: "15 кВт", flow: "5 м³/мин" },
  { id: 3, name: "Задвижка стальная 30с41нж Ду100", sku: "30С41НЖ-100", category: "Запорная арматура", price: 12800, oldPrice: null, unit: "шт", inStock: true, brand: "Dendor", power: "—", flow: "Ду 100" },
  { id: 4, name: "Манометр МТ-100 0–10 МПа", sku: "МТ-100-10", category: "КИПиА", price: 2350, oldPrice: 2800, unit: "шт", inStock: true, brand: "WIKA", power: "—", flow: "—" },
  { id: 5, name: "Электродвигатель АИР 90L4", sku: "АИР-90L4", category: "Электрооборудование", price: 18900, oldPrice: null, unit: "шт", inStock: false, brand: "КЗЭМ", power: "2.2 кВт", flow: "1500 об/мин" },
  { id: 6, name: "Насос вихревой ВКС 2/26", sku: "ВКС-2-26", category: "Насосное оборудование", price: 34200, oldPrice: 38000, unit: "шт", inStock: true, brand: "КМЗ", power: "1.5 кВт", flow: "2 м³/ч" },
  { id: 7, name: "Клапан обратный 19с53нж Ду50", sku: "19С53НЖ-50", category: "Запорная арматура", price: 5600, oldPrice: null, unit: "шт", inStock: true, brand: "Dendor", power: "—", flow: "Ду 50" },
  { id: 8, name: "Термометр биметаллический ТБ 100/50", sku: "ТБ-100-50", category: "КИПиА", price: 1890, oldPrice: null, unit: "шт", inStock: true, brand: "JUMO", power: "—", flow: "—" },
  { id: 9, name: "Компрессор винтовой ВК-11", sku: "ВК-11", category: "Компрессоры", price: 284000, oldPrice: null, unit: "шт", inStock: false, brand: "ПКМП", power: "11 кВт", flow: "1.3 м³/мин" },
];

const priceRanges = [
  { label: "До 5 000 ₽", min: 0, max: 5000 },
  { label: "5 000 — 30 000 ₽", min: 5000, max: 30000 },
  { label: "30 000 — 100 000 ₽", min: 30000, max: 100000 },
  { label: "Свыше 100 000 ₽", min: 100000, max: Infinity },
];

const brands = ["КМЗ", "ПКМП", "Dendor", "WIKA", "КЗЭМ", "JUMO"];

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [activePriceRange, setActivePriceRange] = useState<number | null>(null);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const toggleBrand = (brand: string) => {
    setActiveBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  let filtered = products.filter(p => {
    if (activeCategory !== "Все" && p.category !== activeCategory) return false;
    if (activePriceRange !== null) {
      const range = priceRanges[activePriceRange];
      if (p.price < range.min || p.price > range.max) return false;
    }
    if (activeBrands.length > 0 && !activeBrands.includes(p.brand)) return false;
    if (inStockOnly && !p.inStock) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.sku.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const resetFilters = () => {
    setActiveCategory("Все");
    setActivePriceRange(null);
    setActiveBrands([]);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const hasFilters = activeCategory !== "Все" || activePriceRange !== null || activeBrands.length > 0 || inStockOnly || searchQuery;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="section-label mb-1">Ассортимент</div>
            <h1 className="text-2xl font-bold text-[var(--navy)]">Каталог продукции</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию или артикулу..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border border-gray-200 pl-9 pr-4 py-2 text-sm w-72 focus:outline-none focus:border-[var(--navy)] transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)] bg-white"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-60 flex-shrink-0">
          <div className="bg-white border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--navy)] text-sm flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={15} />
                Фильтры
              </h3>
              {hasFilters && (
                <button onClick={resetFilters} className="text-xs text-[var(--gold)] hover:underline">
                  Сбросить
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Категория</div>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2 transition-all duration-150 ${
                      activeCategory === cat
                        ? "bg-[var(--navy)] text-white font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-5 border-t border-gray-100 pt-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Цена</div>
              <div className="space-y-1">
                {priceRanges.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => setActivePriceRange(activePriceRange === i ? null : i)}
                    className={`w-full text-left text-xs py-1.5 px-2 flex items-center gap-2 transition-all duration-150 ${
                      activePriceRange === i
                        ? "bg-amber-50 text-[var(--navy)] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${activePriceRange === i ? "border-[var(--gold)] bg-[var(--gold)]" : "border-gray-300"}`}>
                      {activePriceRange === i && <Icon name="Check" size={8} className="text-white" />}
                    </div>
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="mb-5 border-t border-gray-100 pt-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Производитель</div>
              <div className="space-y-1">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`w-full text-left text-xs py-1.5 px-2 flex items-center gap-2 transition-all duration-150 ${
                      activeBrands.includes(brand)
                        ? "bg-amber-50 text-[var(--navy)] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${activeBrands.includes(brand) ? "border-[var(--gold)] bg-[var(--gold)]" : "border-gray-300"}`}>
                      {activeBrands.includes(brand) && <Icon name="Check" size={8} className="text-white" />}
                    </div>
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock */}
            <div className="border-t border-gray-100 pt-5">
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className="w-full text-left text-xs py-1.5 px-2 flex items-center gap-2"
              >
                <div className={`w-3 h-3 border flex-shrink-0 flex items-center justify-center ${inStockOnly ? "border-[var(--gold)] bg-[var(--gold)]" : "border-gray-300"}`}>
                  {inStockOnly && <Icon name="Check" size={8} className="text-white" />}
                </div>
                <span className={inStockOnly ? "text-[var(--navy)] font-medium" : "text-gray-600"}>Только в наличии</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Найдено: <span className="font-semibold text-[var(--navy)]">{filtered.length}</span> позиций
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 p-16 text-center">
              <Icon name="PackageSearch" size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">По вашему запросу ничего не найдено</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-[var(--gold)] hover:underline">Сбросить фильтры</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(product => (
                <div key={product.id} className="card-product bg-white p-5 flex flex-col" onClick={() => setSelectedProduct(product)}>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 ${product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {product.inStock ? "В наличии" : "Под заказ"}
                    </span>
                    <span className="text-xs text-gray-400 font-mono-num">{product.sku}</span>
                  </div>
                  <h3 className="font-semibold text-[var(--navy)] text-sm mb-2 leading-snug flex-1">{product.name}</h3>
                  <div className="text-xs text-gray-400 mb-1">Бренд: <span className="text-gray-600">{product.brand}</span></div>
                  {product.power !== "—" && <div className="text-xs text-gray-400 mb-3">Мощность: <span className="text-gray-600">{product.power}</span></div>}
                  <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
                    <div>
                      <div className="text-lg font-bold text-[var(--navy)] font-mono-num">
                        {product.price.toLocaleString("ru-RU")} ₽
                      </div>
                      {product.oldPrice && (
                        <div className="text-xs text-gray-400 line-through font-mono-num">{product.oldPrice.toLocaleString("ru-RU")} ₽</div>
                      )}
                      <div className="text-xs text-gray-400">за {product.unit}</div>
                    </div>
                    <button className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5">
                      <Icon name="ShoppingCart" size={13} />
                      В заявку
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white max-w-lg w-full p-8 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs text-gray-400 font-mono-num mb-1">{selectedProduct.sku}</div>
                <h2 className="text-lg font-bold text-[var(--navy)]">{selectedProduct.name}</h2>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-[var(--navy)] ml-4">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-2 mb-6">
              {[
                ["Категория", selectedProduct.category],
                ["Производитель", selectedProduct.brand],
                ["Мощность / Параметр", selectedProduct.power],
                ["Расход / Характеристика", selectedProduct.flow],
                ["Наличие", selectedProduct.inStock ? "В наличии" : "Под заказ"],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                  <span className="text-gray-400">{key}</span>
                  <span className="font-medium text-[var(--navy)]">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-2xl font-bold text-[var(--navy)] font-mono-num">{selectedProduct.price.toLocaleString("ru-RU")} ₽</div>
                <div className="text-xs text-gray-400">за {selectedProduct.unit}, без НДС</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1">Добавить в заявку</button>
              <button className="btn-outline px-4">Запросить КП</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
