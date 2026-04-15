import { Page, expect } from '@playwright/test';
import {
  Version, getSelector,
  SECTION_CONFIGURATION
} from '../../config/configuration/selectors-configuration.config';

export class ConfigurationPrimitives {

  // Utilitaires

  private static async attendreChargement(page: Page): Promise<void> {
    await page.waitForTimeout(2000);
  }

  // Ouvrir le menu Configuration (mat-expansion-panel)

  static async ouvrirMenuConfiguration(page: Page, version: Version): Promise<void> {
    if (version === 'v1') {
      const headerSel = getSelector(SECTION_CONFIGURATION.PANEL_HEADER, version);
      const header = page.locator(headerSel);
      await header.scrollIntoViewIfNeeded();

      const isExpanded = await header.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await header.click({ force: true });
        await page.waitForTimeout(500);
      }
    } else {
      await page.locator(getSelector(SECTION_CONFIGURATION.PANEL_HEADER, version)).click({ force: true });
      await page.waitForTimeout(500);
    }
  }

  // Download profil

  static async telechargerProfil(page: Page, version: Version): Promise<void> {
    await ConfigurationPrimitives.ouvrirMenuConfiguration(page, version);

    if (version === 'v1') {
      const downloadBtn = page.getByRole('button', { name: 'Download profil' });
      await downloadBtn.scrollIntoViewIfNeeded();
      await downloadBtn.click({ force: true });
    } else {
      await page.locator(getSelector(SECTION_CONFIGURATION.BTN_DOWNLOAD_PROFIL, version)).click({ force: true });
    }

    await ConfigurationPrimitives.attendreChargement(page);
  }

  static async verifierDownloadDeclenche(page: Page): Promise<void> {
    await expect(page.locator('mat-expansion-panel')).toBeAttached({ timeout: 10000 });
  }

  // Upload profil

  static async uploaderProfil(page: Page, version: Version, cheminFichier: string): Promise<void> {
    await ConfigurationPrimitives.ouvrirMenuConfiguration(page, version);

    if (version === 'v1') {
      const uploadBtn = page.getByRole('button', { name: 'Upload profil' });
      await uploadBtn.scrollIntoViewIfNeeded();
      await uploadBtn.click({ force: true });

      await page.locator('input[type="file"]').setInputFiles(cheminFichier);
    } else {
      await page.locator(getSelector(SECTION_CONFIGURATION.BTN_UPLOAD_PROFIL, version)).click({ force: true });
      await page.locator(getSelector(SECTION_CONFIGURATION.INPUT_UPLOAD_FILE, version)).setInputFiles(cheminFichier);
    }

    await ConfigurationPrimitives.attendreChargement(page);
  }

  static async verifierUploadReussi(page: Page): Promise<void> {
    await expect(page.locator('body')).not.toContainText('Erreur');
    await expect(page.locator('mat-expansion-panel')).toBeAttached({ timeout: 10000 });
  }

  // Mode sombre (mat-slide-toggle / mdc-switch)

  static async activerModeSombre(page: Page, version: Version): Promise<void> {
    await ConfigurationPrimitives.ouvrirMenuConfiguration(page, version);

    const sel = getSelector(SECTION_CONFIGURATION.TOGGLE_MODE_SOMBRE, version);

    if (version === 'v1') {
      const toggle = page.locator(sel);
      await toggle.scrollIntoViewIfNeeded();
      const btn = toggle.locator('button[role="switch"]');
      const ariaChecked = await btn.getAttribute('aria-checked');
      if (ariaChecked !== 'true') {
        await btn.click();
      }
    } else {
      const toggle = page.locator(sel);
      await toggle.scrollIntoViewIfNeeded();
      const input = toggle.locator('input');
      const isChecked = await input.isChecked();
      if (!isChecked) {
        await toggle.click({ force: true });
      }
    }

    await page.waitForTimeout(500);
  }

  static async desactiverModeSombre(page: Page, version: Version): Promise<void> {
    await ConfigurationPrimitives.ouvrirMenuConfiguration(page, version);

    const sel = getSelector(SECTION_CONFIGURATION.TOGGLE_MODE_SOMBRE, version);

    if (version === 'v1') {
      const toggle = page.locator(sel);
      await toggle.scrollIntoViewIfNeeded();
      const btn = toggle.locator('button[role="switch"]');
      const ariaChecked = await btn.getAttribute('aria-checked');
      if (ariaChecked === 'true') {
        await btn.click();
      }
    } else {
      const toggle = page.locator(sel);
      await toggle.scrollIntoViewIfNeeded();
      const input = toggle.locator('input');
      const isChecked = await input.isChecked();
      if (isChecked) {
        await toggle.click({ force: true });
      }
    }

    await page.waitForTimeout(500);
  }

  static async verifierModeSombreActif(page: Page): Promise<void> {
    await ConfigurationPrimitives.ouvrirMenuConfiguration(page, 'v1');
    const btn = page.locator('mat-slide-toggle').locator('button[role="switch"]');
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toHaveAttribute('aria-checked', 'true');
  }

  static async verifierModeSombreInactif(page: Page): Promise<void> {
    await ConfigurationPrimitives.ouvrirMenuConfiguration(page, 'v1');
    const btn = page.locator('mat-slide-toggle').locator('button[role="switch"]');
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toHaveAttribute('aria-checked', 'false');
  }

  // Générer CV

  static async naviguerVersGenererCV(page: Page, version: Version): Promise<void> {
    if (version === 'v1') {
      const link = page.locator('.mat-sidenav a, .mat-sidenav span').filter({ hasText: 'Générer CV' });
      await link.scrollIntoViewIfNeeded();
      await link.click({ force: true });
    } else {
      await page.locator(getSelector(SECTION_CONFIGURATION.BTN_GENERER_CV, version)).click({ force: true });
    }

    await ConfigurationPrimitives.attendreChargement(page);
  }

  static async telechargerCV(page: Page, version: Version): Promise<void> {
    const panelSel = getSelector(SECTION_CONFIGURATION.PANEL_CV, version);

    if (version === 'v1') {
      const btn = page.locator(`${panelSel} button`).filter({ hasText: 'Télécharger le CV' });
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
    } else {
      await page.locator(getSelector(SECTION_CONFIGURATION.BTN_TELECHARGER_CV, version)).click({ force: true });
    }

    await ConfigurationPrimitives.attendreChargement(page);
  }

  static async verifierPageGenererCV(page: Page): Promise<void> {
    await expect(page.getByText('Télécharger le CV')).toBeAttached({ timeout: 10000 });
    await expect(page.getByText('Selected CV to Print')).toBeAttached({ timeout: 10000 });
  }

  static async verifierApercuCV(page: Page): Promise<void> {
    await expect(page.locator('div.panel-right')).toBeAttached({ timeout: 10000 });
    await expect(page.getByText('Selected CV to Print')).toBeAttached({ timeout: 10000 });
  }
}
