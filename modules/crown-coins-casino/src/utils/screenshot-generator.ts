import { Page } from '@playwright/test';
import { capitalizeFirstLetter } from './generic';
import { formatDateTime } from './date-time-formatter';
import { automationReportsFolder } from '../../../../playwright.config';

export async function generateScreenshot(page: Page, action: string): Promise<void> {
    const capitalizedAction = capitalizeFirstLetter(action);
    const screenshotPath = `${automationReportsFolder}/Screenshots/${capitalizedAction}_${formatDateTime(new Date())}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
}