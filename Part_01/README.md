# Part 1: Core Test Automation (Required)

## Overview
This project contains automated end-to-end tests for Verkkokauppa.com using Playwright and TypeScript.

## Prerequisites
- Node.js (LTS version recommended)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

### Environment Variables
The base URL can be configured using the `BASE_URL` environment variable.

Create a `.env` file in the root directory:
```
BASE_URL=https://www.verkkokauppa.com
```

Or set it when running tests:
```bash
BASE_URL=https://www.verkkokauppa.com npx playwright test
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run a specific test file
```bash
npx playwright test verkkokauppa.spec.ts
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

## View Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Project Structure
```
Part_01/
├── tests/
│   └── verkkokauppa.spec.ts    # Test specifications
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies
├── .env                         # Environment variables
└── README.md                    
```

## Test Coverage
- Search functionality for "Nikon" products
- Sorting products by price (descending)
- Navigation to product details page
- Verification of product information

## CI/CD
The tests can be run in GitHub Actions. See `.github/workflows/playwright.yml` for the pipeline configuration.

## Browser Support
- Chromium
- Firefox
- WebKit (Safari)
