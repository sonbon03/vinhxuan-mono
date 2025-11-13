import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  @ApiOperation({ summary: 'Health check' })
  healthCheck() {
    // Simple health check that works even if DB/Redis are down
    // This helps Railway health check pass even during startup
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      // Don't include sensitive info, just check if vars are set
      config: {
        database: !!process.env.DB_HOST,
        redis: !!process.env.REDIS_HOST,
        rsaKeys: !!(process.env.RSA_PRIVATE_KEY && process.env.RSA_PUBLIC_KEY),
      },
    };
  }
}
