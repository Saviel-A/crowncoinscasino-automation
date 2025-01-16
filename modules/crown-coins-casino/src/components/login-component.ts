import { Page } from '@playwright/test';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { User } from '../types/user';
import { step } from '../fixtures/base';

export class LoginComponent {
    private readonly emailInput: Input;
    private readonly passwordInput: Input;
    private readonly loginButton: Button;

    constructor(page: Page) {
        this.emailInput = new Input({ page, locator: 'input[name="email"]', name: 'Email Input' });
        this.passwordInput = new Input({ page, locator: 'input[name="password"]', name: 'Password Input' });
        this.loginButton = new Button({ page, locator: 'button[type="submit"]', name: 'Login Button' });
    }

    @step("Login to the Home Page")
    async login(user: User) {
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        await this.loginButton.click();
    }
}
