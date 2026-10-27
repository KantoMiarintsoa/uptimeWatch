import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
        <ConfirmRemove url={site.url} onConfirm={onRemove} />
      </div>
    </li>
  );
}

// Demande une confirmation avant de supprimer : l'action est irréversible
function ConfirmRemove({ url, onConfirm }: { url: string; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button size="sm" variant="destructive" />}>
        Supprimer
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer ce site ?</AlertDialogTitle>
          <AlertDialogDescription className="break-all">
            {url} ne sera plus surveillé. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function StatusBadge({ site, checking }: { site: Site; checking: boolean }) {
  if (checking) return <Badge variant="outline">Vérification…</Badge>;
  if (!site.lastCheck) return <Badge variant="secondary">⚪ Inconnu</Badge>;
  if (site.lastCheck.status === "up") return <Badge variant="outline">🟢 En ligne</Badge>;
  return <Badge variant="destructive">🔴 Hors ligne</Badge>;
}
