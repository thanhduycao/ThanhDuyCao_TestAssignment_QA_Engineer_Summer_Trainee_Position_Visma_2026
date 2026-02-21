import { expect, Locator, Page } from '@playwright/test';

export class ProductPage {
    readonly productTitle: Locator;
    readonly productPriceValue: Promise<string | null>;
    readonly productPriceDecimals: Promise<string | null>;;
    readonly productPrice: Promise<string | null>;
    readonly addToCartButton: Locator;

    constructor(private page: Page) {
        this.productTitle = page.getByRole('heading', {level: 1});
        this.productPriceValue = page.locator('[data-price="current"]').getAttribute("data-integer");
        this.productPriceDecimals = page.locator('[data-price="current"]').getAttribute("data-decimals");
        this.productPrice = this.productPriceDecimals.then(decimals => {
            if (decimals) {
                return this.productPriceValue.then(value => value ? `${value}.${decimals}` : null);
            }
            return this.productPriceValue;
        });
        this.addToCartButton = page.locator('button').filter({ hasText: 'Lisää ostoskoriin' });
    }

    async verifyProductTitle(expectedTitle: string) {
        await expect(this.productTitle).toContainText(expectedTitle);
    }

    async verifyProductPrice(expectedPrice: string) {
        const priceValue = await this.productPriceValue;
        const priceDecimals = await this.productPriceDecimals;
        const fullPrice = priceDecimals ? `${priceValue}.${priceDecimals}` : priceValue;
        expect(fullPrice).toBe(expectedPrice);
    }

    async addToCart() {
        await this.addToCartButton.click();
    }
}