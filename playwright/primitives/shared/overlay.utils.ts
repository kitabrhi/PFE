import { Page } from '@playwright/test';

/**
 * Ferme tous les overlays CDK/Material Angular qui pourraient bloquer les clics.
 *
 * En v1, les composants mat-select, mat-dialog et mat-menu créent un
 * `<div class="cdk-overlay-backdrop">` qui intercepte les pointer events.
 * Si une interaction précédente laisse cet overlay ouvert, tous les clics
 * suivants échouent avec "subtree intercepts pointer events".
 *
 * Cette fonction :
 * 1. Envoie Escape pour fermer proprement via Angular
 * 2. Supprime de force les éléments backdrop restants via le DOM
 */
export async function fermerOverlays(page: Page): Promise<void> {
  const count = await page.locator('.cdk-overlay-backdrop').count();
  if (count === 0) return;

  // Tenter la fermeture propre via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Supprimer de force tout overlay restant via JS
  await page.evaluate(() => {
    document.querySelectorAll('.cdk-overlay-backdrop').forEach(el => el.remove());
    // Supprimer aussi les panes vides laissés par des menus/selects fermés
    document.querySelectorAll('.cdk-overlay-pane').forEach(pane => {
      if (!pane.innerHTML.trim()) pane.remove();
    });
  });
  await page.waitForTimeout(200);
}
