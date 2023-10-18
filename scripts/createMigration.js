const fs = require('fs');
const path = require('path');

const timestamp = new Date().getTime();
const filename = process.argv[2];
const templateContent = fs.readFileSync(path.join(__dirname, 'template.js'));
const migrationName = `${timestamp}-${filename}.js`;
fs.appendFileSync(`migrations/${migrationName}`, templateContent);
console.log(`Migration: ${migrationName} creat d successfully`);
