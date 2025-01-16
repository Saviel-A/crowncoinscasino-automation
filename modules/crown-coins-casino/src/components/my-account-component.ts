import { Page } from '@playwright/test';
import { Button } from '../elements/button';
import { step } from '../fixtures/base';

export class MyAccountComponent {
    private readonly myProfileBtn: Button;
    private readonly closeMyAccountBtn: Button;

    constructor(page: Page) {
        this.myProfileBtn = new Button({ page, locator: 'role=button[name="MY PROFILE"]', name: 'My Profile Button' });
        this.closeMyAccountBtn = new Button({ page, locator: 'button[data-testid="closeButton"]', name: 'Close My Account Button' });
    }

    @step("Click on 'My Profile' button")
    async clickOnMyProfile() {
        await this.myProfileBtn.click();
    }

    @step("Close My Account popup")
    async closeMyAccountPopup() {
        await this.closeMyAccountBtn.getLocator().first().click();
    }
}
