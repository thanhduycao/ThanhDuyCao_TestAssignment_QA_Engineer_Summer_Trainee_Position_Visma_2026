import { Page } from '@playwright/test';


export async function acceptCookies(page: Page) {
  const cookieButton = page.locator('button:has-text("Hyv\u00e4ksy kaikki")');
  if (await cookieButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cookieButton.click();
    await page.waitForTimeout(500);
  }
}


export async function fillAndLogin(page: Page, email: string, password: string) {
  try {
    await page.getByRole('textbox', { name: 'S\u00e4hk\u00f6postiosoite' }).click();
    await page.getByRole('textbox', { name: 'S\u00e4hk\u00f6postiosoite' }).fill(email);
    await page.getByRole('textbox', { name: 'Salasana' }).click();
    await page.getByRole('textbox', { name: 'Salasana' }).fill(password);
    await page.locator('#login-form').getByRole('button', { name: 'Kirjaudu sis\u00e4\u00e4n' }).click();
    await page.waitForLoadState('networkidle');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
