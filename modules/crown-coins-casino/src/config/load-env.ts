import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { z } from 'zod';
import { logger } from '../utils/logger';

const nodeEnvSchema = z.enum(['development', 'staging', 'production'], {
  errorMap: () => ({ message: 'NODE_ENV must be one of "development", "staging", or "production"' }),
});

const envSections: { [key: string]: string[] } = {
  config: ['NODE_ENV', 'BRAND', 'REPORT_PATH', 'BASE_URL', 'USER_EMAIL', 'USER_PASSWORD'],
};

export function loadEnv(): void {
  const nodeEnv = process.env.NODE_ENV;

  const parsedNodeEnv = nodeEnvSchema.safeParse(nodeEnv);
  if (!parsedNodeEnv.success) {
    logger.error(parsedNodeEnv.error.format());
    process.exit(1);
  }

  const envFile = `.env.${nodeEnv}`;
  const existingEnvContent = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf-8') : '';
  const existingEnvVariables: { [key: string]: string } = {};

  if (existingEnvContent) {
    existingEnvContent.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      if (key && value !== undefined) {
        existingEnvVariables[key.trim()] = value.trim();
      }
    });
  }

  let newEnvContent = '';

  for (const section in envSections) {
    newEnvContent += `\n# ${section.charAt(0).toUpperCase() + section.slice(1)} Variables\n`;
    for (const key of envSections[section]) {
      const value = existingEnvVariables[key] || process.env[key] || '';
      newEnvContent += `${key}=${value}\n`;
    }
  }

  if (!fs.existsSync(envFile)) {
    logger.error(`${envFile} is missing. Generating a new file.`);
    fs.writeFileSync(envFile, newEnvContent.trim());
    logger.info(`${envFile} has been created. Please customize it for your ${nodeEnv} setup.`);
  } else {
    const result = dotenv.config({ path: envFile });

    if (result.error) {
      logger.error(`Failed to load ${envFile}. Error: ${result.error.message}`);
      process.exit(1);
    }

    logger.info(`${envFile} successfully loaded.`);

    if (newEnvContent.trim() !== existingEnvContent.trim()) {
      fs.writeFileSync(envFile, newEnvContent.trim());
      logger.warn(`Updated ${envFile} with any missing variables.`);
    } else {
      logger.info(`No changes made to ${envFile}.`);
    }
  }
}
