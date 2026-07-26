import crypto from "node:crypto";
import path from "node:path";
import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";

const TEST_API_URL = "https://alfa.rbsuat.com/payment/rest";
const BOOKING_PREPAYMENT_PER_GUEST = 500;
const MAX_ORDERS = 2000;

const ticketCatalog: Record<string, { title: string; price: number }> = {
  standard: { title: "Обычный билет", price: 1500 },
  family: { title: "Семейный билет", price: 1200 },
  social: { title: "Льготный билет", price: 1000 },
  "happy-hour": { title: "Счастливый час", price: 1000 },
};

type PaymentMode = "test" | "production";
type OrderDetails = Record<string, unknown> & {
  kind: "booking" | "gift";
  title: string;
  customer: { name: string; phone: string; email: string; comment: string };
  guestCount: number;
  fullTotal: number;
  paymentAmount: number;
  remainingAmount: number;
};
type StoredOrder = {
  orderNumber: string;
  publicToken: string;
  siteCode: string;
  siteName: string;
  mode: PaymentMode;
  status: string;
  amountKopecks: number;
  details: OrderDetails;
  createdAt: string;
  updatedAt: string;
  bankOrderId?: string;
  bankStatus?: string | number;
  actionCode?: string | number;
  registeredAt?: string;
  verifiedAt?: string;
  failureMessage?: string;
};
type SiteConfig = { code: string; name: string; origin: string };
type Storage = { orders: StoredOrder[] };

let storageQueue: Promise<unknown> = Promise.resolve();

export class PaymentValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "PaymentValidationError";
    this.status = status;
  }
}

function cleanText(value: unknown, maxLength = 160) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function requireText(value: unknown, label: string, maxLength = 160) {
  const result = cleanText(value, maxLength);
  if (!result) throw new PaymentValidationError(`Заполните поле «${label}».`);
  return result;
}

function normalizeEmail(value: unknown) {
  const email = requireText(value, "Email", 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new PaymentValidationError("Укажите корректный email.");
  return email;
}

function normalizePhone(value: unknown) {
  const phone = requireText(value, "Телефон", 40);
  if (!/^\+?[0-9()\-\s]{10,18}$/.test(phone)) throw new PaymentValidationError("Укажите корректный телефон.");
  return phone;
}

function normalizeCustomer(value: Record<string, unknown> | undefined) {
  return {
    name: requireText(value?.name, "Имя", 120),
    phone: normalizePhone(value?.phone),
    email: normalizeEmail(value?.email),
    comment: cleanText(value?.comment, 320),
  };
}

function requireConsents(value: Record<string, unknown> | undefined) {
  if (value?.terms !== true || value?.personalData !== true) {
    throw new PaymentValidationError("Перед оплатой подтвердите условия и согласие на обработку персональных данных.");
  }
}

function buildBookingDetails(payload: Record<string, unknown>): OrderDetails {
  requireConsents(payload.consents as Record<string, unknown> | undefined);
  const customer = normalizeCustomer(payload.customer as Record<string, unknown> | undefined);
  const quantities = new Map<string, number>();
  const payloadTickets = payload.tickets;

  if (!Array.isArray(payloadTickets)) throw new PaymentValidationError("Выберите хотя бы один билет.");

  payloadTickets.forEach((rawItem: unknown) => {
    const item = rawItem as Record<string, unknown>;
    const id = cleanText(item?.id, 32);
    const quantity = Number(item?.quantity);
    if (!ticketCatalog[id] || !Number.isInteger(quantity) || quantity < 1 || quantity > 12) {
      throw new PaymentValidationError("Состав билетов указан неверно.");
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity);
  });

  const tickets = Array.from(quantities, ([id, quantity]) => ({
    id,
    title: ticketCatalog[id].title,
    quantity,
    unitPrice: ticketCatalog[id].price,
    lineTotal: ticketCatalog[id].price * quantity,
  }));
  const guestCount = tickets.reduce((sum, item) => sum + item.quantity, 0);
  if (guestCount < 1 || guestCount > 12) throw new PaymentValidationError("В одном заказе должно быть от 1 до 12 гостей.");
  const familyQuantity = quantities.get("family") || 0;
  if (familyQuantity > 0 && familyQuantity < 3) throw new PaymentValidationError("Для семейной цены нужно выбрать минимум 3 билета.");

  const date = requireText(payload.date, "Дата", 10);
  const time = requireText(payload.time, "Время", 5);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !["11:00", "13:00", "15:00", "17:00", "19:00"].includes(time)) {
    throw new PaymentValidationError("Дата или время визита указаны неверно.");
  }

  const fullTotal = tickets.reduce((sum, item) => sum + item.lineTotal, 0);
  const paymentAmount = guestCount * BOOKING_PREPAYMENT_PER_GUEST;
  return {
    kind: "booking",
    customer,
    tickets,
    guestCount,
    date,
    dateLabel: cleanText(payload.dateLabel, 80) || date,
    time,
    fullTotal,
    paymentAmount,
    remainingAmount: Math.max(0, fullTotal - paymentAmount),
    title: `Предоплата визита на ${guestCount} гостей`,
  };
}

