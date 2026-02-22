import { Page } from '@playwright/test';


export async function acceptCookies(page: Page) {
  try {
    const cookieButton = page.getByRole('button', { name: 'Hyväksy kaikki' });
    // Wait for the button with a short timeout, if it doesn't appear, skip it
    await cookieButton.waitFor({ state: 'visible', timeout: 5000 });
    await cookieButton.click();
  } catch {
    // Cookie banner did not appear, continue test
    console.log('Cookie banner not found, skipping...');
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
