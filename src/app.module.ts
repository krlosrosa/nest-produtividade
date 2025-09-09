import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './_shared/infra/prisma/prisma.module';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ProdutividadeModule } from './produtividade/produtividade.module';
import { UserModule } from './user/user.module';
import { CentroModule } from './centro/centro.module';
import { TransporteModule } from './transporte/transporte.module';
import { RedisModule } from './_shared/infra/redis/redis.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TesteModule } from './teste/teste.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    JwtModule.register({
      global: true,
      publicKey: join(process.cwd(), 'src/auth/keys/public.pem'),
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    PrometheusModule.register({
      path: '/metrics',
    }),
    FastifyMulterModule,
    PrismaModule,
    ProdutividadeModule,
    UserModule,
    CentroModule,
    TransporteModule,
    RedisModule,
    TesteModule,
    DashboardModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