function buildGiftDetails(payload: Record<string, unknown>): OrderDetails {
  requireConsents(payload.consents as Record<string, unknown> | undefined);
  const customer = normalizeCustomer({
    name: payload.purchaserName,
    phone: payload.purchaserPhone,
    email: payload.purchaserEmail,
    comment: payload.comment,
  });
  const guestCount = Number(payload.guestCount);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 12) {
    throw new PaymentValidationError("Сертификат можно оформить на количество гостей от 1 до 12.");
  }

  const pricePerGuest = guestCount >= 3 ? 1200 : 1500;
  const paymentAmount = guestCount * pricePerGuest;
  const deliveryMethod = requireText(payload.deliveryMethod, "Способ отправки", 40);
  if (!["Email", "Telegram", "VK", "Instagram", "WhatsApp"].includes(deliveryMethod)) {
    throw new PaymentValidationError("Выберите доступный способ отправки сертификата.");
  }

  return {
    kind: "gift",
    customer,
    guestCount,
    pricePerGuest,
    paymentAmount,
    fullTotal: paymentAmount,
    remainingAmount: 0,
    title: `Подарочный сертификат на ${guestCount} гостей`,
    recipient: {
      name: requireText(payload.recipientName, "Имя получателя", 120),
      phone: normalizePhone(payload.recipientPhone),
      email: normalizeEmail(payload.recipientEmail),
    },
    deliveryMethod,
    deliveryContact: cleanText(payload.deliveryContact, 120),
    message: cleanText(payload.message, 320),
  };
}

function getGatewayConfig() {
  const mode: PaymentMode = process.env.ALFABANK_MODE === "production" ? "production" : "test";
  const apiUrl = cleanText(process.env.ALFABANK_API_URL, 300) || (mode === "test" ? TEST_API_URL : "");
  const username = cleanText(process.env.ALFABANK_API_USERNAME, 80);
  const password = String(process.env.ALFABANK_API_PASSWORD || "");
  if (!apiUrl || !username || !password) throw new PaymentValidationError("Платёжный шлюз ещё не настроен.", 503);
  return { mode, apiUrl: apiUrl.replace(/\/+$/, ""), username, password };
}

function getStorageFile() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), ".alfabank", "orders.json");
}

async function readStorage(): Promise<Storage> {
  try {
    const parsed = JSON.parse(await readFile(getStorageFile(), "utf8")) as Partial<Storage>;
    return Array.isArray(parsed.orders) ? { orders: parsed.orders } : { orders: [] };
  } catch {
    return { orders: [] };
  }
}

