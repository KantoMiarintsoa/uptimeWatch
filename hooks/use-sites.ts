"use client";

import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { checkSite } from "@/lib/api";
import { getServerSites, getSites, subscribe, updateSites } from "@/lib/storage";
import type { CheckResult, Site } from "@/lib/types";

// Toute la logique de l'app est ici. Les composants ne font qu'afficher.
export function useSites() {
  // React lit la liste dans le store et ré-affiche à chaque changement.
  // Côté serveur, getServerSites renvoie null : rien n'est encore chargé.
  const stored = useSyncExternalStore(subscribe, getSites, getServerSites);
  const [checkingIds, setCheckingIds] = useState<string[]>([]);

  const sites = stored ?? [];
  const loaded = stored !== null;

  async function check(site: Site) {
    setCheckingIds((ids) => [...ids, site.id]);
    try {
      const result = await checkSite(site.url);
      updateSites((all) =>
        all.map((s) => (s.id === site.id ? { ...s, lastCheck: result } : s)),
      );
    } catch (err) {
      toast.error(`Impossible de vérifier ${site.url}`, {
        description: err instanceof Error ? err.message : "Erreur inconnue",
      });
    } finally {
      setCheckingIds((ids) => ids.filter((id) => id !== site.id));
    }
  }

  function checkAll() {
    sites.forEach(check);
  }

  // Le serveur vérifie l'URL AVANT l'ajout : si elle est refusée,
  // le site n'entre jamais dans la liste.
  // Renvoie un message d'erreur, ou null si l'ajout a réussi.
  async function addSite(url: string): Promise<string | null> {
    if (sites.some((s) => s.url === url)) {
      return "Ce site est déjà dans la liste";
    }

    let result: CheckResult;
    try {
      result = await checkSite(url);
    } catch (err) {
      return err instanceof Error ? err.message : "URL invalide";
    }

    const site: Site = { id: crypto.randomUUID(), url, lastCheck: result };
    updateSites((all) => (all.some((s) => s.url === url) ? all : [...all, site]));
    return null;
  }

  function removeSite(id: string) {
    updateSites((all) => all.filter((s) => s.id !== id));
  }

  return {
    sites,
    loaded,
    isChecking: (id: string) => checkingIds.includes(id),
    addSite,
    removeSite,
    check,
    checkAll,
  };
}
