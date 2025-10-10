import { Module } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { HealthController } from './health/health.controller';
import { ProbeController } from './probe/probe.controller';

@Module({
  imports: [AppModule],
  controllers: [HealthController, ProbeController],
})
export class RestModule {}
