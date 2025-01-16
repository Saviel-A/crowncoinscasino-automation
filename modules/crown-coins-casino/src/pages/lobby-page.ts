import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Button } from '../elements/button';
import { MyAccountComponent } from '../components/my-account-component';
import { EditProfileComponent } from '../components/edit-profile-component';
import { MyProfileComponent } from '../components/my-profile-component';
import { step } from '../fixtures/base';

export class LobbyPage extends BasePage {
    readonly myAccountComponent: MyAccountComponent;
    readonly editProfileComponent: EditProfileComponent;
    readonly myProfileComponent: MyProfileComponent;
    private readonly subscribeButton: Button;
    private readonly remindSubscriptionLaterBtn: Button;
    private readonly menuBtn: Button;
    private readonly myAccountBtn: Button;

    constructor(page: Page) {
        super(page, 'Lobby Page');
        this.myAccountComponent = new MyAccountComponent(page);
        this.editProfileComponent = new EditProfileComponent(page);
        this.myProfileComponent = new MyProfileComponent(page);
        this.subscribeButton = new Button({ page, locator: '#onesignal-slidedown-allow-button', name: 'Subscribe Button' });
        this.remindSubscriptionLaterBtn = new Button({ page, locator: '#onesignal-slidedown-cancel-button', name: 'Remind Subscription Later Button' });
        this.menuBtn = new Button({ page, locator: 'button[data-testid="menuButton"]', name: 'Menu Button' });
        this.myAccountBtn = new Button({ page, locator: 'role=button[name="My Account"]', name: 'My Account Button' });
    }

    @step("Subscribe to the lobby")
    async subscribeToLobby() {
        await this.subscribeButton.click();
    }

    @step("Remind subscription later")
    async remindSubscriptionLater() {
        await this.remindSubscriptionLaterBtn.click();
    }

    @step("Open the menu")
    async openMenu() {
        await this.menuBtn.click();
    }

    @step("Click on 'My Account' button")
    async clickOnMyAccount() {
        await this.myAccountBtn.click();
    }
}
