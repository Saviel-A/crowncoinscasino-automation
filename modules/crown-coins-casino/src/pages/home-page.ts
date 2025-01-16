import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { LoginComponent } from '../components/login-component';
import { step } from '../fixtures/base';

export class HomePage extends BasePage {
  public name = "Playwright Page POM"

  private readonly loginBtn: Button;
  private readonly balance: Input;
  private readonly switchCoinTypeBtn: Button;
  readonly loginComponent: LoginComponent;

  constructor(page: Page) {
    super(page, 'Home Page');
    this.loginBtn = new Button({ page, locator: 'button[data-testid="lobby-login-btn"]', name: 'Login Button' });
    this.balance = new Input({ page, locator: '#gc_balance', name: 'Balance' });
    this.switchCoinTypeBtn = new Button({ page, locator: '.game-type-switcher-inner', name: 'Switch Coin Type Button' });
    this.loginComponent = new LoginComponent(page);
  }

  @step("Click the Login Button")
  async clickLoginBtn() {
    await this.loginBtn.click();
  }

  @step("Extract the Balance from the Home Page")
  async extractBalance(): Promise<string> {
    const text = await this.balance.getLocator().textContent();
    return text ?? '';
  }

  @step("Switch the Coin Type on the Home Page")
  async switchCoinType() {
    await this.switchCoinTypeBtn.click();
  }
}


