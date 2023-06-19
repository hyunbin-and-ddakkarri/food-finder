# How to run

## Change `.env` file

```dotenv
DATABASE_URL=postgres://admin:admin@localhost:5432/postgres
```

## Build

```bash
cargo build
```

## Install diesel cli

```bash
cargo install diesel_cli --no-default-features --features postgres
```

## Create database

```bash
diesel migration run
```

## Run

```bash
cargo run
```
