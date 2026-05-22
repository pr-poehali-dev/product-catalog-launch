import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О компании" },
  { id: "support", label: "Поддержка" },
  { id: "contacts", label: "Контакты" },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      {/* Top bar */}
      <div className="bg-[var(--navy)] text-gray-400 text-xs py-2 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span>Пн–Пт: 9:00–18:00 МСК &nbsp;·&nbsp; +7 (495) 123-45-67</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Документы</span>
            <span className="hover:text-white cursor-pointer transition-colors">Партнёрам</span>
            <span className="hover:text-white cursor-pointer transition-colors">RU</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[var(--navy)] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-[var(--gold)] flex items-center justify-center">
              <span className="text-[var(--navy)] font-bold text-sm font-mono-num">ПТ</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-semibold text-base tracking-tight">ПромТех</div>
              <div className="text-gray-400 text-[10px] tracking-[0.15em] uppercase">Промышленное оборудование</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={currentPage === item.id ? "nav-link-active" : "nav-link"}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("cabinet")}
              className={`hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                currentPage === "cabinet"
                  ? "bg-[var(--gold)] text-[var(--navy)]"
                  : "border border-white/30 text-white hover:border-[var(--gold)] hover:text-[var(--gold)]"
              }`}
            >
              <Icon name="User" size={15} />
              Личный кабинет
            </button>
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[var(--navy-light)] border-t border-white/10 px-6 py-4 space-y-3 animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                className="block w-full text-left text-gray-200 py-2 text-sm border-b border-white/10"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate("cabinet"); setMobileOpen(false); }}
              className="block w-full text-left text-[var(--gold)] py-2 text-sm font-medium"
            >
              Личный кабинет
            </button>
          </div>
        )}
      </header>

      {/* Breadcrumb */}
      {currentPage !== "home" && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-2 text-xs text-gray-400">
            <button onClick={() => onNavigate("home")} className="hover:text-[var(--navy)] transition-colors">Главная</button>
            <Icon name="ChevronRight" size={12} />
            <span className="text-[var(--navy)] font-medium">
              {navItems.find(n => n.id === currentPage)?.label || "Личный кабинет"}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[var(--navy)] text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[var(--gold)] flex items-center justify-center">
                  <span className="text-[var(--navy)] font-bold text-xs">ПТ</span>
                </div>
                <span className="text-white font-semibold">ПромТех</span>
              </div>
              <p className="text-sm leading-relaxed">Поставщик промышленного оборудования с 2003 года. Работаем с юридическими лицами.</p>
            </div>
            {[
              { title: "Каталог", links: ["Насосное оборудование", "Компрессоры", "Запорная арматура", "КИПиА"] },
              { title: "Компания", links: ["О компании", "Сертификаты", "Партнёры", "Вакансии"] },
              { title: "Поддержка", links: ["База знаний", "Техподдержка", "Гарантия", "Контакты"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><span className="text-sm hover:text-white cursor-pointer transition-colors">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <span>© 2024 ПромТех. Все права защищены.</span>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Политика конфиденциальности</span>
              <span className="hover:text-white cursor-pointer transition-colors">Оферта</span>
              <span className="hover:text-white cursor-pointer transition-colors">Реквизиты</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
