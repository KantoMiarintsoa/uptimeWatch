import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Site } from "@/lib/types";

type Props = {
  site: Site;
  checking: boolean;
  onCheck: () => void;
  onRemove: () => void;
};

export function SiteRow({ site, checking, onCheck, onRemove }: Props) {
  const check = site.lastCheck;

  return (
    <li className="flex flex-wrap items-center gap-3 p-3">
      <StatusBadge site={site} checking={checking} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{site.url}</p>
        <p className="text-xs text-muted-foreground">
          {check
            ? `${check.statusCode ?? check.error} · ${check.responseTime} ms · ${new Date(check.checkedAt).toLocaleTimeString("fr-FR")}`
            : "Jamais vérifié"}
        </p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onCheck} disabled={checking}>
          Vérifier
        </Button>
        <Button size="sm" variant="destructive" onClick={onRemove}>
          Supprimer
        </Button>
      </div>
    </li>
  );
}

function StatusBadge({ site, checking }: { site: Site; checking: boolean }) {
  if (checking) return <Badge variant="outline">Vérification…</Badge>;
  if (!site.lastCheck) return <Badge variant="secondary">⚪ Inconnu</Badge>;
  if (site.lastCheck.status === "up") return <Badge variant="outline">🟢 En ligne</Badge>;
  return <Badge variant="destructive">🔴 Hors ligne</Badge>;
}
