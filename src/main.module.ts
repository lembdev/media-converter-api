import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as configs from 'src/infra/configs';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [...Object.values(configs)] }),
    ApiModule,
  ],
})
export class MainModule {}
