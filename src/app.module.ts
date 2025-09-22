import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Only for development
      // Enable SSL for cloud-hosted Postgres (Render, Heroku, etc.).
      // Use DB_SSL env var to explicitly toggle (set to 'true' or 'false').
      ssl: process.env.DB_SSL === 'false' ? false : true,
      extra: process.env.DB_SSL === 'false' ? undefined : {
        ssl: {
          // For many cloud providers, rejectUnauthorized must be false when
          // a CA is not provided to the client environment.
          rejectUnauthorized: false,
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}