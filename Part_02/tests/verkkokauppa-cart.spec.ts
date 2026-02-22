import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures';
import dotenv from 'dotenv';
import path from 'path';
import { acceptCookies, fillAndLogin } from '../helpers/helpers';

dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('verkkokauppa.com - Shopping Cart Operations', () => {

  test.beforeAll(() => {
    if (!process.env.USERNAME || !process.env.PASSWORD) {
      throw new Error('USERNAME and PASSWORD environment variables are required.');
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);
    await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
    await fillAndLogin(page, process.env.USERNAME!, process.env.PASSWORD!);
  });

  test('Add product to cart', async ({ page, productPage }) => {
    // 1. Go to the product page
    await page.goto('/fi/product/988465/ASUS-ROG-Zephyrus-G14-GA403WP-QS005W-14-pelikannettava');

    const shoppingBasketCount = page.getByRole('button', { name: 'Tarkastele ostoskoria' }).innerText();
    const initialCount = parseInt(await shoppingBasketCount) || 0;

    // 2. Add the product to the cart
    await productPage.addProductToCart();

    // 3. Verify shopping basket count increase by 1
    await expect(page.getByRole('button', { name: 'Tarkastele ostoskoria' })).toHaveText((initialCount + 1).toString());
  });

  test('Remove product from cart', async ({ page }) => {
    // 1. Go to the cart page
    await page.goto('/fi/cart');

    // 2. Click "Remove" on an item
    await page.getByRole('button', { name: 'Poista tuote' }).click();

    // 3. Verify the cart is empty
    await expect(page.getByText('Tuote poistettu ostoskorista')).toBeVisible();
  });

});