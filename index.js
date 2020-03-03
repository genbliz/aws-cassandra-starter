// @ts-check
require("dotenv").config();
const fs = require("fs");
const uuid = require("uuid");
const cassandra = require("cassandra-driver");

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.CASSANDRA_USERNAME,
  process.env.CASSANDRA_PASSWORD
);

const contactPoints = [
  `${process.env.CASSANDRA_HOST}:${process.env.CASSANDRA_PORT}`
];

const sslOptions = {
  cert: fs.readFileSync("AmazonRootCA1.pem"),
  host: process.env.CASSANDRA_HOST,
  rejectUnauthorized: true
};

const client = new cassandra.Client({
  contactPoints: contactPoints,
  authProvider: authProvider,
  localDataCenter: "dc1",
  // keyspace: "people",
  sslOptions: sslOptions
});

function waitUntilSeconds(seconds) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

function execute(query, params) {
  return new Promise((resolve, reject) => {
    client.execute(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function doCreateKeyspace(keyspaceName) {
  const createTbl = `CREATE KEYSPACE "${keyspaceName}" WITH REPLICATION = {'class': 'SingleRegionStrategy'}`;
  const result = await execute(createTbl, []);
  console.log(JSON.stringify({ doCreateKeyspace: result }, null, 2));
  return result;
}

async function doCreateTable() {
  const createTbl =
    "CREATE TABLE IF NOT EXISTS people1.person (id TEXT, name TEXT, worth DECIMAL, PRIMARY KEY (id))";
  const result = await execute(createTbl, []);
  console.log(JSON.stringify({ doCreateTable: result }, null, 2));
  return result;
}

async function doThingsInsert() {
  const dataId = uuid.v4();
  const sql = `INSERT INTO people1.person (id, name, worth) VALUES ('${dataId}','John',500000000);`;
  const result = await execute(sql, []);
  console.log(JSON.stringify({ doThingsInsert: result }, null, 2));
  return result;
}

async function doThingsSelect() {
  const result = await execute("SELECT * FROM people1.person", []);
  console.log(JSON.stringify({ doThingsSelect: result }, null, 2));
  return result;
}

async function doThings() {
  try {
    await client.connect();
    await doCreateKeyspace("people1");
    await waitUntilSeconds(12);
    await doCreateTable();
    await waitUntilSeconds(15);
    await doThingsInsert();
    await doThingsSelect();
    process.exit(1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

doThings();
