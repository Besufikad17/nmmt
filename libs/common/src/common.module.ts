import { Module, DynamicModule, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class CommonModule {
	static forRoot(): DynamicModule {
		return {
			module: CommonModule,
			providers: [LoggerService],
			exports: [LoggerService],
		};
	}
}
