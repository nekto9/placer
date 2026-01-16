import { existsSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import type { PrismaConfig } from 'prisma';

// 🔹 Загружаем .env вручную
const envPath = resolve(__dirname, './.env'); // путь к .env в папке api
if (existsSync(envPath)) {
  const config = dotenv.config({ path: envPath });
  dotenvExpand.expand(config); // ← разворачивает ${VAR} внутри значений
} else {
  console.warn(`.env file not found at ${envPath}`);
}

// 🔁 Проверим, что переменная загружена
const databaseUrl = process.env.URL_MAIN_DB;
if (!databaseUrl) {
  console.error('❌ Environment variable URL_MAIN_DB is not set!');
  process.exit(1);
}
console.log('🔗 Database URL:', databaseUrl.replace(/:(.*@)/, ':***@')); // маскируем пароль

const config: PrismaConfig = {
  schema: './prisma',
};

export default config;
