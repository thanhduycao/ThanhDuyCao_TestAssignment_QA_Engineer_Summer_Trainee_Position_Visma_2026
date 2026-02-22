import { Locator, Page } from '@playwright/test';

export class SearchResultPage {
	readonly productCards: Locator;
	readonly addToCartButton: Locator;

	constructor(private page: Page) {
		this.productCards = page.locator('article[data-product-id]');
		this.addToCartButton = page.locator('button').filter({ hasText: 'Lisää ostoskoriin' });
	}

	async clickNthProduct(n: number) {
		const productLink = this.productCards.nth(n).locator('a');
		await productLink.click();
		await this.page.waitForLoadState('networkidle');
	}
}
