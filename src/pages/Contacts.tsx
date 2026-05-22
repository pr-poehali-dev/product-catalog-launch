import { useState } from "react";
import Icon from "@/components/ui/icon";

const offices = [
  { city: "Москва (Центральный офис)", address: "ул. Промышленная, д. 12, стр. 3", phone: "+7 (495) 123-45-67", email: "moscow@promtech.ru", hours: "Пн–Пт: 9:00–18:00" },
  { city: "Санкт-Петербург", address: "Промышленный пр., д. 44", phone: "+7 (812) 234-56-78", email: "spb@promtech.ru", hours: "Пн–Пт: 9:00–17:00" },
  { city: "Екатеринбург", address: "ул. Машиностроителей, д. 8", phone: "+7 (343) 345-67-89", email: "ekb@promtech.ru", hours: "Пн–Пт: 9:00–17:00" },
];

export default function Contacts() {
  const [formData, setFormData] = useState({ name: "", company: "", phone: "", email: "", message: "", type: "Запрос КП" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-[var(--navy)] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label mb-3">Связаться с нами</div>
          <h1 className="text-3xl font-bold mb-4">Контакты</h1>
          <p className="text-gray-300 max-w-xl text-sm leading-relaxed">
            Наши менеджеры готовы ответить на вопросы по ценам, условиям поставки и техническим характеристикам.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: "Phone", title: "Телефон", value: "+7 (495) 123-45-67", sub: "Многоканальный" },
            { icon: "Mail", title: "Email", value: "info@promtech.ru", sub: "Ответ в течение 2 часов" },
            { icon: "Clock", title: "Режим работы", value: "Пн–Пт: 9:00–18:00", sub: "МСК, UTC+3" },
          ].map(item => (
            <div key={item.title} className="bg-white border border-gray-100 p-6 card-accent-top">
              <Icon name={item.icon} size={22} className="text-[var(--gold)] mb-3" />
              <div className="text-xs text-gray-400 mb-1">{item.title}</div>
              <div className="font-semibold text-[var(--navy)] text-base">{item.value}</div>
              <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <div className="section-label mb-3">Обратная связь</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Отправьте запрос</h2>

            {sent ? (
              <div className="bg-green-50 border border-green-200 p-8 text-center">
                <Icon name="CheckCircle2" size={40} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-[var(--navy)] mb-2">Заявка отправлена</h3>
                <p className="text-sm text-gray-500">Менеджер свяжется с вами в течение 2 рабочих часов.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm text-[var(--gold)] hover:underline">Отправить ещё</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Тип обращения</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] bg-white"
                  >
                    <option>Запрос КП</option>
                    <option>Вопрос по заказу</option>
                    <option>Техническая консультация</option>
                    <option>Сотрудничество</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Имя *</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="Иван Иванов" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Компания *</label>
                    <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="ООО «Пример»" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Телефон *</label>
                    <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="+7 (___) ___-__-__" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)]" placeholder="mail@company.ru" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Сообщение</label>
                  <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={4} className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] resize-none"
                    placeholder="Опишите ваш запрос..." />
                </div>
                <button type="submit" className="btn-primary w-full justify-center flex items-center gap-2">
                  <Icon name="Send" size={15} />
                  Отправить заявку
                </button>
                <p className="text-xs text-gray-400">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </form>
            )}
          </div>

          {/* Offices */}
          <div>
            <div className="section-label mb-3">Офисы</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Наши подразделения</h2>
            <div className="space-y-4">
              {offices.map(office => (
                <div key={office.city} className="bg-white border border-gray-100 p-5">
                  <h3 className="font-semibold text-[var(--navy)] text-sm mb-3 flex items-center gap-2">
                    <Icon name="MapPin" size={14} className="text-[var(--gold)]" />
                    {office.city}
                  </h3>
                  <div className="space-y-1.5 text-xs text-gray-500 ml-5">
                    <div>{office.address}</div>
                    <div><a href={`tel:${office.phone}`} className="text-[var(--navy)] hover:text-[var(--gold)] transition-colors">{office.phone}</a></div>
                    <div><a href={`mailto:${office.email}`} className="text-[var(--navy)] hover:text-[var(--gold)] transition-colors">{office.email}</a></div>
                    <div className="text-gray-400">{office.hours}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[var(--surface)] border border-gray-100 p-5">
              <h3 className="font-semibold text-[var(--navy)] text-sm mb-3">Реквизиты</h3>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between"><span>ИНН</span><span className="font-mono-num text-[var(--navy)]">7701234567</span></div>
                <div className="flex justify-between"><span>КПП</span><span className="font-mono-num text-[var(--navy)]">770101001</span></div>
                <div className="flex justify-between"><span>ОГРН</span><span className="font-mono-num text-[var(--navy)]">1037701234567</span></div>
                <div className="flex justify-between"><span>Банк</span><span className="text-[var(--navy)]">ПАО Сбербанк</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
