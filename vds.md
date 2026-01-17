### Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### Проверка почтовых портов, т.к. часто на vds они закрыты

```bash
openssl s_client -connect smtp.yandex.ru:465
```

### Установка Docker (включая compose v2)

```bash
sudo apt install docker.io docker-compose-v2 -y
sudo systemctl enable --now docker
```

### Создание сети для Traefik

```bash
docker network create splacer-public
```

### Настройка Swap (для Keycloak на серверах до 8ГБ ОЗУ рекомендуют)

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Структура проекта

```bash
mkdir -p ~/app/frontend ~/app/backend ~/app/docker
cd ~/app
```

в app копируем

```
.env
docker-compose.prod.yml => docker-compose.yml
```

в папку docker копируем

```
docker/nginx/nginx.conf => docker/nginx/nginx.conf
docker/postgres/init-db.sh => docker/postgres/init-db.sh
```

в папку backend копируем

```
api/dist => dist
api/prisma => prisma
api/prismaClient => prismaClient
api/package.json => package.json
api/.env.prod => .env
```

в папку frontend - содержмое

```
front/build
```

### стартуем докер

```bash
docker compose up -d
```

### получаем node_modules для api под серверную ос

```bash
docker compose run --rm api yarn --omit=dev
```

### накатываем миграции

```bash
docker compose exec api npx prisma migrate deploy
```

### realm keycloack

в папке docker/keycloack/ лежит json, который можно импортировать в реалм вручную
в админке кейклока создаем реалм placer и импортируем файл в него

можно все создать самостоятельно

```
realm: placer
клиент фронта: placer-app
клиент апи: placer-api
в реалме должна быть роль: place-manager
```

для placer-api нужно сгененрить серкрет и добавить его в _backend/.env_, после чего нужно перезапустить api.

### шпаргалка

Тулзы для мониторинга

```bash
sudo apt install atop
atop
```

```bash
df -h
```

```bash
free
```

перезапускаем контейнер

```bash
docker compose restart api
```

логи контейнера

```bash
docker compose logs keycloak --tail=20
```

статус приложения

```bash
docker compose ps
```

глушим все

```bash
docker compose down
```

консоль внутри контейнера (выход: exit)

```bash
docker exec -it app-api-1 sh
```

Удалит контейнеры И именованные тома (очистит данные)

```bash
docker-compose down -v
```

Если нужно сделать что-то внутри контейнера,
можно временно изменить команду на бесконечный сон:
command: sleep infinity

Удаление контейнера

```bash
docker stop api
docker rm api
```
