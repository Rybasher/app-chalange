# App challenge

## .env.sample

```
# Server port
PORT="your_server_port_or_8000_by_default"

# Database URL
DATABASE_URL="your_database_connection_string"

# JWT secrets for access token, refresh token, and email token
JWT_KEY="your_jwt_access_token_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_token_secret"
EMAIL_TOKEN_SECRET="your_jwt_email_token_secret"

# SMTP settings for email sending
SMTP_MAIL_HOST="your_smtp_host"
SMTP_MAIL_HOST_PORT=your_smtp_port
SMTP_USERNAME="your_smtp_username"
SMTP_PASSWORD="your_smtp_password"

#Front-end url
FRONT_URL="your_front-end_url"

```

**Required steps to run project**

- Copy and fill env variables
- Run application via docker or without

## Copy and fill env files

```
$ cp .env.sample .env

$ cp .env.db.sample .env.db
```

## Run project

**With docker**

```
$ docker compose up --build
```

**Without docker**

### Installation

```bash
$ npm install
```

### Run migrations

```
$ npm run prisma:generate
$ npm run prisma:migrate:deploy
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
