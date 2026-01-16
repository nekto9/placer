# Проект

Пет-проект для "посмотреть" nestjs и gravity-ui

[Демо](https://splacer.ru)

## Запуск в режиме разработки

```
yarn docker
```

или

```
docker-compose up -d
```

после импорта realm в кейклоке (если был импорт) нужно перегенерить Client Secret клиента для апи и вставить значение в .env

добавить роль в realm (если ее еще нет) **place-manager** и назначить ее какому-то юзеру

миграции призмы (папка api)

```
yarn prisma:migrate
```

API

```
cd api
yarn start:dev
```

Front

```
cd front
yarn serve
```

## Запуск в проде

[инструкция для vds](vds.md)
