import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for both local and production
  app.enableCors({
    origin: [
      'http://localhost:5173',           // Local development
      'https://timelium.vercel.app'      // Production
    ],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();