import type { CheckResult } from "@/lib/types";
import { normalizeUrl } from "@/lib/validate-url";

const TIMEOUT_MS = 10_000;

// POST /api/check   body : { "url": "https://example.com" }
// La requête part du serveur : le navigateur, lui, serait bloqué par CORS.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const url = normalizeUrl(typeof body?.url === "string" ? body.url : "");

  if (!url) {
    return Response.json({ error: "URL invalide" }, { status: 400 });
  }

  const start = Date.now();
  let result: CheckResult;

  try {
    const res = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "UptimeWatch/1.0" },
    });
    result = {
      status: res.ok ? "up" : "down",
      statusCode: res.status,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    result = {
      status: "down",
      statusCode: null,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: isTimeout ? "Délai dépassé" : "Site injoignable",
    };
  }

  return Response.json(result);
}
