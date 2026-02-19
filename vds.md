## 1. Развертывание

### 1.1. Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2. Проверка почтовых портов, т.к. часто на vds они закрыты

```bash
openssl s_client -connect smtp.yandex.ru:465
```

### 1.3. Установка Docker

```bash
sudo apt install docker.io docker-compose-v2 -y
sudo systemctl enable --now docker
```

### 1.4. Настройка Swap (для Keycloak на серверах до 8ГБ ОЗУ рекомендуют)

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 1.5. Структура директорий

Создаем папки:

```bash
mkdir -p ~/app/{docker/{mail/{config,mail-data,mail-state,logs,ssl,snappymail},postgres,nginx},frontend,backend}
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

Права на папку конфига мыла

```bash
chmod -R 755 ~/app/docker/mail/config/
```

---

## 2. Настройка DNS-записей

Добавляем записи у регистратора домена:

| Тип   | Имя      | Значение                                              | TTL  |
| ----- | -------- | ----------------------------------------------------- | ---- |
| `A`   | `@`      | IP сервера                                            | 3600 |
| `A`   | `mail`   | IP сервера                                            | 3600 |
| `A`   | `api`    | IP сервера                                            | 3600 |
| `A`   | `auth`   | IP сервера                                            | 3600 |
| `MX`  | `@`      | `mail.example.com` (приоритет 10)                     | 3600 |
| `TXT` | `@`      | `v=spf1 mx ~all`                                      | 3600 |
| `TXT` | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@example.com` | 3600 |

> Заменить `example.com` на реальный домен

---

## 3. Запуск

```bash
cd ~/app
```

### 3.1. Создаем сеть для Traefik

```bash
docker network create splacer-public
```

### 3.2. Запускаем весь стек

```bash
docker compose up -d
```

---

## 4. Основной проект

### 4.1. Получаем node_modules для api под серверную ос

```bash
docker compose run --rm api yarn --omit=dev
```

### 4.2. Накатываем миграции

```bash
docker compose exec api npx prisma migrate deploy
```

### 4.3. Keycloack

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

---

## 5. Почта

### 5.1. Проверяем наличие файлов сертификатов

```bash
ls -la ~/app/docker/mail/ssl/mail.example.com/
```

Должны быть файлы:

- `sert.pem`
- `key.pem`

### 5.2. Создаем первого пользователя (без него не взлетит mailserver)

```bash
docker compose exec mailserver setup email add admin@example.com StrongPass123!
```

После создания первого юзера нужно перезапустить mailserver.

### 5.3. Генерируем DKIM-ключи

```bash
docker compose exec mailserver setup config dkim domain example.com
```

### 5.4. Получаем публичный ключ для DNS

идем в папку ~/app/docker/mail/config/opendkim/keys/example.com/

открываем mail.txt, и добавляем dkim в DNS:

- **Тип:** `TXT`
- **Имя:** `default._domainkey.example.com`
- **Значение:** (v=DKIM1; h=sha256; k=rsa; p=MIIBI... из файла)

> Заменить `example.com` на реальный домен

### 5.5. Настраиваем Rspamd

#### 5.5.1. Создаем директорию для ключей Rspamd

```bash
docker compose exec mailserver mkdir -p /tmp/docker-mailserver/rspamd/dkim/
```

#### 5.5.2. Копируем существующий приватный ключ в нужное место с правильным именем

```bash
docker compose exec mailserver cp \
  /tmp/docker-mailserver/opendkim/keys/example.com/mail.private \
  /tmp/docker-mailserver/rspamd/dkim/rsa-2048-mail-example.com.private.txt
```

#### 5.5.3. Устанавливаем правильные права

```bash
docker compose exec mailserver chmod 600 \
  /tmp/docker-mailserver/rspamd/dkim/rsa-2048-mail-example.com.private.txt
```

#### 5.5.4. Перезапускаем Rspamd

```bash
docker compose exec mailserver supervisorctl restart rspamd
```

> Заменить `example.com` на реальный домен

### 5.6. Управление пользователями

```bash
# Добавить пользователя
docker compose exec mailserver setup email add user@example.com Password123

# Удалить пользователя
docker compose exec mailserver setup email del user@example.com

# Сменить пароль
docker compose exec mailserver setup email passwd user@example.com NewPassword

# Список всех пользователей
docker compose exec mailserver setup email list

# Создать алиас (пересылку)
docker compose exec mailserver setup email add --alias info@example.com admin@example.com
```

---

## 6. Настройка SnappyMail

### 6.1. Открываем веб-почту

Переходим в браузере: `https://mail.example.com/?admin`

### 6.2. Первичная настройка

пароль на старте (логин admin)
`~/app/docker/mail/snappymail/_data_/_default_/admin_password.txt`

сразу меняем

Переходим в **Domains** → **Add Domain**
Заполняем:

- **Domain name:** `example.com`
- **IMAP:** `mailserver`, Port `993`, Security `SSL/TLS`
- **SMTP:** `mailserver`, Port `465`, Security `SSL/TLS`
- **Sieve:** `mailserver`, Port `4190` (опционально)

**!!! проверяем наличие пользователей (см 5.6)**

---

## 7. Настройка фаервола (UFW)

```bash
# Устанавливаем UFW
apt update && apt install ufw -y

# Сбрасываем правила
ufw --force reset

# Разрешаем SSH
ufw allow OpenSSH

# Разрешаем HTTP/HTTPS для Traefik
ufw allow 80/tcp
ufw allow 443/tcp

# Разрешаем почтовые порты
ufw allow 25/tcp
ufw allow 465/tcp
ufw allow 587/tcp
ufw allow 993/tcp
ufw allow 995/tcp

# Включаем фаервол
ufw --force enable
```

---

## 8. Тестирование доставки почты

Отправляем тестовое письмо на сервис проверки:

```
check-auth@verifier.port25.com
```

Получаем отчет с оценкой SPF, DKIM, DMARC.

---

Если все ок, то:

- **SMTP/IMAP:** `mail.example.com` (порты 465/993)
- **Веб-почта:** `https://mail.example.com/`

Для идеала еще настроить PTR у хостера (как правило, через письмо в поддержку с доказательствами, что ты не спамер), но это уже опционально.

---

## 9. Шпаргалка

### Тулзы для мониторинга

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

### перезапускаем контейнер

```bash
docker compose restart api
```

### логи контейнера

```bash
docker compose logs keycloak --tail=20

# Логи почтового сервера
docker compose logs -f mailserver

# Логи веб-почты
docker compose logs -f snappymail

# Логи извлечения сертификатов
docker compose logs -f certs-dumper

# Логи Traefik
docker compose logs -f traefik
```

### статус приложения

```bash
docker compose ps
```

### Статус внутренностей mailserver

```bash
docker compose exec mailserver supervisorctl status
```

### глушим все

```bash
docker compose down
```

### консоль внутри контейнера (выход: exit)

```bash
docker exec -it api sh
```

### Удалит контейнеры И именованные тома (очистит данные)

```bash
docker-compose down -v
```

Если нужно сделать что-то внутри контейнера,
можно временно изменить команду на бесконечный сон:
command: sleep infinity

### Удаление контейнера

```bash
docker stop api
docker rm api
```
