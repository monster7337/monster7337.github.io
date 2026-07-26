"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAlfabankOrder, PublicAlfabankOrder } from "@/lib/alfabankClient";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(Number(value) || 0);
}

function getStatusCopy(order: PublicAlfabankOrder) {
  const isTest = order.mode === "test";

  if (order.status === "paid") {
    return {
      title: isTest ? "Тестовая оплата прошла" : "Оплата прошла",
      description: isTest
        ? "Альфа-Банк подтвердил тестовый платёж. Реальные деньги не списаны, а заказ сохранён в панели как тестовый."
        : "Альфа-Банк подтвердил оплату. Заказ сохранён в панели, и администратор увидит его автоматически.",
    };
  }

  if (["cancelled", "declined", "refunded", "registration_failed", "amount_mismatch"].includes(order.status)) {
    return {
      title: "Оплата не завершена",
      description: "Деньги не списаны. Можно вернуться к форме, проверить данные и попробовать ещё раз.",
    };
  }

  return {
    title: "Проверяем платёж",
    description: "Банк ещё не передал окончательный статус. Подождите несколько секунд и обновите страницу.",
  };
}

export default function BookingSuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const token = searchParams.get("token") || "";
  const [order, setOrder] = useState<PublicAlfabankOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      try {
        const result = await getAlfabankOrder(orderNumber, token);
        if (cancelled) return;

        setOrder(result);
        if (result.status === "paid") {
          window.sessionStorage.removeItem(result.kind === "gift" ? "velkah-gift-draft" : "velkah-booking-draft");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Не удалось проверить оплату.");
        }
      }
    }

    if (orderNumber && token) loadOrder();
    else setError("В ссылке нет данных для проверки заказа.");

    return () => {
      cancelled = true;
    };
  }, [orderNumber, token]);

  if (error) {
    return (
      <div className="forest-card p-6 sm:p-8">
        <h1 className="text-[2rem] font-black leading-[1.02] text-[#f6efde] sm:text-[3rem]">Не удалось проверить заказ</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[#efe4c8]/84 sm:text-base">{error}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-forest min-h-[46px] flex-1" href="/booking">
            Вернуться к бронированию
          </Link>
          <Link className="btn-cream min-h-[46px] flex-1" href="/">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="forest-card p-6 sm:p-8 text-[#f6efdb]">
        <h1 className="text-[2rem] font-black">Проверяем платёж...</h1>
        <p className="mt-4 text-[#efe4c8]/84">Получаем подтверждение от Альфа-Банка.</p>
      </div>
    );
  }

  const copy = getStatusCopy(order);
  const ticketSummary = order.tickets.length
    ? order.tickets.map((ticket) => `${ticket.title} × ${ticket.quantity}`).join(", ")
    : order.title;

  return (
    <div className="forest-card p-6 sm:p-8">
      <div className="inline-flex rounded-full border border-[#8fad5e]/35 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#dbe8be]">
        {order.mode === "test" ? "Тестовый заказ" : "Статус заказа"}
      </div>
      <h1 className="mt-4 text-[2rem] font-black leading-[1.02] text-[#f6efde] sm:text-[3rem]">{copy.title}</h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[#efe4c8]/84 sm:text-base">{copy.description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoCell label="Номер заказа" value={order.orderNumber} />
        <InfoCell label="Контакт" value={`${order.customerName}, ${order.customerPhone}`} />
        <InfoCell className="sm:col-span-2" label={order.kind === "gift" ? "Сертификат" : "Билеты"} value={ticketSummary} />
        {order.kind === "booking" ? (
          <>
            <InfoCell label="Дата" value={order.dateLabel || order.date} />
            <InfoCell label="Время" value={order.time} />
          </>
        ) : (
          <InfoCell className="sm:col-span-2" label="Получатель" value={order.recipientName} />
        )}
        <InfoCell label="Гостей" value={String(order.guestCount)} />
        <InfoCell label={order.mode === "test" ? "Тестовая сумма" : "Оплачено"} value={formatCurrency(order.paymentAmount)} accent />
        <InfoCell label="Полная стоимость" value={formatCurrency(order.fullTotal)} />
        <InfoCell label="Остаток на месте" value={formatCurrency(order.remainingAmount)} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link className="btn-forest min-h-[46px] flex-1" href="/">
          На главную
        </Link>
        <Link className="btn-cream min-h-[46px] flex-1" href={order.kind === "gift" ? "/gift-certificates" : "/booking"}>
          {order.status === "paid" ? "Оформить ещё один заказ" : "Попробовать снова"}
        </Link>
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
  className = "",
  accent = false,
}: {
  label: string;
  value: string;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`${className} rounded-[22px] border p-4 ${
        accent
          ? "border-[#8fad5e]/34 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.18)_100%)]"
          : "border-[#d6c388]/18 bg-[rgba(255,255,255,.05)]"
      }`}
    >
      <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">{label}</span>
      <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{value}</strong>
    </div>
  );
}
