# App challenge

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