async function writeStorage(storage: Storage) {
  const file = getStorageFile();
  const directory = path.dirname(file);
  const temporaryFile = `${file}.${process.pid}.${crypto.randomBytes(5).toString("hex")}.tmp`;
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(temporaryFile, `${JSON.stringify(storage, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporaryFile, file);
  await chmod(file, 0o600);
}

function withStorageLock<T>(task: () => Promise<T>) {
  const result = storageQueue.then(task, task);
  storageQueue = result.catch(() => undefined);
  return result;
}

async function saveOrder(order: StoredOrder) {
  return withStorageLock(async () => {
    const storage = await readStorage();
    const index = storage.orders.findIndex((item) => item.orderNumber === order.orderNumber);
    const updated = { ...order, updatedAt: new Date().toISOString() };
    if (index >= 0) storage.orders[index] = { ...storage.orders[index], ...updated };
    else storage.orders.push(updated);
    storage.orders = storage.orders.slice(-MAX_ORDERS);
    await writeStorage(storage);
    return updated;
  });
}

async function findOrder(orderNumber: string) {
  const storage = await readStorage();
  return storage.orders.find((item) => item.orderNumber === orderNumber) || null;
}

function tokensMatch(left: unknown, right: unknown) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

async function requestGateway(method: string, parameters: Record<string, string>) {
  const gateway = getGatewayConfig();
  const body = new URLSearchParams({ userName: gateway.username, password: gateway.password, ...parameters });
  let response: Response;
  try {
    response = await fetch(`${gateway.apiUrl}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new PaymentValidationError("Банк временно не отвечает. Попробуйте ещё раз через несколько минут.", 502);
  }

  const raw = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    data = {};
  }
  if (!response.ok) throw new PaymentValidationError("Банк временно не принимает запросы.", 502);
  return { data, gateway };
}

function getSiteOrigin(site: SiteConfig) {
  try {
    const origin = new URL(process.env.ALFABANK_SITE_ORIGIN || site.origin).origin;
    if (!origin.startsWith("https://") && process.env.NODE_ENV === "production") throw new Error("HTTPS required");
    return origin;
  } catch {
    throw new PaymentValidationError("Не задан адрес сайта для возврата после оплаты.", 503);
  }
}

export async function registerAlfabankOrder(payload: Record<string, unknown>, site: SiteConfig) {
  const details = payload?.kind === "gift" ? buildGiftDetails(payload) : buildBookingDetails(payload);
  const gateway = getGatewayConfig();
  const siteOrigin = getSiteOrigin(site);
  const orderNumber = `${site.code}${details.kind === "gift" ? "g" : "b"}-${Date.now().toString(36)}-${crypto.randomBytes(5).toString("hex")}`;
  const publicToken = crypto.randomBytes(24).toString("base64url");
  const returnQuery = new URLSearchParams({ order: orderNumber, token: publicToken });
  const returnUrl = `${siteOrigin}/api/alfabank/return?${returnQuery.toString()}`;
  const failUrl = `${returnUrl}&failed=1`;
  const callbackUrl = `${siteOrigin}/api/alfabank/callback?${returnQuery.toString()}`;
  const now = new Date().toISOString();
  const order: StoredOrder = {
    orderNumber,
    publicToken,
    siteCode: site.code,
    siteName: site.name,
    mode: gateway.mode,
    status: "registering",
    amountKopecks: details.paymentAmount * 100,
    details,
    createdAt: now,
    updatedAt: now,
  };
  await saveOrder(order);

  try {
    const { data } = await requestGateway("register.do", {
      orderNumber,
      amount: String(order.amountKopecks),
      returnUrl,
      failUrl,
      dynamicCallbackUrl: callbackUrl,
      description: `${site.name}: ${details.title}`.replace(/[%+\r\n]/g, " ").slice(0, 99),
      language: "ru",
      clientId: crypto.createHash("sha256").update(details.customer.phone).digest("hex").slice(0, 32),
    });
    if (!data.orderId || !data.formUrl || (data.errorCode && String(data.errorCode) !== "0")) {
      throw new PaymentValidationError(String(data.errorMessage || data.error || "Банк не создал платёж."), 502);
    }
    await saveOrder({ ...order, bankOrderId: String(data.orderId), status: "pending", registeredAt: new Date().toISOString() });
    return { paymentUrl: String(data.formUrl), orderNumber, mode: gateway.mode };
  } catch (error) {
    await saveOrder({
      ...order,
      status: "registration_failed",
      failureMessage: error instanceof Error ? error.message : "Не удалось зарегистрировать платёж.",
    });
    throw error;
  }
}

