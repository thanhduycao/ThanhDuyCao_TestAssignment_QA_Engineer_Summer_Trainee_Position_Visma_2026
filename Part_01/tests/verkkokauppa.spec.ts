import { test, expect } from '@playwright/test';

test('Search Nikon product and verify product name', async ({ page }) => {
    // Open the website
    await page.goto('/');

    // Cookie handling
    await page.getByRole('button', { name: 'Hyväksy kaikki' }).click();

    // Fill the search box with "Nikon" and click search button
    await page.getByRole('combobox', { name: 'Hae kaupasta' }).click();
    await page.getByRole('combobox', { name: 'Hae kaupasta' }).fill('Nikon');

    // Click the filter dropdown and select "The most expensive"
    await page.getByRole('button', { name: 'Etsi' }).click();
    await page.getByLabel('Tuotteiden järjestys').selectOption('price:desc');

    // Get list of products
    const products = page.locator('article[data-product-id]');
    
    // Get second product and the <a> element inside it
    const secondProduct = products.nth(1).locator('a');
    
    // Click on the second product
    await secondProduct.click();

    // Assert that the product page contains "Nikon Z30" in the heading
    await expect(page.getByRole('heading', {level: 1})).toContainText('Nikon Z30');
});