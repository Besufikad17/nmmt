import * as Joi from 'joi';
import { Logger } from '@nestjs/common';

const baseSchema = Joi.object({
	// Node Environment
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development')
		.description('Node environment'),

	// Database Configuration
	DB_TYPE: Joi.string()
		.valid('mongodb', 'postgresql', 'postgres', 'mysql', 'mariadb')
		.default('mongodb')
		.description('Database type'),

	DATABASE_URI: Joi.string()
		.optional()
		.description('Database connection URI'),

	DB_HOST: Joi.string().hostname().optional().description('Database host'),
	DB_PORT: Joi.number().port().optional().description('Database port'),
	DB_USERNAME: Joi.string().optional().description('Database username'),
	DB_PASSWORD: Joi.string().optional().description('Database password'),
	DB_NAME: Joi.string().optional().description('Database name'),

	// Application Configuration
	APP_NAME: Joi.string().default('NestJS App').optional().description('Application name'),
	PORT: Joi.number().port().optional().description('Default port'),

	// JWT Configuration
	JWT_SECRET: Joi.string().optional().description('JWT secret key'),
	JWT_REFRESH_SECRET: Joi.string().optional().description('JWT refresh secret key'),
	JWT_EXPIRES_IN: Joi.string().default('1h').description('JWT expiration time'),
	JWT_REFRESH_EXPIRES_IN: Joi.string()
		.default('7d')
		.description('JWT refresh expiration time'),
}).unknown();

export function validateEnv(config: Record<string, unknown>) {
	const { error, value } = baseSchema.validate(config, {
		abortEarly: false,
		stripUnknown: false,
		convert: true,
	});

	if (error) {
		const errorMessages = error.details
			.map((detail) => {
				const path = detail.path.join('.');
				return `${path}: ${detail.message}`;
			})
			.join('\n');

		throw new Error(
			`Environment validation failed:\n${errorMessages}\n\n` +
			`Please check your .env file and ensure all required variables are set correctly.\n` +
			`See .env.example for reference.`,
		);
	}

	return value;
}

export function validateEnvByNodeEnv(env: Record<string, unknown>) {
	const nodeEnv = (env.NODE_ENV as string) || 'development';
	const logger = new Logger('EnvValidation');

	const validated = validateEnv(env);
	logger.log(`Environment validation passed (${nodeEnv})`);
	return validated;
}
