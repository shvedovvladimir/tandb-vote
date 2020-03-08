## Запуск локально:

1. `cp variables.sample.env variables.env` (конфиг берется из env параметров, описание их есть в sample файле)
2. `make dev-init`
3. `make dev-up`

## Скрипты запуска:

1. start.sh - запуск приложения.
2. migrations.sh - выполнение миграций.
3. dev.sh выполнение миграций + тестовые данные + запуск в watch and rebuild режиме.


## Зависимости:

1. postgres
