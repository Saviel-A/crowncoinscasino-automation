import test, { expect } from '@playwright/test';
import { LocatorProps } from "../types/base-element";
import { BaseElement } from "./base-element";
import { generateScreenshot } from '../utils/screenshot-generator';

type FillProps = { validateValue?: boolean } & LocatorProps;

export class Input extends BaseElement {
    get typeOf(): string {
        return 'input';
    }

    async fill(value: string, fillProps: FillProps = {}): Promise<void> {
        const { validateValue, ...locatorProps } = fillProps;
        await test.step(`Fill ${this.typeOf} "${this.browserElementName}" to value "${value}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.fill(value, { timeout: this.timeoutForWait });

            if (validateValue) {
                await this.shouldHaveValue(value, locatorProps);
            }
            await generateScreenshot(this.page, 'fill');
        });
    }

    async type(value: string, fillProps: FillProps = {}): Promise<void> {
        const { validateValue, ...locatorProps } = fillProps;
        await test.step(`Type ${this.typeOf} "${this.browserElementName}" to value "${value}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.clear();
            await locator.pressSequentially(value, { timeout: this.timeoutForWait });

            if (validateValue) {
                await this.shouldHaveValue(value, locatorProps);
            }
            await generateScreenshot(this.page, 'type');
        });
    }

    async focus(fillProps: FillProps = {}): Promise<void> {
        const { ...locatorProps } = fillProps;
        await test.step(`Focus on ${this.typeOf} "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.focus();
            await generateScreenshot(this.page, 'focus');
        });
    }

    async shouldHaveValue(value: string, locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Checking that ${this.typeOf} "${this.browserElementName}" has a value "${value}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await expect(locator).toHaveValue(value, { timeout: this.timeoutForWait });
            await generateScreenshot(this.page, 'shouldHaveValue');
        });
    }
}