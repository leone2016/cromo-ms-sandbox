import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler } from 'aws-lambda';
const express = require('express');
import { AppModule } from './app.module';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    nestApp.enableCors();
    await nestApp.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export const handler = async (event: any, context: Context, callback: any) => {
  const serviceName = process.env.MS_NAME;
  const prefix = serviceName ? `/${serviceName}` : '';

  if (prefix) {
    if (event.path && event.path.startsWith(prefix)) {
      event.path = event.path.substring(prefix.length) || '/';
    }
    if (event.requestContext && event.requestContext.path && event.requestContext.path.startsWith(prefix)) {
      event.requestContext.path = event.requestContext.path.substring(prefix.length) || '/';
    }
    if (event.rawPath && event.rawPath.startsWith(prefix)) {
      event.rawPath = event.rawPath.substring(prefix.length) || '/';
    }
  }

  const server = await bootstrap();
  return server(event, context, callback);
};
