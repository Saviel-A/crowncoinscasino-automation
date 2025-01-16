import { Page } from '@playwright/test';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { step } from '../fixtures/base';

export class MyProfileComponent {
    private readonly myProfileUsername: Input;
    private readonly editProfileBtn: Button;
    private readonly closePopupBtn: Button;

    constructor(page: Page) {
        this.myProfileUsername = new Input({ page, locator: 'div[data-testid="my-profile-nickname"]', name: 'Username Profile' });
        this.editProfileBtn = new Button({ page, locator: 'div[data-testid="profileInfoDialog"] img[alt="avatar"]', name: 'Edit Profile Button' });
        this.closePopupBtn = new Button({ page, locator: 'div[data-testid="profileInfoDialog"]', name: 'Close Profile Popup' });
    }

    @step("Click on 'Edit Profile' button")
    async editProfile() {
        await this.editProfileBtn.click();
    }

    @step("Extract username from profile")
    async extractUsername(): Promise<string> {
        const text = await this.myProfileUsername.getLocator().textContent();
        return text ?? '';
    }

    @step("Close the profile popup")
    async closeMyProfilePopup() {
        await this.closePopupBtn.click();
    }
}
