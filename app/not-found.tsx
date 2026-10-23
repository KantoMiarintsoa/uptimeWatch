import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="text-sm text-muted-foreground">Cette page n&apos;existe pas.</p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
