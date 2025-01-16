import { expect, Locator, Page, test } from '@playwright/test';
import { locatorTemplateFormat } from '../utils/locator-template';
import { ComponentProps, LocatorProps } from '../types/base-element';
import { capitalizeFirstLetter } from '../utils/generic';
import { logger } from '../utils/logger';

export abstract class BaseElement {
    page: Page;
    locator: string;
    private readonly name: string | undefined;
    private readonly iframe: string[] | undefined;
    private readonly timeout: number | undefined;
    private readonly wrapperLocator: Locator | undefined;

    constructor({ page, locator, name, iframe, timeout, wrapperLocator }: ComponentProps) {
        this.page = page;
        this.locator = locator;
        this.name = name;
        this.iframe = iframe;
        this.timeout = timeout;
        this.wrapperLocator = wrapperLocator;
    }

    get typeOf(): string {
        return 'browser element';
    }

    get typeOfUpper(): string {
        return capitalizeFirstLetter(this.typeOf);
    }

    getLocator(props: LocatorProps = {}): Locator {
        if (this.wrapperLocator != undefined) {
            return this.wrapperLocator;
        }
        const { locator, ...context } = props;
        const withTemplate = locatorTemplateFormat(locator || this.locator, context);

        if (!this.iframe) {
            return this.page.locator(withTemplate);
        }
        if (this.iframe.length == 1) {
            return this.page.frameLocator(this.iframe[0]).locator(withTemplate);
        }
        return this.page.frameLocator(this.iframe[0]).frameLocator(this.iframe[1]).locator(withTemplate);
    }

    getSelector(): string {
        return this.locator;
    }

    get browserElementName(): string {
        if (!this.name) {
            throw Error('Provide "name" property to use "browserElementName"');
        }
        return this.name;
    }

    public get timeoutForWait(): number {
        if (!this.timeout) return 30000;
        else return this.timeout;
    }

    private getErrorMessage(action: string): string {
        return `The ${this.typeOf} with name "${this.browserElementName}" and locator ${this.locator} ${action}`;
    }

    async shouldBeVisible(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`${this.typeOfUpper} "${this.browserElementName}" should be visible on the page`, async () => {
            const locator = this.getLocator(locatorProps);
            await expect(locator, { message: this.getErrorMessage('is not visible') }).toBeVisible({ timeout: this.timeoutForWait });
        });
    }

    async shouldtoBeHidden(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`${this.typeOfUpper} "${this.browserElementName}" should not be visible on the page`, async () => {
            const locator = this.getLocator(locatorProps);
            await expect(locator, { message: this.getErrorMessage('is visible') }).toBeHidden({ timeout: this.timeoutForWait });
        });
    }

    async getLocatorCount(locatorProps: LocatorProps = {}): Promise<number> {
        return await test.step(`${this.typeOfUpper} "${this.browserElementName}" get value of the element`, async () => {
            const locator = this.getLocator(locatorProps);
            return await locator.count();
        });
    }

    async checkIsVisible(locatorProps: LocatorProps = {}): Promise<boolean> {
        await test.step(`${this.typeOfUpper} "${this.browserElementName}" should be visible on the page`, async () => {
            const locator = this.getLocator(locatorProps);
        });
        return await this.getLocator(locatorProps).isVisible({ timeout: 1000 }).catch(e => false);
    }

    async shouldHaveText(text: string, locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`${this.typeOfUpper} "${this.browserElementName}" should have text "${text}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await expect(locator, { message: this.getErrorMessage(`does not have text "${text}"`) }).toContainText(text);
        });
    }

    async shouldHaveTextInItems(expectedText: string, locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`${this.typeOfUpper} "${this.browserElementName}" should have text "${expectedText}"`, async () => {
            const locator = this.getLocator(locatorProps);
            let items = await locator.allInnerTexts();
            expect(items, { message: this.getErrorMessage(`does not have text "${expectedText}"`) }).toContain(expectedText);
        });
    }

    async scrollIntoView(locatorProps: LocatorProps = {}): Promise<void> {
        await test.step(`Scrolling into the ${this.typeOf} with name "${this.browserElementName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            await locator.scrollIntoViewIfNeeded();
        });
    }

    async getValue(locatorProps: LocatorProps = {}): Promise<string | null | undefined> {
        return await test.step(`${this.typeOfUpper} "${this.browserElementName}" get value of the element`, async () => {
            const locator = this.getLocator(locatorProps);
            return await locator.textContent({ timeout: this.timeoutForWait });
        });
    }

    async scrollDown(locatorProps: LocatorProps = {}, callback?: () => Promise<boolean>): Promise<void> {
        return await test.step(`${this.typeOfUpper} "${this.browserElementName}" get value of the element`, async () => {
            const locator = this.getLocator(locatorProps);
            const boundingBox = await locator.boundingBox();
            if (boundingBox == null) {
                throw new Error("No bounding for locator defined");
            }
            let previousScrollTop = await locator.evaluate((el) => el.scrollTop);
            const userAgent = await this.page.evaluate(() => navigator.userAgent);
            let firstTime = true;
            while (true) {
                if (firstTime) {
                    await locator.evaluate((el) => {
                        el.scrollTop = 0;
                    });
                } else {
                    if (userAgent.includes("Mobile")) {
                        await locator.evaluate((el, pixelAmount) => {
                            el.scrollTop += pixelAmount;
                        }, boundingBox.height);
                    } else {
                        await locator.evaluate((el, pixelAmount) => {
                            el.scrollBy(0, pixelAmount);
                        }, boundingBox.height);
                    }
                }
                if (callback) {
                    const shouldStop = await callback();
                    if (shouldStop) {
                        break;
                    }
                }
                const newScrollTop = await locator.evaluate((el) => el.scrollTop);
                const scrollHeight = await locator.evaluate((el) => el.scrollHeight);
                const clientHeight = await locator.evaluate((el) => el.clientHeight);
                if (scrollHeight === clientHeight) {
                    break;
                }
                if (
                    (newScrollTop + clientHeight >= scrollHeight ||
                        newScrollTop === previousScrollTop) &&
                    !firstTime
                ) {
                    break;
                }
                previousScrollTop = newScrollTop;
                firstTime = false;
            }
        });
    }

    async areElementsVisible(): Promise<boolean> {
        let attempts = 0;
        const maxAttempts = 3;
        while (attempts < maxAttempts) {
            await this.page.waitForLoadState('networkidle');
            const elementLocator = this.page.locator(this.locator);
            const elements = await elementLocator.elementHandles();
            if (elements.length === 0) {
                logger.info(`No elements found for locator: ${this.locator}`);
                attempts++;
                await this.page.waitForTimeout(1000);
                continue;
            }

            let allVisible = true;
            for (const [index, element] of elements.entries()) {
                const visible = await element.isVisible();
                if (!visible) {
                    logger.info(`Element at index ${index} is not visible`);
                    allVisible = false;
                }
            }

            if (allVisible) {
                return true;
            } else if (attempts < maxAttempts - 1) {
                logger.info(`Not all elements are visible. Retrying...`);
                await this.page.waitForTimeout(1000);
            }

            attempts++;
        }

        logger.info(`Failed to validate visibility after ${maxAttempts} attempts`);
        return false;
    }

    async getAttribute(attributeName: string, locatorProps: LocatorProps = {}): Promise<string | null> {
        return await test.step(`${this.typeOfUpper} "${this.browserElementName}" get attribute "${attributeName}"`, async () => {
            const locator = this.getLocator(locatorProps);
            return await locator.getAttribute(attributeName);
        });
    }
}