function mapBankStatus(value: unknown) {
  const status = Number(value);
  if (status === 2) return "paid";
  if (status === 1) return "authorized";
  if (status === 3) return "cancelled";
  if (status === 4) return "refunded";
  if (status === 6) return "declined";
  return "pending";
}

export async function verifyAlfabankOrder(orderNumber: unknown, publicToken: unknown) {
  const order = await findOrder(cleanText(orderNumber, 40));
  if (!order || !tokensMatch(order.publicToken, publicToken)) throw new PaymentValidationError("Заказ не найден.", 404);
  if (!order.bankOrderId) return order;

  const { data } = await requestGateway("getOrderStatusExtended.do", { orderId: order.bankOrderId, language: "ru" });
  if (data.errorCode && String(data.errorCode) !== "0") {
    throw new PaymentValidationError(String(data.errorMessage || "Банк не смог проверить платёж."), 502);
  }
  const bankAmount = Number(data.amount);
  const status = Number.isFinite(bankAmount) && bankAmount !== order.amountKopecks ? "amount_mismatch" : mapBankStatus(data.orderStatus);
  return saveOrder({
    ...order,
    status,
    bankStatus: data.orderStatus as string | number | undefined,
    actionCode: data.actionCode as string | number | undefined,
    verifiedAt: new Date().toISOString(),
  });
}

export function toPublicOrder(order: StoredOrder) {
  const recipient = order.details.recipient as { name?: string } | undefined;
  return {
    orderNumber: order.orderNumber,
    siteName: order.siteName,
    mode: order.mode,
    status: order.status,
    kind: order.details.kind,
    title: order.details.title,
    customerName: order.details.customer.name,
    customerPhone: order.details.customer.phone,
    tickets: order.details.tickets || [],
    guestCount: order.details.guestCount,
    date: order.details.date || "",
    dateLabel: order.details.dateLabel || "",
    time: order.details.time || "",
    recipientName: recipient?.name || "",
    fullTotal: order.details.fullTotal,
    paymentAmount: order.details.paymentAmount,
    remainingAmount: order.details.remainingAmount,
  };
}

function toAdminOrder(order: StoredOrder) {
  return {
    orderNumber: order.orderNumber,
    bankOrderId: order.bankOrderId || "",
    siteCode: order.siteCode,
    siteName: order.siteName,
    mode: order.mode,
    status: order.status,
    bankStatus: order.bankStatus,
    actionCode: order.actionCode,
    details: order.details,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    registeredAt: order.registeredAt || "",
    verifiedAt: order.verifiedAt || "",
  };
}

export async function getAdminAlfabankOrders() {
  const storage = await readStorage();
  const now = Date.now();
  const ordersToRefresh = storage.orders
    .filter((order) => {
      if (!order.bankOrderId || !["pending", "authorized"].includes(order.status)) return false;
      const lastCheck = new Date(order.verifiedAt || order.registeredAt || order.createdAt).getTime();
      return !Number.isFinite(lastCheck) || now - lastCheck > 30000;
    })
    .slice(-20);
  await Promise.allSettled(ordersToRefresh.map((order) => verifyAlfabankOrder(order.orderNumber, order.publicToken)));
  const refreshedStorage = ordersToRefresh.length ? await readStorage() : storage;
  return refreshedStorage.orders.slice().reverse().map(toAdminOrder);
}

export function getPaymentErrorStatus(error: unknown) {
  return error instanceof PaymentValidationError ? error.status : 500;
}
