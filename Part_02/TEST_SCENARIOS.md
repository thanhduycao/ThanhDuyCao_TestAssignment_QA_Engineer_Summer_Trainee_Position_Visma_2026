# Part 02: Additional Test Scenarios for verkkokauppa.com

## Overview
This document describes 3 additional automated test scenarios for verkkokauppa.com, explaining what each test does and why automation provides value.

---

## Test Scenario 1: Checkout and Payment

### Test Case 1: Search for a product and checkout with correct path
**Preconditions:**

- User is logged in
- Cart is empty
- Payment gateway is up

**Steps:**
1. Open the website and search for "Computer".
2. Select the first product from the results and click on it for more details.
3. Click "Add to cart" button.
3. Click "Proceed to checkout" button.
4. Verity the product information.
5. Click "Proceed to checkout" button.
6. Add new recipient.
7. Click "Choose a delivery method" button.
8. Select delivery method.
9. Click "Choose a payment method" button.
10. Select payment method.
11. Click "Confirm payment".
12. Verify the url link to be payment page.


### Why Automate This?
This test cover the critical user journey of verkkokauppa.com ecommerce website where every user who want to buy product need to go through. By automate this, we can make sure that the website function correctly for this critical use case, which definitely affect the revenue of the company. Moreover, by automating this flow, we can make sure that whenever there is new features, we can automatically implement this test through CI/CD to automatically check for this critical journey to make sure it is still correct without error for any changes in the related feature within the new release.

---

## Test Scenario 2: Shopping Cart Operations

### Test Case 1: Add a product to cart

**Preconditions:**

- User is logged in
- On the product detail page

**Steps:**

1. Click "Add to cart"
2. Observe shopping basket

**Expected Result:**

- Shopping basket increments to "1"
- Product added successfully

---

### Test Case 2: Remove product from cart

**Preconditions:**

- User is logged in
- At least 1 item in cart

**Steps:**

1. Navigate to cart page
2. Click "Remove" on an item
3. Observe shopping basket

**Expected Result:**

- Product remove from cart
- Cart badge decrements
- If cart empty, "Your car is empty" message shown


### Why Automate This?
This test cover the features that can potentially prone to error in the website. By automting this with multiple test cases like add one item to cart, delete item, we can make sure this function is correct.

---

## Test Scenario 3: Account Signup
### Test Case 1: Create an account with valid information

**Steps:**

1. Navigate to the signup page.
2. Fill in the valid email address.
3. Fill in the valid password.
4. Fill in first name.
5. Fill in last name.
6. Fill in valid mobile number.
7. Choose Language of business: "English".
8. Check the Terms and Conditions and Privacy Policy checkbox.
9. Verify that the sign up is success.

**Expected Result:**

- The account is created successfully
- Redirect to account customer page

### Test Case 2: Create an account with invalid information

**Steps:**

1. Navigate to the signup page.
2. Fill in the invalid email address.
3. Fill in the invalid password.
4. Fill in first name.
5. Fill in last name.
6. Fill in valid mobile number.
7. Choose Language of business: "English".
8. Check the Terms and Conditions and Privacy Policy checkbox.

**Expected Result:**

- The account is created successfully
- Redirect to account customer page

### Why Automate This?
This test covers the critical user journey as every user need to sign up before they can start to have the account for later use and it has form filling. Moreover, for form filling, we can have multiple scenario that we can have to test for the input and therefore, automated it with be faster and reduce time comparing to manual input different kinds of scenario (the number of test will depend on the number of input field permutation).

---
