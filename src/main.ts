import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8000);
  console.log("Server has been started on http://localhost:8000/");
}
bootstrap();