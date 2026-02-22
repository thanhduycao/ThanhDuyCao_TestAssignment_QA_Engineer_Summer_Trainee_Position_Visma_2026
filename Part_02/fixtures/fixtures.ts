import { test as base } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { ProductPage } from '../pages/ProductPage';
import { SignUpPage } from '../pages/SignUpPage';

// Define the type for your fixtures
type Pages = {
    checkoutPage: CheckoutPage;
    homePage: HomePage;
    searchResultPage: SearchResultPage;
    productPage: ProductPage;
    signUpPage: SignUpPage;
};

// Extend the base test with your page objects
export const test = base.extend<Pages>({
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    searchResultPage: async ({ page }, use) => {
        await use(new SearchResultPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    signUpPage: async ({ page }, use) => {
        await use(new SignUpPage(page));
    }
});

export { expect } from '@playwright/test';