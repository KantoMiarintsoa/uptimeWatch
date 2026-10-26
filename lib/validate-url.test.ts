import { describe, expect, it } from "vitest";
import { normalizeUrl } from "@/lib/validate-url";

describe("normalizeUrl", () => {
  it("ajoute https:// quand le protocole manque", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com/");
  });

  it("garde http:// et https://", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com/");
    expect(normalizeUrl("https://example.com/page?q=1")).toBe("https://example.com/page?q=1");
  });

  it("enlève les espaces autour de la saisie", () => {
    expect(normalizeUrl("  example.com  ")).toBe("https://example.com/");
  });

  it("accepte localhost avec un port", () => {
    expect(normalizeUrl("http://localhost:3000")).toBe("http://localhost:3000/");
  });

  it.each(["", "   ", "bonjour", "ftp://example.com", "http://", "https://exa mple.com"])(
    "refuse %j",
    (input) => {
      expect(normalizeUrl(input)).toBeNull();
    },
  );
});
