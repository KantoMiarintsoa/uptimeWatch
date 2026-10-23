import type { CheckResult } from "@/lib/types";

// Appelle notre API Route, qui fait la vraie vérification côté serveur
export async function checkSite(url: string): Promise<CheckResult> {
  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erreur lors de la vérification");
  return data as CheckResult;
}
