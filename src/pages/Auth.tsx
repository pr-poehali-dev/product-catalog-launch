import { useState } from "react";
import { useApp, UserRole } from "@/context/AppContext";
import Icon from "@/components/ui/icon";

interface AuthProps {
  onNavigate: (page: string) => void;
  defaultMode?: "login" | "register";
}

export default function Auth({ onNavigate, defaultMode = "login" }: AuthProps) {
  const { setUser } = useApp();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", company: "", inn: "", email: "", country: "Россия", description: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `u${Date.now()}`,
      name: "Иван Петров",
      company: form.company || "ООО «Демо Компания»",
      inn: form.inn || "7701234567",
      email: form.email || "demo@company.ru",
      role: "buyer",
      country: "Россия",
      verified: true,
    });
    onNavigate("home");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `u${Date.now()}`,
      name: form.name,
      company: form.company,
      inn: form.inn,
      email: form.email,
      role: selectedRole,
      country: form.country,
      description: form.description,
      verified: false,
    });
    onNavigate(selectedRole === "seller" ? "seller-cabinet" : "home");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--surface)] py-16 animate-fade-in">
      <div className="w-full max-w-xl">

        {/* Tabs */}
        <div className="flex mb-0 border border-gray-200 bg-white">
          <button
            onClick={() => { setMode("login"); setStep(1); setSelectedRole(null); }}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${mode === "login" ? "bg-[var(--navy)] text-white" : "text-gray-400 hover:text-[var(--navy)]"}`}
          >
            Войти
          </button>
          <button
            onClick={() => { setMode("register"); setStep(1); setSelectedRole(null); }}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${mode === "register" ? "bg-[var(--navy)] text-white" : "text-gray-400 hover:text-[var(--navy)]"}`}
          >
            Зарегистрироваться
          </button>
        </div>

        <div className="bg-white border border-t-0 border-gray-200 p-8">

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[var(--navy)]">Вход в систему</h2>
                <p className="text-xs text-gray-400 mt-1">Для покупателей и продавцов</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                  placeholder="mail@company.ru" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Пароль</label>
                <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                  placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-3 h-3" /> Запомнить меня
                </label>
                <span className="text-xs text-[var(--gold)] hover:underline cursor-pointer">Забыли пароль?</span>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                <Icon name="LogIn" size={15} /> Войти
              </button>
              <p className="text-xs text-center text-gray-400 pt-2">
                Нет аккаунта?{" "}
                <span className="text-[var(--gold)] cursor-pointer hover:underline" onClick={() => setMode("register")}>
                  Зарегистрироваться
                </span>
              </p>
            </form>
          )}

          {/* REGISTER — STEP 1: роль */}
          {mode === "register" && step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[var(--navy)]">Выберите роль</h2>
                <p className="text-xs text-gray-400 mt-1">Шаг 1 из 2</p>
              </div>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedRole("buyer")}
                  className={`w-full border p-5 text-left transition-all duration-150 flex items-start gap-4 ${
                    selectedRole === "buyer" ? "border-[var(--navy)] bg-blue-50/40" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${selectedRole === "buyer" ? "bg-[var(--navy)]" : "bg-[var(--surface)]"}`}>
                    <Icon name="ShoppingBag" size={18} className={selectedRole === "buyer" ? "text-[var(--gold)]" : "text-gray-400"} />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--navy)] text-sm mb-1">Покупатель</div>
                    <div className="text-xs text-gray-400 leading-relaxed">Ищу поставщиков, запрашиваю цены, оформляю заказы на промышленное оборудование</div>
                  </div>
                  {selectedRole === "buyer" && (
                    <Icon name="CheckCircle2" size={18} className="text-[var(--navy)] ml-auto flex-shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedRole("seller")}
                  className={`w-full border p-5 text-left transition-all duration-150 flex items-start gap-4 ${
                    selectedRole === "seller" ? "border-[var(--gold)] bg-amber-50/40" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${selectedRole === "seller" ? "bg-[var(--gold)]" : "bg-[var(--surface)]"}`}>
                    <Icon name="Store" size={18} className={selectedRole === "seller" ? "text-[var(--navy)]" : "text-gray-400"} />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--navy)] text-sm mb-1">Продавец / Поставщик</div>
                    <div className="text-xs text-gray-400 leading-relaxed">Размещаю товары, получаю запросы от покупателей, управляю каталогом</div>
                  </div>
                  {selectedRole === "seller" && (
                    <Icon name="CheckCircle2" size={18} className="text-[var(--gold)] ml-auto flex-shrink-0" />
                  )}
                </button>
              </div>

              <button
                disabled={!selectedRole}
                onClick={() => setStep(2)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all ${
                  selectedRole ? "btn-primary" : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                Продолжить <Icon name="ArrowRight" size={15} />
              </button>
            </div>
          )}

          {/* REGISTER — STEP 2: данные */}
          {mode === "register" && step === 2 && (
            <form onSubmit={handleRegister} className="animate-fade-in space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-[var(--navy)]">
                  <Icon name="ArrowLeft" size={16} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-[var(--navy)]">
                    {selectedRole === "seller" ? "Данные поставщика" : "Данные компании"}
                  </h2>
                  <p className="text-xs text-gray-400">Шаг 2 из 2</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Имя *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="Иван Петров" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Компания *</label>
                  <input required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder={selectedRole === "seller" ? "ООО «Завод»" : "ООО «Покупатель»"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">ИНН *</label>
                  <input required value={form.inn} onChange={e => setForm({ ...form, inn: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] font-mono-num"
                    placeholder="7701234567" maxLength={12} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Страна *</label>
                  <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] bg-white">
                    {["Россия", "Беларусь", "Казахстан", "Китай", "Германия", "Другая"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                  placeholder="mail@company.ru" />
              </div>

              {selectedRole === "seller" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">О компании</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] resize-none"
                    placeholder="Кратко опишите деятельность компании, основные товары..." />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Пароль *</label>
                <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                  placeholder="Минимум 8 символов" minLength={6} />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                <Icon name="UserPlus" size={15} />
                {selectedRole === "seller" ? "Зарегистрироваться как поставщик" : "Создать аккаунт"}
              </button>
              <p className="text-xs text-center text-gray-400">Нажимая кнопку, вы соглашаетесь с условиями оферты</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
