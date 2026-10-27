"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeUrl } from "@/lib/validate-url";

type Props = {
  onAdd: (url: string) => Promise<string | null>;
};

export function AddSiteForm({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [pending, setPending] = useState(false);

  function fail(message: string, description?: string) {
    setInvalid(true);
    toast.error(message, { description });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const url = normalizeUrl(value);
    if (!url) return fail("URL invalide", "Exemple : https://example.com");

    setPending(true);
    const error = await onAdd(url);
    setPending(false);
    if (error) return fail(error);

    setInvalid(false);
    setValue("");
    toast.success("Site ajouté", { description: url });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setInvalid(false);
        }}
        placeholder="https://example.com"
        aria-label="URL du site"
        aria-invalid={invalid || undefined}
        disabled={pending}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Vérification…" : "Ajouter"}
      </Button>
    </form>
  );
}
