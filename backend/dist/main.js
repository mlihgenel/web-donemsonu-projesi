"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            process.env.FRONTEND_URL || '',
        ].filter(Boolean),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        exceptionFactory: (errors) => {
            const messages = errors.map((error) => {
                return Object.values(error.constraints || {}).join(', ');
            });
            return new common_1.BadRequestException(messages.join('; '));
        },
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Backend is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map