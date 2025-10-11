import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import * as configs from 'src/infra/configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [...Object.values(configs)] }),
    ApiModule,
  ],
})
export class MainModule {}
