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

  test('Add a product to cart and increase the quantity by 1', async ({ page, productPage, checkoutPage }) => {
    // 1. Go to the product page
    await page.goto('/fi/product/988465/ASUS-ROG-Zephyrus-G14-GA403WP-QS005W-14-pelikannettava');

    const shoppingBasketCount = page.getByRole('button', { name: 'Tarkastele ostoskoria' }).innerText();
    const initialCount = parseInt(await shoppingBasketCount) || 0;

    // 2. Add the product to the cart
    await productPage.addProductToCart();
    const productPrice = await productPage.getProductPrice();

    // 3. Go to the cart
    await page.getByRole('button', { name: 'Tarkastele ostoskoria' }).click();
    await page.waitForTimeout(3000);

    // 4. Increase the quantity by 1
    await page.getByRole('button', { name: 'Lisää kappalemäärää' }).click();

    await page.waitForTimeout(3000);

    // 5. Verify the total price is updated correctly

    const count = await page.getByLabel('Syötä kappalemäärä').inputValue();

    const expectedTotalPrice = (parseFloat(productPrice!) * parseFloat(count)).toFixed(2);


    const actualTotalPrice = await page.locator('[data-price="current"]').last().innerText();

    const integerPart = await page.locator('[data-price="current"]').last().getAttribute('value');
    const decimalPart = await page.locator('[data-price="current"]').last().getAttribute('data-decimals');

    if (!integerPart || decimalPart === null) {
        throw new Error('Could not read price attributes from element');
    }

    const actualTotal = parseFloat(`${integerPart}.${decimalPart}`).toFixed(2);

    expect(actualTotal).toBe(expectedTotalPrice);
  });
});