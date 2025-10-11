import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export interface IAppConfig {
  port: number;
}

const configFactory = (): IAppConfig => ({
  port: get('APP_PORT').default(3000).asPortNumber(),
});

export const appConfig = registerAs('app', configFactory);
