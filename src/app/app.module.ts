import { Module } from '@nestjs/common';

const PROVIDERS = [];

@Module({
  imports: [],
  providers: PROVIDERS,
  exports: PROVIDERS,
})
export class AppModule {}
