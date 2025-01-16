import { Locator, Page } from '@playwright/test';

export type LocatorContext = { [key: string]: string | boolean | number };

export type ComponentProps = {
    page: Page;
    name?: string;
    locator: string;
    iframe?: string[];
    timeout?: number;
    wrapperLocator?: Locator;
};
export type LocatorProps = { locator?: string } & LocatorContext;