## Проект

Пет-проект для "посмотреть"

- Nestjs, включая BullMQ, Telegraf для tg-бота, Prisma и т.п.
- Traefik для связки всех частей (Keycloack, api, front)
- Gravity-ui для фронта

[Демо](https://splacer.ru)

[Api](https://api.splacer.ru/api)

### Запуск в режиме разработки

```
yarn docker
```

или

```
docker-compose up -d
```

после импорта realm в кейклоке (если был импорт) нужно перегенерить Client Secret клиента для апи и вставить значение в .env

добавить роль в realm (если ее еще нет) **place-manager** и назначить ее какому-то юзеру

#### API

```
cd api
yarn start:dev
```

#### Фронт

```
cd front
yarn serve
```

### Запуск в проде

Бэк и фронт нужно собрать локально, для каждого в своей папке сделать:

```
yarn build
```

У бэка клинет призмы должен быть сгенерен перед сборкой.

[инструкция для vds](vds.md)
