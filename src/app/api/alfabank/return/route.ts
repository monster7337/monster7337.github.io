import { verifyAlfabankOrder } from "@/lib/alfabankServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderNumber = url.searchParams.get("order") || "";
  const token = url.searchParams.get("token") || "";
  const origin = process.env.ALFABANK_SITE_ORIGIN || "https://в-елках.рф";
  try {
    await verifyAlfabankOrder(orderNumber, token);
  } catch {
    // The result page performs another status check and shows a recoverable error.
  }
  const resultUrl = new URL("/booking/success", origin);
  resultUrl.searchParams.set("order", orderNumber);
  resultUrl.searchParams.set("token", token);
  return Response.redirect(resultUrl, 303);
}
