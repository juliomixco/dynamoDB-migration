const path = require('path');
const {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const db = new DynamoDBClient({
  region: process.env.REGION || 'eu-west-1',
});

const markMigrationAsExecuted = async (migrationInfo) => {
  const response = await db.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: 'Migrations' }),
    })
  );
  const item = unmarshall(response.Item ?? {});
  const migrationHistory = item?.migrationHistory ?? [];
  const updatedItem = {
    ...item,
    id: 'Migrations',
    migrationHistory: [
      ...migrationHistory,
      {
        ...migrationInfo,
        date: new Date().toISOString(),
      },
    ],
  };
  await db.send(
    new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall(updatedItem),
    })
  );
};

const hasMigrationBeenExecuted = async (migrationInfo) => {
  const db = new DynamoDBClient({
    region: process.env.REGION || 'eu-west-1',
  });
  const response = await db.send(
    new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ id: 'Migrations' }),
    })
  );
  const item = unmarshall(response.Item ?? {});
  const migrationHistory = item?.migrationHistory ?? [];
  return Boolean(
    migrationHistory.find((m) => m.sequence === migrationInfo.sequence)
  );
};

const migrate = async (migrationInfo) => {
  const migration = require(path.join(
    process.cwd(),
    'migrations',
    migrationInfo.fileName
  ));

  const isMigrationRun = await hasMigrationBeenExecuted(migrationInfo);
  if (!isMigrationRun) {
    await migration.up();
    await markMigrationAsExecuted(migrationInfo);
  } else {
    console.info(
      `Migration ${migrationInfo.fileName} was already present in table`
    );
  }
};

const revert = async (migrationFn) => {
  await migrationFn();
};

module.exports = {
  migrate,
  revert,
};
