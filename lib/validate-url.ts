// Partagé entre le client (formulaire) et le serveur (API) :
// les deux appliquent exactement la même règle.

/**
 * Transforme la saisie en URL propre, ou renvoie null si elle est invalide.
 * "example.com" devient "https://example.com".
 */
export function normalizeUrl(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return url.toString();
  } catch {
    return null;
  }
}
