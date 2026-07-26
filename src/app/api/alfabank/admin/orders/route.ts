import { isAdminRequest } from "@/lib/admin-auth";
import { getAdminAlfabankOrders } from "@/lib/alfabankServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return Response.json(
      { ok: false, message: "Требуется вход в панель." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
  try {
    return Response.json(
      { ok: true, orders: await getAdminAlfabankOrders() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { ok: false, message: "Не удалось обновить банковские заказы." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
