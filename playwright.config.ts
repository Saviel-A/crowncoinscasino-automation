import * as path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';
import { capitalizeFirstLetter } from './modules/crown-coins-casino/src/utils/generic';
import { config } from './modules/crown-coins-casino/src/config/config';

dotenv.config();

const environment = capitalizeFirstLetter(config.NODE_ENV);
const brand = config.BRAND;
const reportPath = config.REPORT_PATH;

export const automationReportsFolder = path.join(reportPath, `${brand}_${environment}`);
const playwrightReportsFolder = path.join(automationReportsFolder, 'Playwright');
const videosReportsFolder = path.join(automationReportsFolder, 'Videos');

// Playwright configuration
export default defineConfig({
    fullyParallel: false,
    timeout: 0,
    expect: { timeout: 5000 },
    forbidOnly: !!process.env.CI,
    workers: process.env.CI ? 3 : undefined,
    reporter: [
        ['./modules/crown-coins-casino/src/utils/custom-report.ts'],
        ['line'],
        ['html', { outputFolder: playwrightReportsFolder, open: 'never' }],
    ],
    globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
    use: {            
        headless: false,
        actionTimeout: 0,
        screenshot: 'on',
        trace: 'on',
        viewport: { width: 1920, height: 1080 },    
        contextOptions: {
            recordVideo: {
                dir: videosReportsFolder,
                size: { width: 1920, height: 1080 },
            },
        },
       
    },
    projects: [
        {
            testDir: `./modules/crown-coins-casino/src/tests`,
            name: `${brand} - ${environment}`,            
        },
       
    ]
});
