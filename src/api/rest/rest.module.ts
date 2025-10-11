import { Module } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { HealthController } from './controllers/health.controller';
import { ProbeController } from './controllers/probe.controller';

@Module({
  imports: [AppModule],
  controllers: [HealthController, ProbeController],
})
export class RestModule {}
