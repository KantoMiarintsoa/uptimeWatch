import type { Site } from "@/lib/types";
import { normalizeUrl } from "@/lib/validate-url";

// Seul fichier qui touche au localStorage : pour passer plus tard
// à une base de données, c'est ici qu'il faudra changer le code.
//
// C'est un petit "store" fait pour useSyncExternalStore (React) :
// subscribe = s'abonner aux changements, getSites = lire la valeur actuelle.

const STORAGE_KEY = "uptime-watch:sites";

let cache: Site[] | null = null; // garde la même référence tant que rien ne change
const listeners = new Set<() => void>();

function read(): Site[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const sites = saved ? (JSON.parse(saved) as Site[]) : [];
    // On ne garde jamais une URL invalide (ex : enregistrée par une ancienne version)
    return sites.filter((site) => normalizeUrl(site.url) !== null);
  } catch {
    return [];
  }
}

export function getSites(): Site[] {
  if (cache === null) cache = read();
  return cache;
}

export function getServerSites(): Site[] | null {
  return null;
}

export function updateSites(update: (sites: Site[]) => Site[]): void {
  cache = update(getSites());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Stockage plein ou bloqué (navigation privée) : la liste reste en mémoire
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  // Si la liste change dans un autre onglet, on la relit
  function onStorage(e: StorageEvent) {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  }

  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
