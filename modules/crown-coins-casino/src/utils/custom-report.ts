import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { logger } from './logger';
import { formatDateTime } from './date-time-formatter';
import { capitalizeFirstLetter } from './generic';
import { createCsvWriter } from './csv-writer';
import { TestResultData } from '../types/test-results';

class CustomReport implements Reporter {
    private csvWriter: ReturnType<typeof createCsvWriter>;
    private results: TestResultData[] = [];
    private startTime: number = 0;

    constructor() {
        this.csvWriter = createCsvWriter();
    }

    onBegin(config: FullConfig, suite: Suite) {
        const count = suite.allTests().length;
        logger.info(`Starting the run with ${count} ${count === 1 ? 'test' : 'tests'}`);
    }

    onTestBegin(test: TestCase, result: TestResult) {
        this.startTime = Date.now();
        logger.info(`Starting test ${test.title} at ${formatDateTime(new Date(this.startTime))}`);
        result.startTime = new Date(this.startTime);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const endTime = Date.now();
        const endDateTime = new Date(endTime);

        const data: TestResultData = {
            test: test.title,
            status: capitalizeFirstLetter(result.status),
            date: formatDateTime(new Date(this.startTime)).split('_')[0],
            startTime: formatDateTime(new Date(this.startTime)).split('_')[1],
            endTime: formatDateTime(endDateTime).split('_')[1],
            executionTime: endTime - this.startTime,
            error: result.errors.length > 0 ? result.errors.map(e => e.message).join(', ').replace(/Error: /g, '') : 'None',
        };
        this.results.push(data);
        logger.info(`Test ended: ${test.title} with status: ${capitalizeFirstLetter(result.status)}`);
    }

    async onEnd(result: FullResult) {
        try {
            if (this.results.length > 0) {
                await this.csvWriter.writeRecords(this.results);
                logger.info(`Test results exported to CSV successfully. Total records: ${this.results.length}`);
            }
            logger.info(`Finished the run: ${capitalizeFirstLetter(result.status)}`);
        } catch (error: unknown) {
            logger.error(`Error writing to CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default CustomReport;