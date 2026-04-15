import { Page, Locator, expect } from '@playwright/test';
import { Version, getSelector, CARTE_CV } from '../../config/carte-cv/selectors-carte-cv.config';
import { fermerOverlays } from '../shared/overlay.utils';

export class CarteCVPrimitives {

  static async verifierNavigationPageDetail(page: Page, version: Version): Promise<void> {
    if (version === 'v2') {
      const detailSel = getSelector(CARTE_CV.PAGE_DETAIL, version);
      const saveSel = getSelector(CARTE_CV.BTN_SAUVEGARDER, version);
      await page.locator(`${detailSel}, ${saveSel}`).first().waitFor({ timeout: 10_000 });
    }
  }

  static async retourListeCV(page: Page, version: Version): Promise<void> {
    if (version === 'v1') {
      const table = page.locator(getSelector(CARTE_CV.TABLE, version)).first();
      await table.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    } else {
      const btnRetour = getSelector(CARTE_CV.BTN_RETOUR, version);
      const count = await page.locator(btnRetour).count();
      if (count > 0) {
        await page.locator(btnRetour).first().click();
      } else {
        await page.getByText('Mes CV').click({ force: true });
      }
      const table = page.locator(getSelector(CARTE_CV.TABLE, version)).first();
      await table.scrollIntoViewIfNeeded();
      await expect(table).toBeVisible({ timeout: 10_000 });
      await page.waitForTimeout(500);
    }
  }

  static async assurerTableVisible(page: Page, version: Version): Promise<void> {
    const table = page.locator(getSelector(CARTE_CV.TABLE, version)).first();
    await table.scrollIntoViewIfNeeded();
    await expect(table).toBeVisible({ timeout: 10_000 });
  }

  static async assurerSurPageListe(page: Page, version: Version): Promise<void> {
    if (version === 'v2') {
      const detailSel = getSelector(CARTE_CV.PAGE_DETAIL, version);
      const saveSel = getSelector(CARTE_CV.BTN_SAUVEGARDER, version);
      const onDetail =
        (await page.locator(detailSel).count()) > 0 ||
        (await page.locator(saveSel).count()) > 0;

      if (onDetail) {
        await CarteCVPrimitives.retourListeCV(page, version);
      }
    }

    const table = page.locator(getSelector(CARTE_CV.TABLE, version));
    await table.scrollIntoViewIfNeeded();
    await expect(table).toBeVisible({ timeout: 10_000 });

    const row = page.locator(getSelector(CARTE_CV.TABLE_ROW, version)).first();
    await row.scrollIntoViewIfNeeded();
    await expect(row).toBeVisible({ timeout: 10_000 });
  }

  static async selectionnerCVEtNaviguer(page: Page, version: Version, statut: string): Promise<void> {
    await CarteCVPrimitives.assurerTableVisible(page, version);
    const rowSelector = getSelector(CARTE_CV.TABLE_ROW, version);

    const found = page.locator(rowSelector).filter({ hasText: statut });
    if ((await found.count()) === 0) {
      await page.locator(rowSelector).first().scrollIntoViewIfNeeded();
      await page.locator(rowSelector).first().click();
    } else {
      await found.first().scrollIntoViewIfNeeded();
      await found.first().click();
    }

    await page.waitForTimeout(1500);
    await CarteCVPrimitives.verifierNavigationPageDetail(page, version);
  }

  static async selectionnerCVParIndex(page: Page, version: Version, index: number): Promise<void> {
    await CarteCVPrimitives.assurerTableVisible(page, version);
    await fermerOverlays(page);
    const row = page.locator(getSelector(CARTE_CV.TABLE_ROW, version)).nth(index);
    await row.scrollIntoViewIfNeeded();
    await row.click();
    await page.waitForTimeout(1500);
    await CarteCVPrimitives.verifierNavigationPageDetail(page, version);
  }
}
