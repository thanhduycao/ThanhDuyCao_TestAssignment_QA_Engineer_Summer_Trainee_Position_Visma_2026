import { test, expect } from '../fixtures/fixtures';
import dotenv from 'dotenv';
import path from 'path';
import { acceptCookies } from '../helpers/helpers';
import { signUpData } from '../test-data/signup.data';

dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('verkkokauppa.com - Sign Up Process', () => {

  // No login in beforeEach - signup tests should start unauthenticated
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);
  });

  test('Sign up with valid data', async ({ page, signUpPage }) => {
    const data = signUpData.validUser;

    // 1. Navigate to the sign up page
    await page.goto('/fi/login/create?next=%2Ffi%2Faccount%2Fcustomer');

    // 2. Fill in the sign up form
    await signUpPage.fillSignUpForm(data);

    // 3. Submit the form
    await signUpPage.submitSignUpForm();

    // 4. Verify successful registration
    await page.waitForURL('/fi/account/customer');
  });

  test('Sign up with invalid email and password', async ({ page, signUpPage }) => {
    const data = signUpData.invalidUser;

    // 1. Navigate to the sign up page
    await page.goto('/fi/login/create?next=%2Ffi%2Faccount%2Fcustomer');

    // 2. Fill in the sign up form with invalid data
    await signUpPage.fillSignUpForm(data);

    // 3. Submit the form
    await signUpPage.submitSignUpForm();

    // 4. Verify error messages are displayed
    await expect(page.getByText('Sähköpostiosoite on virheellinen')).toBeVisible();
    await expect(page.getByText('Salasanan pituus on oltava vähintään 8 merkkiä')).toBeVisible();
  });

});