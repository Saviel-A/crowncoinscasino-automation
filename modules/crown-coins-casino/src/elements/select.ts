import test from "@playwright/test";
import { LocatorProps } from "../types/base-element";
import { BaseElement } from "./base-element";
import { generateScreenshot } from '../utils/screenshot-generator';

export class Select extends BaseElement {
    get typeOf(): string {
        return 'select';
    }

    async selectByValue(value: string, locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Select the ${this.typeOf} with name ${this.browserElementName} by value ${value}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.selectOption(value, { timeout: this.timeoutForWait });
            await generateScreenshot(this.page, 'selectByValue');
        });
    }

    async getAllSelectOptions(locatorProps: LocatorProps = {}): Promise<{ value: string; text: string }[]> {
        const locator = this.getLocator(locatorProps);
        const options = await locator.locator('option').evaluateAll((options: Element[]) =>
            options.map(option => ({
                value: (option as HTMLOptionElement).value || option.textContent?.trim() || "",
                text: option.textContent?.trim() || "",
            }))
        );
        await generateScreenshot(this.page, 'getAllSelectOptions');
        return options;
    }
}