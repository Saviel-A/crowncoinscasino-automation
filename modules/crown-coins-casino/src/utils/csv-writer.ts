import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import { automationReportsFolder } from '../../../../playwright.config';

export const createCsvWriter = () => {
    return createObjectCsvWriter({
        path: path.join(automationReportsFolder, 'Test-Results.csv'),
        header: [
            { id: 'test', title: 'Test Name' },
            { id: 'status', title: 'Status' },
            { id: 'date', title: 'Date' },
            { id: 'startTime', title: 'Start Time' },
            { id: 'endTime', title: 'End Time' },
            { id: 'executionTime', title: 'Execution Time (ms)' },
            { id: 'error', title: 'Error' },
        ],
    });
};