import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class HealthController {
  @Get('/health')
  @ApiOperation({
    description: 'Returns the health status of the application',
  })
  health() {
    return { status: 'ok' };
  }
}
