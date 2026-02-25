import { Page, Locator, expect } from '@playwright/test';
import { ShippingAddress } from '../types/types.ts';

export class CheckoutPage {
    readonly page: Page;
    readonly cartTotalPrice: Locator;
    readonly goToCheckoutLink: Locator;
    readonly goToCheckoutButton: Locator;
    readonly addNewAddressButton: Locator;
    readonly nameInput: Locator;
    readonly streetInput: Locator;
    readonly postalCodeInput: Locator;
    readonly cityInput: Locator;
    readonly phoneInput: Locator;
    readonly saveAddressButton: Locator;
    readonly chooseShippingButton: Locator;
    readonly choosePaymentButton: Locator;
    readonly confirmOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.goToCheckoutLink = page.getByRole('link', { name: 'Siirry kassalle' });
        this.goToCheckoutButton = page.getByRole('button', { name: 'Siirry kassalle' });
        this.addNewAddressButton = page.getByRole('button', { name: 'Lisää uusi' });
        this.nameInput = page.getByRole('textbox', { name: 'Nimi' });
        this.streetInput = page.getByRole('textbox', { name: 'Katuosoite', exact: true });
        this.postalCodeInput = page.getByRole('textbox', { name: 'Postinumero' });
        this.cityInput = page.getByRole('textbox', { name: 'Postitoimipaikka' });
        this.phoneInput = page.getByRole('textbox', { name: 'Matkapuhelinnumero' });
        this.saveAddressButton = page.getByRole('button', { name: 'Tallenna' });
        this.chooseShippingButton = page.getByRole('button', { name: 'Valitse toimitustapa' });
        this.choosePaymentButton = page.getByRole('button', { name: 'Valitse maksutapa' });
        this.confirmOrderButton = page.getByRole('button', { name: 'Vahvista tilaus' });
    }

    async proceedToCheckout() {
        await this.goToCheckoutLink.click();
        await this.goToCheckoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillShippingAddress(address: ShippingAddress) {
        await this.addNewAddressButton.click();
        await this.nameInput.fill(address.name);
        await this.streetInput.fill(address.street);
        await this.postalCodeInput.fill(address.postalCode);
        await this.cityInput.fill(address.city);
        await this.phoneInput.fill(address.phone);
        await this.saveAddressButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectShippingMethod(shippingMethodName: string) {
        await this.chooseShippingButton.click();
        await this.page.getByText(shippingMethodName).click();
        await this.page.waitForLoadState('networkidle');
    }

    async selectPaymentMethod(paymentMethodName: string) {
        await this.choosePaymentButton.click();
        await this.page.getByText(paymentMethodName).click();
        await this.page.waitForLoadState('networkidle');
    }

    async confirmOrder() {
        await this.confirmOrderButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyPaymentPageIsDisplayed() {
        await expect(this.page).toHaveURL(/.*payment.*/i);
    }
}