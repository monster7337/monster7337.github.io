type PaykeeperInvoicePayload = {
  amount: number;
  orderId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceName?: string;
  successPath?: string;
};

type PaykeeperInvoiceResponse = {
  ok?: boolean;
  invoiceId?: string;
  paymentUrl?: string;
  message?: string;
};

type CreatedPaykeeperInvoice = PaykeeperInvoiceResponse & {
  paymentUrl: string;
};

export async function createPaykeeperInvoice(payload: PaykeeperInvoicePayload): Promise<CreatedPaykeeperInvoice> {
  const response = await fetch("/api/paykeeper/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as PaykeeperInvoiceResponse;

  if (!response.ok || !data.paymentUrl) {
    throw new Error(data.message || "PayKeeper не создал ссылку на оплату.");
  }

  return data as CreatedPaykeeperInvoice;
}
