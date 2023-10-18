const {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  BatchWriteItemCommand,
} = require('@aws-sdk/client-dynamodb');
// const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const metadata = require('../seed/init-communication-medata.json');

const db = new DynamoDBClient({
  region: process.env.REGION || 'eu-west-1',
});
async function up() {
  // TODO: add your own migration logic here
  // for (const item of metadata) {
  //   await db.send(
  //     new PutItemCommand({
  //       TableName: process.env.DYNAMODB_TABLE_NAME,
  //       Item: marshall(item),
  //     })
  //   );
  // }
}

async function down() {
  // TODO: add logic to undo the migration here
  return;
}

module.exports = {
  up,
  down,
};
