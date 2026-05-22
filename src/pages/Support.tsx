import { useState } from "react";
import Icon from "@/components/ui/icon";

const faqs = [
  { q: "Как оформить первый заказ?", a: "Зарегистрируйтесь в личном кабинете, загрузите реквизиты компании. После проверки менеджер свяжется с вами для согласования условий. Первый заказ также можно оформить через форму на странице Контакты." },
  { q: "Какие условия оплаты?", a: "Для новых клиентов — 100% предоплата. Для постоянных партнёров после 3 успешных сделок доступна отсрочка платежа от 14 до 30 дней. Оплата по безналичному расчёту с НДС." },
  { q: "Как узнать статус заказа?", a: "Статус заказа отображается в личном кабинете в разделе 'Мои заказы'. Также на каждом этапе отправляются уведомления на email и по SMS." },
  { q: "Можно ли вернуть товар?", a: "Оборудование принимается к возврату в течение 14 дней при наличии оригинальной упаковки и сохранении товарного вида. Для оборудования с монтажом и настройкой — индивидуальные условия." },
  { q: "Есть ли гарантия на оборудование?", a: "Гарантийный срок на всё оборудование — 12 месяцев с даты поставки. По согласованию с производителем возможно расширение гарантии до 24–36 месяцев." },
  { q: "Как получить технические документы?", a: "Паспорта, сертификаты, декларации соответствия доступны для скачивания в личном кабинете в разделе 'Документы' после оформления заказа или по запросу менеджеру." },
];

const articles = [
  { icon: "BookOpen", title: "Руководство по подбору насосного оборудования", category: "Насосы", views: "1 240" },
  { icon: "FileText", title: "Как оформить заявку на поставку", category: "Заказы", views: "892" },
  { icon: "Settings", title: "Технические требования к монтажу запорной арматуры", category: "Арматура", views: "674" },
  { icon: "ShieldCheck", title: "Сертификация и документация для промышленного оборудования", category: "Документы", views: "540" },
  { icon: "Truck", title: "Условия доставки и страхования грузов", category: "Логистика", views: "421" },
  { icon: "Wrench", title: "Сервисное обслуживание: что входит в договор", category: "Сервис", views: "318" },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", priority: "Обычный", desc: "" });
  const [ticketSent, setTicketSent] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="bg-[var(--navy)] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label mb-3">Помощь и поддержка</div>
          <h1 className="text-3xl font-bold mb-4">Техническая поддержка</h1>
          <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
            База знаний, ответы на частые вопросы и форма обращения к специалистам.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Quick contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {[
            { icon: "Phone", title: "Телефонная поддержка", desc: "Пн–Пт: 9:00–18:00", action: "Позвонить", value: "+7 (495) 123-45-99" },
            { icon: "MessageSquare", title: "Онлайн-чат", desc: "Ответ за 5 минут в рабочее время", action: "Написать", value: "Telegram / WhatsApp" },
            { icon: "Mail", title: "Email поддержка", desc: "Ответ в течение 4 рабочих часов", action: "Написать", value: "support@promtech.ru" },
          ].map(item => (
            <div key={item.title} className="bg-white border border-gray-100 p-6 flex gap-4">
              <div className="w-10 h-10 bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon} size={18} className="text-[var(--navy)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--navy)] text-sm mb-1">{item.title}</h3>
                <div className="text-xs text-gray-500 mb-2">{item.desc}</div>
                <div className="text-xs font-medium text-[var(--gold)]">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-14">
          {/* FAQ */}
          <div>
            <div className="section-label mb-3">База знаний</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Частые вопросы</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-100">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium text-[var(--navy)]">{faq.q}</span>
                    <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-gray-400 flex-shrink-0" />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ticket */}
          <div>
            <div className="section-label mb-3">Обращение</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Создать тикет</h2>

            {ticketSent ? (
              <div className="bg-green-50 border border-green-200 p-8 text-center">
                <Icon name="CheckCircle2" size={36} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-[var(--navy)] mb-2">Тикет создан</h3>
                <p className="text-sm text-gray-500">Номер обращения: <span className="font-mono-num font-semibold">#TK-2024-{Math.floor(Math.random() * 9000) + 1000}</span></p>
                <p className="text-xs text-gray-400 mt-2">Ответ придёт на email в течение 4 часов</p>
                <button onClick={() => setTicketSent(false)} className="mt-4 text-sm text-[var(--gold)] hover:underline">Новое обращение</button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setTicketSent(true); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Тема обращения *</label>
                  <input required value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]"
                    placeholder="Кратко опишите проблему" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Приоритет</label>
                  <select value={ticketForm.priority} onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] bg-white">
                    <option>Обычный</option>
                    <option>Высокий</option>
                    <option>Критический</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Описание *</label>
                  <textarea required value={ticketForm.desc} onChange={e => setTicketForm({ ...ticketForm, desc: e.target.value })}
                    rows={5} className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] resize-none"
                    placeholder="Подробно опишите вашу ситуацию, номер заказа или артикул оборудования..." />
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Icon name="Send" size={14} />
                  Отправить обращение
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Articles */}
        <div>
          <div className="section-label mb-3">Материалы</div>
          <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Статьи и руководства</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map(art => (
              <div key={art.title} className="bg-white border border-gray-100 p-5 hover:border-[var(--gold)] transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-[var(--surface)] flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                    <Icon name={art.icon} size={15} className="text-[var(--navy)]" />
                  </div>
                  <span className="text-xs text-[var(--gold)] font-medium">{art.category}</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--navy)] leading-snug mb-3">{art.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Icon name="Eye" size={12} />
                  <span>{art.views} просмотров</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
