import { Page } from '@playwright/test';
import { Input } from '../elements/input';
import { Button } from '../elements/button';
import { logger } from '../utils/logger';
import { step } from '../fixtures/base';

export class EditProfileComponent {
    private readonly usernameInput: Input;
    private readonly avatarImage: Button;
    private readonly closeEditProfilePopupBtn: Button;
    private readonly applyBtn: Button;

    constructor(page: Page) {
        this.usernameInput = new Input({ page, locator: 'input[data-testid="nicknameInput"]', name: 'Username Input' });
        this.avatarImage = new Button({ page, locator: 'div._avatarImage_nil5y_88', name: 'Avatar Image' });
        this.closeEditProfilePopupBtn = new Button({ page, locator: 'button[data-testid="closeButton"]', name: 'Close Edit Profile Popup' });
        this.applyBtn = new Button({ page, locator: 'button.button--main >> text=Apply', name: 'Apply Button' });
    }

    // Step for filling username
    @step("Fill the username in the profile edit form")
    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    @step("Select a random avatar")
    async selectRandomAvatar(): Promise<void> {
        const avatarCount = await this.avatarImage.getLocatorCount();

        if (avatarCount > 0) {
            const randomIndex = Math.floor(Math.random() * avatarCount);
            const randomAvatar = this.avatarImage.getLocator().nth(randomIndex);
            await randomAvatar.click();
        } else {
            logger.error('No avatars found on the page');
            throw new Error('No avatars found on the page');
        }
    }

    @step("Apply the changes made to the profile")
    async applyChanges() {
        await this.applyBtn.click();
    }

    @step("Close the edit profile popup")
    async closeEditProfilePopup() {
        await this.closeEditProfilePopupBtn.getLocator().first().click();
    }
}
