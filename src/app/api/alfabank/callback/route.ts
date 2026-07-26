import { verifyAlfabankOrder } from "@/lib/alfabankServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleCallback(request: Request) {
  const url = new URL(request.url);
  try {
    await verifyAlfabankOrder(url.searchParams.get("order"), url.searchParams.get("token"));
  } catch {
    // Always acknowledge the callback; payment state is verified with the bank.
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export const GET = handleCallback;
export const POST = handleCallback;
