import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export class BasePage {
    protected page: Page;
    protected name: string;

    constructor(page: Page, name: string) {
        this.page = page;
        this.name = name;
    }

    async goTo(url: string) {
        logger.info(`Navigating to ${url}`);
        await this.page.goto(url);
    }
}
