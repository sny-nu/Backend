import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: console,
    });
    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('sny.nu API documentation')
        .setDescription('The sny.nu API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-documentation', app, document);

    await app.listen(4000);
}
bootstrap();
