import {
  getPaymentErrorStatus,
  registerAlfabankOrder,
  toPublicOrder,
  verifyAlfabankOrder,
} from "@/lib/alfabankServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = { code: "ve", name: "В Ёлках", origin: "https://в-елках.рф" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return json({ ok: false, message: "Запрос с другого сайта отклонён." }, 403);
  try {
    return json({ ok: true, ...(await registerAlfabankOrder((await request.json()) as Record<string, unknown>, SITE)) });
  } catch (error) {
    return json(
      { ok: false, message: error instanceof Error ? error.message : "Не удалось создать платёж." },
      getPaymentErrorStatus(error)
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const order = await verifyAlfabankOrder(searchParams.get("order"), searchParams.get("token"));
    return json({ ok: true, order: toPublicOrder(order) });
  } catch (error) {
    return json(
      { ok: false, message: error instanceof Error ? error.message : "Не удалось проверить платёж." },
      getPaymentErrorStatus(error)
    );
  }
}
