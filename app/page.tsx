"use client";

import { AddSiteForm } from "@/components/add-site-form";
import { SiteList } from "@/components/site-list";
import { useSites } from "@/hooks/use-sites";

// La page ne fait qu'assembler : la logique est dans useSites,
// l'affichage dans les composants.
export default function Home() {
  const { sites, loaded, isChecking, addSite, removeSite, check, checkAll } = useSites();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <header>
        <h1 className="text-2xl font-semibold">Uptime Watch</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoute un site pour savoir s&apos;il est en ligne ou en panne.
        </p>
      </header>

      <AddSiteForm onAdd={addSite} />

      {loaded && (
        <SiteList
          sites={sites}
          isChecking={isChecking}
          onCheck={check}
          onCheckAll={checkAll}
          onRemove={removeSite}
        />
      )}
    </main>
  );
}
