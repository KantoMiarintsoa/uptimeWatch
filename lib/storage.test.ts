import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Site } from "@/lib/types";

const KEY = "uptime-watch:sites";

// storage.ts garde un cache en mémoire : on recharge le module
// à chaque test pour repartir de zéro.
async function loadStorage() {
  vi.resetModules();
  return import("@/lib/storage");
}

const site = (url: string): Site => ({ id: url, url });

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("renvoie une liste vide au premier lancement", async () => {
    const { getSites } = await loadStorage();
    expect(getSites()).toEqual([]);
  });

  it("enregistre les sites dans le localStorage", async () => {
    const { getSites, updateSites } = await loadStorage();

    updateSites(() => [site("https://example.com/")]);

    expect(getSites()).toEqual([site("https://example.com/")]);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([site("https://example.com/")]);
  });

  it("retrouve les sites après un rechargement de la page", async () => {
    localStorage.setItem(KEY, JSON.stringify([site("https://example.com/")]));

    const { getSites } = await loadStorage();

    expect(getSites()).toEqual([site("https://example.com/")]);
  });

  it("ignore les URL invalides déjà enregistrées", async () => {
    localStorage.setItem(KEY, JSON.stringify([site("https://example.com/"), site("bonjour")]));

    const { getSites } = await loadStorage();

    expect(getSites()).toEqual([site("https://example.com/")]);
  });

  it("renvoie une liste vide si les données sont corrompues", async () => {
    localStorage.setItem(KEY, "{pas du json");

    const { getSites } = await loadStorage();

    expect(getSites()).toEqual([]);
  });

  it("garde la même référence tant que rien ne change", async () => {
    const { getSites } = await loadStorage();
    expect(getSites()).toBe(getSites());
  });

  it("prévient les abonnés à chaque modification", async () => {
    const { subscribe, updateSites } = await loadStorage();
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    updateSites(() => [site("https://example.com/")]);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    updateSites(() => []);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("relit la liste quand un autre onglet la modifie", async () => {
    const { getSites, subscribe } = await loadStorage();
    const listener = vi.fn();
    subscribe(listener);
    expect(getSites()).toEqual([]);

    // Un autre onglet écrit dans le localStorage
    localStorage.setItem(KEY, JSON.stringify([site("https://example.com/")]));
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(getSites()).toEqual([site("https://example.com/")]);
  });
});
