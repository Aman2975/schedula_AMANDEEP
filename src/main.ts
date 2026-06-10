import { NestFactory } from '@nestjs/core';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.enableCors({
    origin: '*',                     
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

   app.useGlobalPipes(new ValidationPipe());
// swagger
  const config = new DocumentBuilder()
    .setTitle('Schedula API')
    .setDescription(`
      ## Doctor Appointment Booking System
      
      ### Features
      - User & Doctor Authentication (JWT)
      - Role Based Access Control
      - Doctor Profile Management
      - User Profile Management
      - Doctor Search & Filtering
      
      ### How to Authenticate
      1. Register via **/auth/register/user** or **/auth/register/doctor**
      2. Login via **/auth/login** with role field
      3. Copy token from response
      4. Click **Authorize** button and paste token
    `)
    .setVersion('1.0.0')
    .setContact('Aman', 'https://iaman.space', 'your@email.com')
    .addServer('http://localhost:3000', 'Local Development')
    .addServer('https://your-render-url.onrender.com', 'Production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token here',
        in: 'header',
      },
      'access-token',
    )
    .addTag('Auth', 'Registration and Login endpoints')
    .addTag('Users', 'User profile management endpoints')
    .addTag('Doctors', 'Doctor profile management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


