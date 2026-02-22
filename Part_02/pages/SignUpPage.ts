import { expect } from '@playwright/test';
import { Locator, Page } from '@playwright/test';
import { SignUpSchema } from '../test-data/signup.data.ts';

export class SignUpPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly languageSelect: Locator;
    readonly createCorporateAccountCheckbox: Locator;
    readonly acceptTermsCheckbox: Locator;
    readonly receiveMessageCheckbox: Locator;
    readonly signUpButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Sähköpostiosoite' });
        this.passwordInput = page.getByRole('textbox', { name: 'Salasana' });
        this.firstNameInput = page.getByRole('textbox', { name: 'Etunimi' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Sukunimi' });
        this.phoneNumberInput = page.getByRole('textbox', { name: 'Matkapuhelinnumero' });
        this.languageSelect = page.getByLabel('Asiointikieli*');
        this.createCorporateAccountCheckbox = page.locator('label').filter({ hasText: 'Haluan luoda yritysasiakkuuden' });
        this.acceptTermsCheckbox = page.locator('#ppc-and-tos-accepted + span');
        this.receiveMessageCheckbox = page.locator('label').filter({ hasText: 'Haluan vastaanottaa' });
        this.signUpButton = page.getByRole('button', { name: 'Lähetä tiedot' });
    }

    async fillSignUpForm(data: SignUpSchema) {
        await this.emailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.phoneNumberInput.fill(data.phoneNumber);
        await this.languageSelect.selectOption(data.language);

        if (data.isCreateCorporateAccount) {
            await this.createCorporateAccountCheckbox.click();
        }
        if (data.isAcceptTerms) {
            // Scroll to the accept terms checkbox before clicking
            await this.acceptTermsCheckbox.scrollIntoViewIfNeeded();
            await this.acceptTermsCheckbox.click();
        }
        if (data.isReceiveMessage) {
            await this.receiveMessageCheckbox.click();
        }
    }

    async submitSignUpForm() {
        await this.signUpButton.click();
    }

    async signUp(data: SignUpSchema) {
        await this.fillSignUpForm(data);
        await this.submitSignUpForm();
    }
}