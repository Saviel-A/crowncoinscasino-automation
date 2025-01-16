import { logger } from '../utils/logger';
import { z } from 'zod';
import { loadEnv } from './load-env';

loadEnv();

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).transform((val) => val.toLowerCase()),
  BRAND: z.enum(['CrownCoinsCasino']),
  REPORT_PATH: z.string().min(1, 'The report path must be a valid path'),
  BASE_URL: z.string().url(),
  USER_EMAIL: z.string().email().min(1, 'User email is required'),
  USER_PASSWORD: z.string().min(1, 'User password is required'),
});

function validateConfig<T>(schema: z.ZodSchema<T>, configName: string, env: NodeJS.ProcessEnv): T {
  const result = schema.safeParse(env);
  if (!result.success) {
    logger.error(`Invalid ${configName} configuration:`);
    result.error.errors.forEach((e) => {
      logger.error(`${e.path.join('.')}: ${e.message}`);
    });
    process.exit(1);
  }
  logger.info(`${configName} configuration loaded successfully.`);
  return result.data;
}

type Config = z.infer<typeof configSchema>;

export const config: Config = validateConfig(configSchema, 'Config', process.env);
