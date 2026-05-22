import { useState } from "react";
import { useApp, Product } from "@/context/AppContext";
import Icon from "@/components/ui/icon";


const CATEGORIES = ["Насосное оборудование", "Компрессоры", "Запорная арматура", "КИПиА", "Электрооборудование", "Инструмент и оснастка"];

type Tab = "products" | "add" | "inquiries" | "profile";

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  priceUnit: string;
  minOrder: string;
  description: string;
  tags: string;
  inStock: boolean;
  specs: { key: string; value: string }[];
}

const emptyForm: ProductFormData = {
  name: "", category: CATEGORIES[0], price: "", priceUnit: "шт",
  minOrder: "1 шт", description: "", tags: "", inStock: true,
  specs: [{ key: "", value: "" }, { key: "", value: "" }],
};

export default function SellerCabinet({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { user, logout, products, addProduct, updateProduct, deleteProduct, loadProducts } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const myProducts = products.filter(p => p.sellerId === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      if (editingId) {
        await updateProduct(editingId, { ...form });
      } else {
        await addProduct({ ...form });
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setForm(emptyForm);
        setEditingId(null);
        setActiveTab("products");
        loadProducts();
      }, 1200);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product: Product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      priceUnit: product.priceUnit,
      minOrder: product.minOrder,
      description: product.description,
      tags: product.tags.join(", "),
      inStock: product.inStock,
      specs: product.specs.length > 0 ? [...product.specs, { key: "", value: "" }] : [{ key: "", value: "" }, { key: "", value: "" }],
    });
    setEditingId(product.id);
    setActiveTab("add");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const addSpec = () => setForm(prev => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    setForm(prev => ({ ...prev, specs: prev.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  };

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Icon name="Lock" size={40} className="text-gray-300 mx-auto mb-4" />
          <h2 className="font-semibold text-[var(--navy)] mb-2">Доступ только для продавцов</h2>
          <button onClick={() => onNavigate("auth")} className="btn-primary mt-4">Войти как продавец</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-[var(--navy)] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="section-label">Кабинет поставщика</div>
              {user.verified && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 flex items-center gap-1"><Icon name="BadgeCheck" size={11} /> Верифицирован</span>}
            </div>
            <h1 className="text-2xl font-bold">{user.company}</h1>
            <div className="text-gray-400 text-sm mt-0.5">{user.country} · {user.email}</div>
          </div>
          <button onClick={() => { logout(); onNavigate("home"); }}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <Icon name="LogOut" size={15} /> Выйти
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Товаров размещено", value: myProducts.length, icon: "Package" },
              { label: "Запросов получено", value: myProducts.reduce((a, p) => a + p.inquiries, 0), icon: "MessageSquare" },
              { label: "В наличии", value: myProducts.filter(p => p.inStock).length, icon: "CheckCircle2" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[var(--surface)] flex items-center justify-center">
                  <Icon name={s.icon} size={16} className="text-[var(--navy)]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--navy)] font-mono-num">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-0 border-b border-gray-200 mb-6">
          {([
            { id: "products", label: "Мои товары", icon: "LayoutGrid" },
            { id: "add", label: editingId ? "Редактировать товар" : "Добавить товар", icon: editingId ? "Pencil" : "Plus" },
            { id: "inquiries", label: "Запросы", icon: "MessageSquare" },
            { id: "profile", label: "Профиль", icon: "Building2" },
          ] as { id: Tab; label: string; icon: string }[]).map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id !== "add") { setEditingId(null); setForm(emptyForm); } }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id ? "border-[var(--gold)] text-[var(--navy)]" : "border-transparent text-gray-400 hover:text-[var(--navy)]"
              }`}>
              <Icon name={tab.icon} size={14} />
              {tab.label}
              {tab.id === "inquiries" && myProducts.reduce((a, p) => a + p.inquiries, 0) > 0 && (
                <span className="bg-[var(--gold)] text-[var(--navy)] text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  {myProducts.reduce((a, p) => a + p.inquiries, 0)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* MY PRODUCTS */}
        {activeTab === "products" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--navy)]">Размещённые товары</h2>
              <button onClick={() => setActiveTab("add")} className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                <Icon name="Plus" size={13} /> Добавить товар
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="bg-white border border-gray-100 p-16 text-center">
                <Icon name="PackagePlus" size={40} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-semibold text-[var(--navy)] mb-2">Нет размещённых товаров</h3>
                <p className="text-sm text-gray-400 mb-4">Добавьте первый товар, чтобы покупатели могли найти вас в каталоге</p>
                <button onClick={() => setActiveTab("add")} className="btn-primary">Добавить товар</button>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--surface)] border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Товар</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Категория</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Цена</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Статус</th>
                      <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Запросы</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProducts.map(product => (
                      <tr key={product.id} className="border-b border-gray-50 table-row-hover">
                        <td className="px-5 py-3.5 text-sm font-medium text-[var(--navy)] max-w-[240px]">
                          <div className="truncate">{product.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{product.createdAt}</div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500">{product.category}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-[var(--navy)] font-mono-num whitespace-nowrap">
                          {product.price} ₽ / {product.priceUnit}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 ${product.inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                            {product.inStock ? "В наличии" : "Под заказ"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center text-sm font-mono-num text-gray-600">{product.inquiries}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => startEdit(product)} className="text-xs text-gray-400 hover:text-[var(--navy)] flex items-center gap-1">
                              <Icon name="Pencil" size={13} /> Изменить
                            </button>
                            <button onClick={() => setDeleteConfirm(product.id)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                              <Icon name="Trash2" size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD / EDIT PRODUCT */}
        {activeTab === "add" && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="font-semibold text-[var(--navy)] mb-6">
              {editingId ? "Редактирование товара" : "Новый товар"}
            </h2>

            {saved ? (
              <div className="bg-green-50 border border-green-200 p-8 text-center">
                <Icon name="CheckCircle2" size={36} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-[var(--navy)]">{editingId ? "Изменения сохранены" : "Товар опубликован"}</h3>
                <p className="text-sm text-gray-400 mt-1">Переходим к списку товаров...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Название товара *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="Насос центробежный ЦНС 38-44" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Категория *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] bg-white">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Статус</label>
                    <select value={form.inStock ? "true" : "false"} onChange={e => setForm({ ...form, inStock: e.target.value === "true" })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] bg-white">
                      <option value="true">В наличии</option>
                      <option value="false">Под заказ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Цена *</label>
                    <input required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] font-mono-num"
                      placeholder="84 500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Единица</label>
                    <select value={form.priceUnit} onChange={e => setForm({ ...form, priceUnit: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] bg-white">
                      {["шт", "компл", "кг", "м", "м²", "м³", "л"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Минимальный заказ</label>
                  <input value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="1 шт" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Описание</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={4} className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] resize-none"
                    placeholder="Подробное описание товара, область применения, особенности..." />
                </div>

                {/* Specs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Характеристики</label>
                    <button type="button" onClick={addSpec} className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1">
                      <Icon name="Plus" size={12} /> Добавить
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.specs.map((spec, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2">
                        <input value={spec.key} onChange={e => updateSpec(i, "key", e.target.value)}
                          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                          placeholder="Параметр (напр. Мощность)" />
                        <input value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)}
                          className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[var(--navy)]"
                          placeholder="Значение (напр. 7.5 кВт)" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Теги (через запятую)</label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="насос, центробежный, водоснабжение" />
                </div>

                {saveError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 flex items-center gap-2">
                    <Icon name="AlertCircle" size={14} /> {saveError}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                    {saving ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name={editingId ? "Save" : "Upload"} size={15} />}
                    {saving ? "Сохраняем..." : (editingId ? "Сохранить изменения" : "Опубликовать товар")}
                  </button>
                  <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); setActiveTab("products"); }}
                    className="btn-outline">
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-[var(--navy)] mb-4">Запросы от покупателей</h2>
            {myProducts.filter(p => p.inquiries > 0).length === 0 ? (
              <div className="bg-white border border-gray-100 p-12 text-center">
                <Icon name="Inbox" size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Запросов пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myProducts.filter(p => p.inquiries > 0).map(p => (
                  <div key={p.id} className="bg-white border border-gray-100 p-5 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[var(--navy)] text-sm">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{p.category}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-[var(--gold)] font-mono-num">{p.inquiries}</div>
                        <div className="text-xs text-gray-400">запросов</div>
                      </div>
                      <button className="btn-primary text-xs px-4 py-2">Ответить</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="font-semibold text-[var(--navy)] mb-5">Профиль компании</h2>
            <div className="bg-white border border-gray-100 p-6 space-y-3">
              {[
                ["Компания", user.company],
                ["ИНН", user.inn],
                ["Email", user.email],
                ["Страна", user.country || "—"],
                ["Роль", "Продавец / Поставщик"],
                ["Статус", user.verified ? "Верифицирован" : "На проверке"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{k}</span>
                  <span className="text-sm font-medium text-[var(--navy)]">{v}</span>
                </div>
              ))}
              {user.description && (
                <div className="pt-2">
                  <div className="text-xs text-gray-400 mb-1">О компании</div>
                  <p className="text-sm text-gray-600">{user.description}</p>
                </div>
              )}
              <button className="btn-outline text-xs flex items-center gap-2 mt-2">
                <Icon name="Pencil" size={13} /> Редактировать профиль
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white p-8 max-w-sm w-full shadow-xl">
            <Icon name="AlertTriangle" size={28} className="text-red-500 mb-4" />
            <h3 className="font-semibold text-[var(--navy)] mb-2">Удалить товар?</h3>
            <p className="text-sm text-gray-400 mb-6">Это действие нельзя отменить. Товар будет удалён из каталога.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors">
                Удалить
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}