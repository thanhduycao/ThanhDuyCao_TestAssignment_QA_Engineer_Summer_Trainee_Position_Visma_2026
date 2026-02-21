import { Locator, Page } from '@playwright/test';

export class SearchResultPage {
	readonly productCards: Locator;
	readonly addToCartButton: Locator;

	constructor(private page: Page) {
		this.productCards = page.locator('article[data-product-id]');
		this.addToCartButton = page.locator('button').filter({ hasText: 'Lisää ostoskoriin' });
	}

	async addFirstProductToCart() {
		const firstProduct = this.productCards.nth(1).locator('a');
		await firstProduct.click();
		await this.page.waitForLoadState('networkidle');
		await this.addToCartButton.click();
		await this.page.waitForTimeout(1000);
	}
}
