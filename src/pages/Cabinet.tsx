import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useApp } from "@/context/AppContext";

const orders = [
  { id: "ЗК-2024-1847", date: "15.11.2024", status: "Доставлен", statusColor: "green", amount: 284500, items: 3, tracking: "RP784512345RU" },
  { id: "ЗК-2024-1821", date: "08.11.2024", status: "В пути", statusColor: "blue", amount: 156000, items: 1, tracking: "RP784198765RU" },
  { id: "ЗК-2024-1793", date: "01.11.2024", status: "Обработка", statusColor: "amber", amount: 47800, items: 5, tracking: "—" },
  { id: "ЗК-2024-1764", date: "21.10.2024", status: "Доставлен", statusColor: "green", amount: 92300, items: 2, tracking: "RP784001234RU" },
  { id: "ЗК-2024-1741", date: "14.10.2024", status: "Доставлен", statusColor: "green", amount: 318700, items: 8, tracking: "RP783876543RU" },
];

const docs = [
  { name: "УПД ЗК-2024-1847", type: "УПД", date: "15.11.2024", size: "128 КБ" },
  { name: "Счёт ЗК-2024-1847", type: "Счёт", date: "12.11.2024", size: "84 КБ" },
  { name: "Сертификат насос ЦНС 38-44", type: "Сертификат", date: "15.11.2024", size: "2.1 МБ" },
  { name: "УПД ЗК-2024-1821", type: "УПД", date: "08.11.2024", size: "96 КБ" },
  { name: "Паспорт компрессор АВО-5/10", type: "Паспорт", date: "08.11.2024", size: "4.8 МБ" },
];

const statusColors: Record<string, string> = {
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

type Tab = "orders" | "docs" | "profile";

export default function Cabinet({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  if (!user) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex items-center justify-center bg-[var(--surface)] py-16">
        <div className="bg-white border border-gray-100 p-10 w-full max-w-md shadow-sm text-center">
          <div className="w-12 h-12 bg-[var(--navy)] flex items-center justify-center mb-6 mx-auto">
            <Icon name="User" size={22} className="text-[var(--gold)]" />
          </div>
          <div className="section-label mb-2">Личный кабинет</div>
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-3">Войдите в систему</h1>
          <p className="text-sm text-gray-400 mb-6">Для просмотра заказов и документов</p>
          <button onClick={() => onNavigate?.("auth")} className="btn-primary w-full flex items-center justify-center gap-2">
            <Icon name="LogIn" size={15} /> Войти или зарегистрироваться
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Cabinet header */}
      <div className="bg-[var(--navy)] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <div className="section-label mb-1">Личный кабинет</div>
            <h1 className="text-2xl font-bold">{user.company}</h1>
            <div className="text-gray-400 text-sm mt-1">ИНН: {user.inn} · {user.email}</div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <Icon name="LogOut" size={15} />
            Выйти
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Всего заказов", value: "47", icon: "Package" },
              { label: "В обработке", value: "2", icon: "Clock" },
              { label: "На сумму", value: "4,2 млн ₽", icon: "TrendingUp" },
              { label: "Документов", value: "134", icon: "FileText" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[var(--surface)] flex items-center justify-center">
                  <Icon name={s.icon} size={16} className="text-[var(--navy)]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--navy)] font-mono-num">{s.value}</div>
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
            { id: "orders", label: "Мои заказы", icon: "Package" },
            { id: "docs", label: "Документы", icon: "FileText" },
            { id: "profile", label: "Профиль", icon: "Building2" },
          ] as { id: Tab; label: string; icon: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-150 ${
                activeTab === tab.id
                  ? "border-[var(--gold)] text-[var(--navy)]"
                  : "border-transparent text-gray-400 hover:text-[var(--navy)]"
              }`}
            >
              <Icon name={tab.icon} size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--navy)]">История заказов</h2>
              <button className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                <Icon name="Plus" size={13} />
                Новая заявка
              </button>
            </div>
            <div className="bg-white border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--surface)] border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Номер</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Дата</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Статус</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Позиций</th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Сумма</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Трек-номер</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 table-row-hover">
                      <td className="px-5 py-3.5 text-sm font-semibold text-[var(--navy)] font-mono-num">{order.id}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{order.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 ${statusColors[order.statusColor]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600 font-mono-num">{order.items}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-[var(--navy)] text-right font-mono-num">
                        {order.amount.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400 font-mono-num">{order.tracking}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-xs text-[var(--gold)] hover:underline">Детали</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Docs */}
        {activeTab === "docs" && (
          <div className="animate-fade-in">
            <h2 className="font-semibold text-[var(--navy)] mb-4">Документы</h2>
            <div className="bg-white border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--surface)] border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Документ</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Тип</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Дата</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Размер</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map(doc => (
                    <tr key={doc.name} className="border-b border-gray-50 table-row-hover">
                      <td className="px-5 py-3.5 flex items-center gap-2">
                        <Icon name="FileText" size={15} className="text-gray-400" />
                        <span className="text-sm text-[var(--navy)]">{doc.name}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium px-2 py-0.5 bg-[var(--surface)] text-gray-600">{doc.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{doc.date}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-400 font-mono-num">{doc.size}</td>
                      <td className="px-5 py-3.5">
                        <button className="flex items-center gap-1 text-xs text-[var(--gold)] hover:underline">
                          <Icon name="Download" size={12} />
                          Скачать
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="font-semibold text-[var(--navy)] mb-6">Реквизиты организации</h2>
            <div className="bg-white border border-gray-100 p-6 space-y-4">
              {[
                ["Наименование", user.company],
                ["ИНН", user.inn],
                ["Email", user.email],
                ["Страна", user.country || "—"],
                ["Контактное лицо", user.name],
                ["Роль", user.role === "buyer" ? "Покупатель" : "Продавец"],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{key}</span>
                  <span className="text-sm font-medium text-[var(--navy)] font-mono-num">{val}</span>
                </div>
              ))}
              <button className="btn-outline mt-2 flex items-center gap-2 text-xs">
                <Icon name="Pencil" size={13} />
                Редактировать данные
              </button>
            </div>

            <div className="mt-6 bg-white border border-gray-100 p-6">
              <h3 className="font-semibold text-[var(--navy)] text-sm mb-4">Условия работы</h3>
              <div className="space-y-2">
                {[
                  ["Кредитный лимит", "500 000 ₽"],
                  ["Отсрочка платежа", "21 день"],
                  ["Персональный менеджер", "Петрова Анна, +7 (495) 123-45-78"],
                  ["Скидка", "5%"],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-400">{key}</span>
                    <span className="text-sm font-semibold text-[var(--navy)]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}