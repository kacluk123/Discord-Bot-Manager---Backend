import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) { }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const fs = require('fs');
    const sslDir = __dirname + '/../../ssl'
    const keyFile  = fs.readFileSync(sslDir + '/localhost+2-key.pem');
    const certFile  = fs.readFileSync(sslDir + '/localhost+2.pem');
    
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: Number(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
        ca: certFile.toString(),
        key: keyFile.toString()
      }
    };
  }
}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'REDIRECT_URL'
  ]);

export { configService };