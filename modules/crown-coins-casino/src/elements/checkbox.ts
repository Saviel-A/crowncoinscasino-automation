import { test } from '@playwright/test';
import { LocatorProps } from '../types/base-element';
import { BaseElement } from './base-element';
import { generateScreenshot } from '../utils/screenshot-generator';

export class Checkbox extends BaseElement {
    get typeOf(): string {
        return 'checkbox';
    }

    async check(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Checking the ${this.typeOf} with name "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.check({ timeout: this.timeoutForWait });
            await generateScreenshot(this.page, 'check');
        });
    }

    async uncheck(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Unchecking the ${this.typeOf} with name "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.uncheck({ timeout: this.timeoutForWait });
            await generateScreenshot(this.page, 'uncheck');
        });
    }

    async isChecked(locatorProps: LocatorProps = {}): Promise<boolean> {
        const locator = this.getLocator(locatorProps);
        const isChecked = await locator.isChecked({ timeout: this.timeoutForWait });
        await generateScreenshot(this.page, 'isChecked');
        return isChecked;
    }
}