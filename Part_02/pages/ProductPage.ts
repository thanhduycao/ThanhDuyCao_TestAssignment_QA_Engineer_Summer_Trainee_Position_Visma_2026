import { expect, Locator, Page } from '@playwright/test';

export class ProductPage {
    readonly productTitle: Locator;
    productPriceValue: Promise<string | null> | null = null;
    productPriceDecimals: Promise<string | null> | null = null;
    productPrice: Promise<string | null> | null = null;
    readonly addToCartButton: Locator;

    constructor(private page: Page) {
        this.productTitle = page.getByRole('heading', {level: 1});
        this.addToCartButton = page.getByRole('button', { name: 'Lisää ostoskoriin' }).first();
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

    async addProductToCart() {
        await this.addToCartButton.click();
    }

    async getProductPrice(): Promise<string | null> {
        this.productPriceValue = this.page.locator('[data-price="current"]').first().getAttribute("data-integer");
        this.productPriceDecimals = this.page.locator('[data-price="current"]').first().getAttribute("data-decimals");
        
        const decimals = await this.productPriceDecimals;
        const value = await this.productPriceValue;
        
        if (decimals && value) {
            return `${value},${decimals}`;
        }
        return value;
    }
}