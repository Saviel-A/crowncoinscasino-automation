import { test } from '@playwright/test';
import { LocatorProps } from '../types/base-element';
import { BaseElement } from './base-element';
import { generateScreenshot } from '../utils/screenshot-generator';

export class Button extends BaseElement {
    get typeOf(): string {
        return 'button';
    }

    async click(locatorProps: LocatorProps = {}, force: boolean = false): Promise<void> {
        await test.step(`Clicking the ${this.typeOf} with name "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            const userAgent = await this.page.evaluate(() => navigator.userAgent);
            const hasTouch = await this.page.evaluate(() => 'ontouchstart' in window);
            if (userAgent.includes('Mobile') && hasTouch) {
                await locator.tap({ timeout: this.timeoutForWait, force: force });
            } else {
                await locator.click({ timeout: this.timeoutForWait, force: force });
            }
            await generateScreenshot(this.page, 'click');
        });
    }

    async doubleClick(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Double clicking the ${this.typeOf} with name "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.dblclick({ timeout: this.timeoutForWait });
            await generateScreenshot(this.page, 'double click');
        });
    }

    async hover(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Hovering over the ${this.typeOf} with name "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.hover({ timeout: this.timeoutForWait });
            await generateScreenshot(this.page, 'hover');
        });
    }
}