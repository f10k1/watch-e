import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

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

    app.useGlobalFilters(new HttpExceptionFilter());

    app.enableCors({
        origin: "http://localhost:3000"
    });

    await app.listen(8083);
}
bootstrap();