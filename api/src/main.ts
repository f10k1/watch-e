import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors) => {
            const messages = errors.reduce(
                (acc, e) => ({
                    ...acc,
                    [e.property]: Object.values(e.constraints),
                }),
                {},
            );
            return new UnprocessableEntityException(messages);
        },
    }));

    const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.MQTT,
        options: {
            host: process.env.MQTT_HOST,
            port: +process.env.MQTT_PORT
        }
    });

    app.startAllMicroservices();

    app.useWebSocketAdapter(new WsAdapter(app));

    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors({
        origin: "http://localhost:3000"
    });

    await app.listen(8083, '0.0.0.0');
}
bootstrap();