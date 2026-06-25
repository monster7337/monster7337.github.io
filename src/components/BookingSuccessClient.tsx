"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function readParam(value: string | null) {
  return value ?? "";
}

export default function BookingSuccessClient() {
  const searchParams = useSearchParams();
  const type = readParam(searchParams.get("type"));
  const bookingId = readParam(searchParams.get("bookingId"));
  const items = readParam(searchParams.get("items"));
  const date = readParam(searchParams.get("date"));
  const time = readParam(searchParams.get("time"));
  const total = readParam(searchParams.get("total"));
  const prepayment = readParam(searchParams.get("prepayment"));
  const remaining = readParam(searchParams.get("remaining"));
  const phone = readParam(searchParams.get("phone"));
  const recipient = readParam(searchParams.get("recipient"));
  const isGift = type === "gift";

  return (
    <div className="forest-card p-6 sm:p-8">
      <div className="inline-flex rounded-full border border-[#8fad5e]/35 bg-[rgba(255,255,255,.06)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#dbe8be]">
        {isGift ? "Сертификат оформлен" : "Бронь сохранена"}
      </div>
      <h1 className="mt-4 text-[2rem] font-black leading-[1.02] text-[#f6efde] sm:text-[3rem]">
        {isGift ? "Сертификат оплачен и уже попал в CRM" : "Запись принята и уже попала в CRM"}
      </h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-[#efe4c8]/84 sm:text-base">
        {isGift
          ? "Заказ уже сохранен в системе вместе с данными покупателя, получателя и параметрами сертификата."
          : "Администратор увидит вашу бронь в системе сразу с выбранными тарифами, датой, временем и суммой предоплаты."}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">{isGift ? "Номер заказа" : "Номер брони"}</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{bookingId || "Сформирован"}</strong>
        </div>
        <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Телефон</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{phone || "Указан в заявке"}</strong>
        </div>
        <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4 sm:col-span-2">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">{isGift ? "Сертификат" : "Билеты"}</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{items || (isGift ? "Подарочный сертификат" : "Выбранные тарифы")}</strong>
        </div>
        <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">{isGift ? "Дата покупки" : "Дата"}</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{date || "Указана в заявке"}</strong>
        </div>
        <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">{isGift ? "Время покупки" : "Время"}</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{time || "Указано в заявке"}</strong>
        </div>
        {isGift ? (
          <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4 sm:col-span-2">
            <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">Получатель</span>
            <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{recipient || "Указан в заказе"}</strong>
          </div>
        ) : null}
        <div className="rounded-[22px] border border-[#8fad5e]/34 bg-[linear-gradient(180deg,rgba(122,166,74,.16)_0%,rgba(62,90,36,.18)_100%)] p-4">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#dbe8be]">{isGift ? "Оплачено" : "Предоплата сейчас"}</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{prepayment || (isGift ? total : "500 ₽ за место")}</strong>
        </div>
        <div className="rounded-[22px] border border-[#d6c388]/18 bg-[rgba(255,255,255,.05)] p-4">
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-[#e8d9b4]">{isGift ? "Остаток" : "Остаток на месте"}</span>
          <strong className="mt-2 block text-[1rem] text-[#f6efdb]">{remaining || total || (isGift ? "0 ₽" : "По тарифу")}</strong>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link className="btn-forest min-h-[46px] flex-1" href="/">
          На главную
        </Link>
        <Link className="btn-cream min-h-[46px] flex-1" href={isGift ? "/gift-certificates" : "/booking"}>
          {isGift ? "Оформить еще один сертификат" : "Оформить еще одну запись"}
        </Link>
      </div>
    </div>
  );
}
