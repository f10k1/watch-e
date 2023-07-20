import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors) => {
            return new UnprocessableEntityException({
                statusCode: 422,
                error: 'Unprocessable Entity',
                message: errors.reduce(
                    (acc, e) => ({
                        ...acc,
                        [e.property]: Object.values(e.constraints),
                    }),
                    {},
                ),
            });
        },
    }));

    app.enableCors({
        origin: "http://localhost:3000"
    });

    await app.listen(8083);
}
bootstrap();