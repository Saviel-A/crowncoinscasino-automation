import { test as base } from '@playwright/test';
import { formatDateTime } from '../utils/date-time-formatter';
import { consoleLogger, logger, networkLogger } from '../utils/logger';
import { config } from '../config/config';
import { HomePage } from '../pages/home-page';
import { LobbyPage } from '../pages/lobby-page';

export const test = base.extend<{
    config: typeof config,
    homePage: HomePage,
    lobbyPage: LobbyPage,
    timeLogger: void,
    exceptionLogger: void,
}>({
    config: async ({ }, use) => {
        await use(config);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    lobbyPage: async ({ page }, use) => {
        const lobbyPage = new LobbyPage(page);
        await use(lobbyPage);
    },

    timeLogger: [async ({ }, use) => {
        const startTime = new Date();
        test.info().annotations.push({
            type: 'Run Start Time',
            description: `Run started at: ${formatDateTime(startTime)}`,
        });

        await use();

        const endTime = new Date();
        test.info().annotations.push({
            type: 'Run End Time',
            description: `Run ended at: ${formatDateTime(endTime)}`,
        });

        const executionTime = endTime.getTime() - startTime.getTime();
        test.info().annotations.push({
            type: 'Run Execution Duration',
            description: `Total execution time: ${executionTime} ms`,
        });
    }, { auto: true }],

    exceptionLogger: [async ({ page }, use) => {
        const errors: string[] = [];

        page.on('pageerror', (error) => {
            const errorMessage = `Page error: ${error.message}\n${error.stack}`;
            errors.push(errorMessage);
            logger.error(errorMessage);
        });

        page.on('requestfailed', (request) => {
            const errorMessage = `Request failed: ${request.url()} - ${request.failure()?.errorText}`;
            networkLogger.warn(errorMessage);
        });

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                const consoleErrorMessage = `Console Error: ${msg.text()}`;
                consoleLogger.warn(consoleErrorMessage);
            } else {
                consoleLogger.info(`Console ${msg.type()}: ${msg.text()}`);
            }
        });

        await use();

        if (errors.length > 0) {
            const logContent = 'Page Errors:\n' + errors.join('\n-----\n') + '\n\n';
            await test.info().attach('Errors Log', {
                body: logContent,
                contentType: 'text/plain',
            });
        }
    }, { auto: true }],
});

export { expect } from '@playwright/test';

export function step(stepName?: string) {
    return function decorator(
        target: any,
        context: ClassMethodDecoratorContext
    ) {
        return function replacementMethod(this: any, ...args: any[]) {
            const name = stepName || `${this.constructor.name}.${String(context.name)}`;
            return test.step(name, async () => {
                return await target.apply(this, args);
            });
        };
    };
}