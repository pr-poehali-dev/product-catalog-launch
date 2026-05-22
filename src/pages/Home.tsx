import Icon from "@/components/ui/icon";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: "20+", label: "лет на рынке" },
  { value: "1 200+", label: "наименований" },
  { value: "850+", label: "клиентов B2B" },
  { value: "48 ч", label: "срок доставки" },
];

const categories = [
  { icon: "Gauge", name: "Насосное оборудование", count: 284 },
  { icon: "Wind", name: "Компрессоры", count: 156 },
  { icon: "Settings2", name: "Запорная арматура", count: 412 },
  { icon: "Activity", name: "КИПиА", count: 198 },
  { icon: "Zap", name: "Электрооборудование", count: 327 },
  { icon: "Wrench", name: "Инструмент и оснастка", count: 510 },
];

const advantages = [
  { icon: "ShieldCheck", title: "Сертифицированная продукция", desc: "Всё оборудование имеет необходимые сертификаты и декларации соответствия" },
  { icon: "Truck", title: "Доставка по всей России", desc: "Собственная логистика и сотрудничество с ведущими перевозчиками" },
  { icon: "FileText", title: "Полный пакет документов", desc: "Счёт, УПД, ТТН, паспорта на оборудование, сертификаты" },
  { icon: "Headphones", title: "Техническая поддержка", desc: "Инженеры-консультанты помогут подобрать оптимальное решение" },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-[var(--navy)] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "40px 40px"
        }} />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="max-w-2xl animate-slide-up">
            <div className="section-label mb-4">B2B Поставщик промышленного оборудования</div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
              Надёжные поставки для вашего производства
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Промышленное оборудование, запорная арматура, КИПиА — полный цикл от подбора до монтажа. Работаем только с юридическими лицами.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNavigate("catalog")} className="btn-primary">
                Перейти в каталог
              </button>
              <button onClick={() => onNavigate("contacts")} className="border border-white/30 text-white font-semibold px-6 py-2.5 text-sm tracking-wide hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-200">
                Запросить КП
              </button>
            </div>
          </div>
        </div>
        {/* Accent line */}
        <div className="h-1 bg-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-transparent" />
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-[var(--navy)] font-mono-num">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-label mb-2">Ассортимент</div>
            <h2 className="text-2xl font-bold text-[var(--navy)]">Категории продукции</h2>
          </div>
          <button
            onClick={() => onNavigate("catalog")}
            className="text-sm text-[var(--gold)] font-medium hover:underline flex items-center gap-1"
          >
            Весь каталог <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate("catalog")}
              className="card-product p-6 text-left group"
            >
              <div className="w-10 h-10 bg-[var(--surface)] flex items-center justify-center mb-4 group-hover:bg-amber-50 transition-colors">
                <Icon name={cat.icon} size={20} className="text-[var(--navy)]" />
              </div>
              <div className="font-semibold text-[var(--navy)] mb-1 text-sm">{cat.name}</div>
              <div className="text-xs text-gray-400 font-mono-num">{cat.count} позиций</div>
            </button>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="section-label mb-2">Почему выбирают нас</div>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-8">Преимущества работы с ПромТех</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv) => (
              <div key={adv.title} className="border-l-2 border-[var(--gold)] pl-5">
                <div className="mb-3">
                  <Icon name={adv.icon} size={22} className="text-[var(--gold)]" />
                </div>
                <h3 className="font-semibold text-[var(--navy)] text-sm mb-2">{adv.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-[var(--navy)] p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-full opacity-5" style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 10px)",
            backgroundSize: "14px 14px"
          }} />
          <div className="relative max-w-xl">
            <div className="section-label mb-3">Личный кабинет</div>
            <h2 className="text-2xl font-bold text-white mb-4">Управляйте заказами онлайн</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Отслеживайте статус поставок, скачивайте документы, просматривайте историю заказов и формируйте заявки в любое время.
            </p>
            <button onClick={() => onNavigate("cabinet")} className="btn-primary">
              Войти в кабинет
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}