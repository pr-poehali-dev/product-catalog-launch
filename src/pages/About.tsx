import Icon from "@/components/ui/icon";

const milestones = [
  { year: "2003", title: "Основание компании", desc: "Начало работы как дистрибьютора насосного оборудования в Москве" },
  { year: "2007", title: "Расширение ассортимента", desc: "Добавлены категории: компрессоры, запорная арматура, КИПиА" },
  { year: "2012", title: "Федеральная сеть", desc: "Открытие складов в 8 регионах России, собственная логистика" },
  { year: "2018", title: "1000+ клиентов B2B", desc: "Достижение ключевого показателя по числу активных корпоративных клиентов" },
  { year: "2024", title: "Цифровой портал", desc: "Запуск онлайн-платформы для управления заказами и документооборотом" },
];

const team = [
  { name: "Александр Петров", role: "Генеральный директор", exp: "20 лет в отрасли" },
  { name: "Ирина Козлова", role: "Коммерческий директор", exp: "15 лет в B2B продажах" },
  { name: "Дмитрий Иванов", role: "Технический директор", exp: "18 лет в машиностроении" },
  { name: "Елена Смирнова", role: "Руководитель логистики", exp: "12 лет в цепочках поставок" },
];

const certs = [
  "ISO 9001:2015 — Система менеджмента качества",
  "ISO 14001:2015 — Экологический менеджмент",
  "ГОСТ Р 57522-2017 — Промышленная безопасность",
  "Авторизованный дилер 40+ производителей",
];

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="bg-[var(--navy)] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label mb-3">О компании</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">ПромТех — надёжный партнёр с 2003 года</h1>
          <p className="text-gray-300 max-w-2xl text-base leading-relaxed">
            Мы специализируемся на поставках промышленного оборудования для предприятий нефтяной, газовой, химической и пищевой промышленности.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* About text + stats */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="section-label mb-3">Наша миссия</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-4">Обеспечиваем бесперебойную работу производств</h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>Компания ПромТех основана в 2003 году группой инженеров и технических специалистов с многолетним опытом в машиностроительной отрасли.</p>
              <p>За 20 лет работы мы выстроили надёжную цепочку поставок от ведущих мировых и российских производителей промышленного оборудования до конечных потребителей — предприятий и организаций.</p>
              <p>Наш принцип: долгосрочное партнёрство, прозрачные условия сотрудничества и полная техническая поддержка на всех этапах — от проектирования до пуска оборудования в эксплуатацию.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "Building2", val: "20+", label: "лет на рынке" },
              { icon: "Users", val: "850+", label: "B2B клиентов" },
              { icon: "Package", val: "1 200+", label: "позиций в каталоге" },
              { icon: "MapPin", val: "12", label: "городов присутствия" },
            ].map(item => (
              <div key={item.label} className="bg-white border border-gray-100 p-6 card-accent-top">
                <Icon name={item.icon} size={20} className="text-[var(--gold)] mb-3" />
                <div className="text-2xl font-bold text-[var(--navy)] font-mono-num">{item.val}</div>
                <div className="text-xs text-gray-400 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="section-label mb-3">История</div>
          <h2 className="text-xl font-bold text-[var(--navy)] mb-8">Этапы развития компании</h2>
          <div className="relative">
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-6">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="w-[60px] flex-shrink-0 text-right">
                    <span className="text-sm font-bold text-[var(--gold)] font-mono-num">{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1.5 w-3 h-3 border-2 border-[var(--gold)] bg-white rounded-full" />
                    <div className="bg-white border border-gray-100 p-4 ml-2">
                      <h3 className="font-semibold text-[var(--navy)] text-sm mb-1">{m.title}</h3>
                      <p className="text-xs text-gray-500">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="section-label mb-3">Команда</div>
          <h2 className="text-xl font-bold text-[var(--navy)] mb-8">Руководство компании</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map(person => (
              <div key={person.name} className="bg-white border border-gray-100 p-5">
                <div className="w-12 h-12 bg-[var(--navy)] flex items-center justify-center mb-4">
                  <Icon name="User" size={20} className="text-[var(--gold)]" />
                </div>
                <div className="font-semibold text-[var(--navy)] text-sm mb-1">{person.name}</div>
                <div className="text-xs text-[var(--gold)] mb-2">{person.role}</div>
                <div className="text-xs text-gray-400">{person.exp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certs */}
        <div className="bg-[var(--navy)] p-8">
          <div className="section-label mb-3">Документы</div>
          <h2 className="text-xl font-bold text-white mb-6">Сертификаты и лицензии</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {certs.map(cert => (
              <div key={cert} className="flex items-center gap-3 py-3 border-b border-white/10">
                <Icon name="BadgeCheck" size={18} className="text-[var(--gold)] flex-shrink-0" />
                <span className="text-sm text-gray-200">{cert}</span>
                <Icon name="Download" size={14} className="text-gray-400 ml-auto cursor-pointer hover:text-[var(--gold)] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
