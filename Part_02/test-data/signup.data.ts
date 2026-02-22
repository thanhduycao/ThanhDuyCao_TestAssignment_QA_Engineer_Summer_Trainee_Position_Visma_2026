export interface SignUpSchema {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    language: string;
    isCreateCorporateAccount: boolean;
    isAcceptTerms: boolean;
    isReceiveMessage: boolean;
}

export interface SignUpData {
    validUser: SignUpSchema;
    invalidUser: SignUpSchema;
}

export const signUpData: SignUpData = {
    validUser: {
        email: 'thanhduycao1302@gmail.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '0449508299',
        language: 'en',
        isCreateCorporateAccount: false,
        isAcceptTerms: true,
        isReceiveMessage: false
    },
    invalidUser: {
        email: 'invalid-email',
        password: '123',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '0449508299',
        language: 'fi',
        isCreateCorporateAccount: false,
        isAcceptTerms: true,
        isReceiveMessage: false
    }
};