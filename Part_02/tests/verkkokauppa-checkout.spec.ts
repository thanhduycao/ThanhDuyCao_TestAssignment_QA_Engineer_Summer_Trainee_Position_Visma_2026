import { test } from '../fixtures/fixtures';
import dotenv from 'dotenv';
import path from 'path';
import { acceptCookies, fillAndLogin } from '../helpers/helpers';
import { checkoutData } from '../test-data/checkout.data';

dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('verkkokauppa.com - Checkout Process', () => {

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

  test('Search for computer product and proceed to checkout', async ({
    homePage,
    searchResultPage,
    productPage,
    checkoutPage
  }) => {
    const data = checkoutData.validOrder;

    // 1. Search for product
    await homePage.searchForProduct(data.searchQuery);

    // 2. Click on the first product and add to cart
    await searchResultPage.clickNthProduct(data.productIndex);
    await productPage.addProductToCart();

    const productPrice = await productPage.getProductPrice();

    // 3. Proceed to checkout
    await checkoutPage.proceedToCheckout();


    // 4. Fill in the shipping address
    await checkoutPage.fillShippingAddress(data.shippingAddress);

    // 5. Select shipping method
    await checkoutPage.selectShippingMethod(data.shippingMethod);

    // 6. Select payment method and confirm order
    await checkoutPage.selectPaymentMethod(data.paymentMethod);
    await checkoutPage.confirmOrder();

    // 7. Validate payment page is displayed
    await checkoutPage.verifyPaymentPageIsDisplayed();
  });

});