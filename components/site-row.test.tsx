import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SiteRow } from "@/components/site-row";
import type { Site } from "@/lib/types";

const baseSite: Site = { id: "1", url: "https://example.com/" };

function renderRow(site: Site = baseSite, checking = false) {
  const onCheck = vi.fn();
  const onRemove = vi.fn();
  render(
    <ul>
      <SiteRow site={site} checking={checking} onCheck={onCheck} onRemove={onRemove} />
    </ul>,
  );
  return { onCheck, onRemove, user: userEvent.setup() };
}

describe("SiteRow : statut", () => {
  it("affiche Inconnu quand le site n'a jamais été vérifié", () => {
    renderRow();
    expect(screen.getByText(/Inconnu/)).toBeInTheDocument();
    expect(screen.getByText("Jamais vérifié")).toBeInTheDocument();
  });

  it("affiche En ligne avec le code et le temps de réponse", () => {
    renderRow({
      ...baseSite,
      lastCheck: { status: "up", statusCode: 200, responseTime: 120, checkedAt: new Date().toISOString() },
    });
    expect(screen.getByText(/En ligne/)).toBeInTheDocument();
    expect(screen.getByText(/200 · 120 ms/)).toBeInTheDocument();
  });

  it("affiche Hors ligne avec le message d'erreur", () => {
    renderRow({
      ...baseSite,
      lastCheck: {
        status: "down",
        statusCode: null,
        responseTime: 10000,
        checkedAt: new Date().toISOString(),
        error: "Délai dépassé",
      },
    });
    expect(screen.getByText(/Hors ligne/)).toBeInTheDocument();
    expect(screen.getByText(/Délai dépassé/)).toBeInTheDocument();
  });

  it("affiche Vérification… et désactive le bouton pendant un test", () => {
    renderRow(baseSite, true);
    expect(screen.getByText("Vérification…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vérifier" })).toBeDisabled();
  });

  it("lance une vérification au clic sur Vérifier", async () => {
    const { onCheck, user } = renderRow();
    await user.click(screen.getByRole("button", { name: "Vérifier" }));
    expect(onCheck).toHaveBeenCalledTimes(1);
  });
});

describe("SiteRow : confirmation avant suppression", () => {
  it("ne supprime pas directement : ouvre une fenêtre de confirmation", async () => {
    const { onRemove, user } = renderRow();

    await user.click(screen.getByRole("button", { name: "Supprimer" }));

    const dialog = await screen.findByRole("alertdialog");
    expect(dialog).toHaveTextContent("Supprimer ce site ?");
    expect(dialog).toHaveTextContent("https://example.com/");
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("ne supprime rien quand on clique sur Annuler", async () => {
    const { onRemove, user } = renderRow();

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Annuler" }));

    expect(onRemove).not.toHaveBeenCalled();
  });

  it("supprime le site quand on confirme", async () => {
    const { onRemove, user } = renderRow();

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "Supprimer" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
