# DynamoDB Migration Scripts


# Getting Started

1. Installation process
   `npm install`


# Migrations

This migration script will help you apply data changes in the dynamodb table.
The migrations are tracked in a record with id "Migrations" and it has a history of the executed migrations and date of execution

### running migrations

For the pipelines you only need to configure the `DYNAMODB_TABLE_NAME` variable

To run migrations from you local you have to configure your .env file with the following variables

```
DYNAMODB_TABLE_NAME=communication-metadata
REGION=eu-west-1
AWS_PROFILE=default
AWS_SDK_LOAD_CONFIG=1 # load config from sso
```

execute this command in the cli

```
npm run migrate:up
```

### create

To create a new migration file run this command

```
npm run migrate:create name-of-my-migration
```

A migration file will be created in the `migrations` folder with the timestamp as a suffix
