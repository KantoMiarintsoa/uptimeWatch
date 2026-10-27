// @vitest-environment node
// Code serveur : on le teste dans Node, comme en production
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/check/route";

// Simule l'appel du navigateur vers notre API
function callApi(body: unknown) {
  return POST(
    new Request("http://test/api/check", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

// Remplace le vrai fetch : aucun test ne sort sur internet
function mockFetch(impl: () => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/check", () => {
  it("renvoie up quand le site répond 200", async () => {
    const fetchMock = mockFetch(async () => new Response("ok", { status: 200 }));

    const res = await callApi({ url: "example.com" });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toMatchObject({ status: "up", statusCode: 200 });
    expect(typeof data.responseTime).toBe("number");
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/", expect.any(Object));
  });

  it.each([404, 401, 500, 503])("renvoie down quand le site répond %i", async (code) => {
    mockFetch(async () => new Response(null, { status: code }));

    const data = await (await callApi({ url: "https://example.com" })).json();

    expect(data).toMatchObject({ status: "down", statusCode: code });
  });

  it("renvoie down « Délai dépassé » quand le site est trop lent", async () => {
    mockFetch(async () => {
      throw new DOMException("timeout", "TimeoutError");
    });

    const data = await (await callApi({ url: "https://example.com" })).json();

    expect(data).toMatchObject({ status: "down", statusCode: null, error: "Délai dépassé" });
  });

  it("renvoie down « Site injoignable » quand la requête échoue", async () => {
    mockFetch(async () => {
      throw new TypeError("fetch failed");
    });

    const data = await (await callApi({ url: "https://example.com" })).json();

    expect(data).toMatchObject({ status: "down", statusCode: null, error: "Site injoignable" });
  });

  it.each([{ url: "bonjour" }, { url: 42 }, {}, "pas du json"])(
    "refuse une requête invalide (%j) avec une erreur 400",
    async (body) => {
      const fetchMock = mockFetch(async () => new Response(null));

      const res = await callApi(body);

      expect(res.status).toBe(400);
      expect(await res.json()).toEqual({ error: "URL invalide" });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
