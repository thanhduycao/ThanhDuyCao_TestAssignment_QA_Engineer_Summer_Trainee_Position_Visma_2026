# Part 02: Additional Test Scenarios

This folder contains 3 additional automated test scenarios for verkkokauppa.com e-commerce site.

## 📁 File Structure

```
Part_02/
├── tests/
│   ├── verkkokauppa-additional.spec.ts   # 3 automated test scenarios
│   └── example.spec.ts                    # Playwright demo (can be removed)
├── TEST_SCENARIOS.md                      # Detailed documentation of each scenario
├── playwright.config.ts                   # Playwright configuration
├── package.json                           # Dependencies
└── README.md                              # This file
```

## 📝 Test Details

Each test scenario includes:
1. **Description**: What the test validates
2. **Justification**: Why automation provides value
3. **Implementation**: Automated Playwright test

See [TEST_SCENARIOS.md](TEST_SCENARIOS.md) for detailed documentation.

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Navigate to Part_02 folder:
```bash
cd Part_02
```

2. Install dependencies:
```bash
npm install
```

### Running Tests

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/verkkokauppa-cart.spec.ts
npx playwright test tests/verkkokauppa-checkout.spec.ts
npx playwright test tests/verkkokauppa-signup.spec.ts
```

Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

Run specific test scenario:
```bash
npx playwright test -g "Product Search"
```

Run with UI mode (interactive):
```bash
npx playwright test --ui
```

### View Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## 🔧 Configuration

The tests are configured to run on:
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

You can modify browser configurations in `playwright.config.ts`.


<!-- ## 🎯 Key Testing Principles Applied

- **Page Object Pattern**: Tests use robust locators that can handle site changes
- **Resilient Selectors**: Multiple fallback selectors for better stability
- **Proper Waits**: Uses `waitForLoadState` and Playwright auto-waiting
- **Error Handling**: Graceful handling of dynamic elements (cookie banners, etc.)
- **Assertions**: Clear expectations with meaningful error messages -->

## 🔍 Running Tests in CI/CD

The `.github/workflows/playwright.yml` file configures GitHub Actions to:
- Run tests on every push/PR
- Test across multiple browsers
- Generate and upload test reports
- Fail the build if tests fail

<!-- ## 📊 What Makes These Good Automation Candidates?

✅ **High business value** - Core e-commerce functionality  
✅ **Frequently used** - Features users interact with constantly  
✅ **Regression prone** - Areas that break with backend/frontend changes  
✅ **Repetitive to test manually** - Time-consuming manual testing  
✅ **Fast feedback** - Catches issues before they reach users  
✅ **Data-driven potential** - Easy to expand with more test data

## 🐛 Troubleshooting

If tests fail:
1. Check that verkkokauppa.com is accessible
2. Verify site structure hasn't changed (selectors may need updates)
3. Run with `--headed` to see what's happening
4. Use `--debug` for step-by-step debugging

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices for E-commerce Testing](https://playwright.dev/docs/best-practices)
- [Part 01](../Part_01/) - Initial test implementation -->
