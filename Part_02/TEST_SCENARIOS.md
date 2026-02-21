# Part 02: Additional Test Scenarios for verkkokauppa.com

## Overview
This document describes 4 additional automated test scenarios for verkkokauppa.com, explaining what each test does and why automation provides value.

---

## Test Scenario 1: Checkout Operations

### Description
This test verifies the checkout feature by:
1. Search for a product
2. Add the product to cart
3. Proceed to checkout
4. Perform multiple steps (checking basket, recipient, delivery method, payment method)
5. Complete checkout order


### Why Automate This?
This test cover the critical user journey of verkkokauppa.com ecommerce website where every user who want to buy product need to go through. By automate this, we can make sure that the website function correctly for this critical use case, which definitely affect the revenue of the company. Moreover, by automating this flow, we can make sure that whenever there is new features, we can automatically implement this test through CI/CD to automatically check for this critical journey to make sure it is still correct without error for any changes in the related feature within the new release.

---

## Test Scenario 2: Shopping Cart Operations

### Description
This test validates core shopping cart functionality:
- Adding single and multiple products to the cart
- Updating product quantities in the cart
- Removing items from the cart
- Verifying cart totals calculate correctly

### Why Automate This?
This test cover the features that can potentially prone to error in the website. By automting this with multiple test cases like add one item to cart, add multiple item to cart, or add and delete item, we can make sure this function is correct.

---

## Test Scenario 3: Product Category Navigation & Filtering

### Description
This test covers product discovery and filtering:
- Search for a product
- Navigating through category hierarchy (main categories → subcategories)
- Verifying correct products load for each category
- Applying filters (price range, brand, availability)
- Combining multiple filters
- Verify correct products count after filtering

### Why Automate This?
This test cover the features that need intensive repetitive checking of the expectation filter. 

---

## Test Scenario 4: Account Signup


### Description
This test covers account signup procedure:
- Go to create account
- Fill in the information
- Send information

### Why Automate This?
This test covers the critical user journey as every user need to sign up before they can start to have the account for later use and it has form filling. Moreover, for form filling, we can have multiple scenario that we can have to test for the input and therefore, automated it with be faster and reduce time comparing to manual input different kinds of scenario (the number of test will depend on the number of input field permutation).

---

## Implementation Notes
- All tests use Playwright with TypeScript
- Tests are data-driven where possible to maximize coverage
- Each test includes proper assertions and error handling
- Tests are designed to be maintainable and readable
