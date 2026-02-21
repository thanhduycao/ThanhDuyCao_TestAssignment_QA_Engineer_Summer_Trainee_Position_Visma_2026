import { Locator, Page } from '@playwright/test';

export class HomePage {
    readonly cookieButton: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;

    constructor(private page: Page) {
        this.cookieButton = page.locator('button:has-text("Hyväksy kaikki")');
        this.searchBox = page.getByRole('combobox', { name: 'Hae kaupasta' });
        this.searchButton = page.getByRole('button', { name: 'Etsi' });
    }

    async navigateToHomePage() {
        await this.page.goto('https://www.verkkokauppa.com/');
    }

    async acceptCookies() {
        if (await this.cookieButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await this.cookieButton.click();
        await this.page.waitForTimeout(500);
        }
    }

    async searchForProduct(productName: string) {
        await this.searchBox.click();
        await this.searchBox.fill(productName);
        await this.searchButton.click();
    }

}