const fs = require('fs');
require('dotenv').config();
const { migrate, getLatestMigration } = require('./helpers');

const run = async () => {
  const migrationFiles = fs.readdirSync('./migrations');

  const migrations = migrationFiles
    .map((fileName) => {
      //? file format should be  <migration-name>-<timestamp>.js
      const match = /(?<timestamp>\d+)-.*\..{2}/gi.exec(fileName);
      const timestamp = Number(match.groups.timestamp);
      if (isNaN(timestamp)) {
        throw new Error(`Invalid migration name format on file: ${fileName}.`);
      }
      return {
        fileName,
        sequence: timestamp,
      };
    })
    .sort((a, b) => a.sequence - b.sequence);
  for (const migrationItem of migrations) {
    console.info('migrating: ', migrationItem.fileName);
    await migrate(migrationItem);
  }
};

const main = () => {
  return run()
    .then(() => {
      console.info('success');
      process.exit(0);
    })
    .catch((e) => {
      console.error('error: ', e);
      process.exit(1);
    });
};

main();
