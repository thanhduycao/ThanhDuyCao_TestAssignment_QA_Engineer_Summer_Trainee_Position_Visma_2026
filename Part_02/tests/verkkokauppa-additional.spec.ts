import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { acceptCookies, fillAndLogin } from '../helpers/helpers';
import { CheckoutPage, ShippingAddress } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { SearchResultPage } from '../pages/SearchResultPage';
dotenv.config({ path: path.resolve(__dirname, '.env') });



test.describe('verkkokauppa.com - Additional Test Scenarios', () => {
  
  // Environment variables validation
  test.beforeAll(() => {
    if (!process.env.USERNAME || !process.env.PASSWORD) {
      throw new Error('USERNAME and PASSWORD environment variables are required. See .env.example for setup.');
    }
  });
  
  // This hook runs before each test to handle cookies and login
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.verkkokauppa.com/');
    await acceptCookies(page);
    await page.getByRole('button', { name: 'Kirjaudu sisään' }).click();
    await fillAndLogin(page, process.env.USERNAME!, process.env.PASSWORD!);
  });
  
  // ============================================================
  // Test Scenario 1: Checkout Process
  // ============================================================
  
  test.describe('Checkout Process', () => {
    
    test('Search for computer product and proceed to checkout', async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      const homePage = new HomePage(page);
      const searchResultPage = new SearchResultPage(page);

      // 1. Search for "computer"
      await homePage.searchForProduct('computer');

      // 2. Click on the first product and add to cart
      await searchResultPage.addFirstProductToCart();

      // 3. Proceed to checkout
      await checkoutPage.proceedToCheckout();

      // 4. Fill in the shipping address with test data
      const testAddress: ShippingAddress = {
        name: 'Test User',
        street: 'Testikatu 1',
        postalCode: '20540',
        city: 'TURKU',
        phone: '0449508299'
      };
      await checkoutPage.fillShippingAddress(testAddress);

      // 5. Select shipping method
      await checkoutPage.selectShippingMethod('Matkahuolto Pakettiautomaatti, S-Market Halinen');

      // 6. Select payment method and complete order
      await checkoutPage.selectPaymentMethod('Verkkopankki');
      await checkoutPage.confirmOrder();

    //   // 7. Validate order confirmation
    //   await expect(page).toHaveURL(/.*tilaus.*|.*confirmation.*|.*success.*/i);
    });
    
  });
  
  // ============================================================
  // Test Scenario 2: Shopping Cart Operations
  // ============================================================
  
  test.describe('Shopping Cart Operations', () => {
    
    test('Add and remove product from cart', async ({ page }) => {
      
    });
    
    test('Add multiple products to cart', async ({ page }) => {
      
    });
    
    test('Update product quantity in cart', async ({ page }) => {
      
    });
    
  });
  
  // ============================================================
  // Test Scenario 3: Product Category Navigation & Filtering
  // ============================================================
  
  test.describe('Product Category Navigation & Filtering', () => {
    
    test('Navigate through product categories and verify products display', async ({ page }) => {
      
    });
    
    test('Apply filters to product listing', async ({ page }) => {
           
    });
    
  });
  
});
