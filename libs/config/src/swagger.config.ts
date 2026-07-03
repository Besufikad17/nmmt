import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
	const logger = new Logger('SWAGGER');
	const config = new DocumentBuilder()
		.setTitle(process.env.SWAGGER_TITLE || 'NestJS API')
		.setDescription(process.env.SWAGGER_DESCRIPTION || 'API Documentation')
		.setVersion(process.env.SWAGGER_VERSION || '1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	const swaggerPath = process.env.SWAGGER_PATH || 'api-docs';

	const isSwaggerEnabled =
		process.env.NODE_ENV === 'development' ||
		process.env.ENABLE_SWAGGER === 'true';

	if (isSwaggerEnabled) {
		SwaggerModule.setup(swaggerPath, app, document, {
			swaggerOptions: {
				persistAuthorization: true,
				tagsSorter: 'alpha',
				operationsSorter: 'alpha',
			},
			customSiteTitle: process.env.SWAGGER_TITLE || 'API Documentation',
			customfavIcon: '/favicon.ico',
			customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 20px 0; }
      `,
		});

		logger.log(`Swagger documentation available at: http://localhost:${process.env.PORT || 3000}/${swaggerPath}`);
	} else {
		logger.log('Swagger is disabled in production. Set ENABLE_SWAGGER=true to enable.');
	}
}
