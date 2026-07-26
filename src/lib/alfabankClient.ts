export type AlfabankPaymentPayload = Record<string, unknown> & {
  kind: "booking" | "gift";
};

export type PublicAlfabankOrder = {
  orderNumber: string;
  siteName: string;
  mode: "test" | "production";
  status: string;
  kind: "booking" | "gift";
  title: string;
  customerName: string;
  customerPhone: string;
  tickets: Array<{ id: string; title: string; quantity: number; unitPrice: number; lineTotal: number }>;
  guestCount: number;
  date: string;
  dateLabel: string;
  time: string;
  recipientName: string;
  fullTotal: number;
  paymentAmount: number;
  remainingAmount: number;
};

export async function createAlfabankPayment(payload: AlfabankPaymentPayload) {
  const response = await fetch("/api/alfabank/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as {
    paymentUrl?: string;
    orderNumber?: string;
    mode?: string;
    message?: string;
  };

  if (!response.ok || !data.paymentUrl) {
    throw new Error(data.message || "Не удалось открыть страницу оплаты.");
  }

  return data as typeof data & { paymentUrl: string };
}

export async function getAlfabankOrder(orderNumber: string, token: string): Promise<PublicAlfabankOrder> {
  const query = new URLSearchParams({ order: orderNumber, token });
  const response = await fetch(`/api/alfabank/order?${query.toString()}`, { cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as {
    order?: PublicAlfabankOrder;
    message?: string;
  };

  if (!response.ok || !data.order) {
    throw new Error(data.message || "Не удалось проверить оплату.");
  }

  return data.order;
}
