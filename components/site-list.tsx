import { SiteRow } from "@/components/site-row";
import { Button } from "@/components/ui/button";
import type { Site } from "@/lib/types";

type Props = {
  sites: Site[];
  isChecking: (id: string) => boolean;
  onCheck: (site: Site) => void;
  onCheckAll: () => void;
  onRemove: (id: string) => void;
};

export function SiteList({ sites, isChecking, onCheck, onCheckAll, onRemove }: Props) {
  if (sites.length === 0) {
    return (
      <p className="border p-4 text-sm text-muted-foreground">
        Aucun site surveillé pour l&apos;instant. Ajoute une URL ci-dessus.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">
          {sites.length} site{sites.length > 1 ? "s" : ""} surveillé{sites.length > 1 ? "s" : ""}
        </h2>
        <Button variant="outline" size="sm" onClick={onCheckAll}>
          Tout vérifier
        </Button>
      </div>

      <ul className="divide-y border">
        {sites.map((site) => (
          <SiteRow
            key={site.id}
            site={site}
            checking={isChecking(site.id)}
            onCheck={() => onCheck(site)}
            onRemove={() => onRemove(site.id)}
          />
        ))}
      </ul>
    </section>
  );
}
