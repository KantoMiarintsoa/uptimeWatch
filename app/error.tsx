"use client"; // Les error boundaries doivent être des Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
      <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
      <p className="text-sm text-muted-foreground">Quelque chose s&apos;est mal passé.</p>
      <Button onClick={() => retry()}>Réessayer</Button>
    </main>
  );
}
