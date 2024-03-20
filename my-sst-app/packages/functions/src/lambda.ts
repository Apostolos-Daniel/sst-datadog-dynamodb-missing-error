import { ApiHandler } from "sst/node/api";
import { Table } from 'sst/node/table';
import AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();


export const handler = ApiHandler(async (_evt) => {
  // post hello world to DynamoDB

  const now = new Date().toISOString();
  const params = {
    TableName: Table.exampleTable.tableName,
    Item: {
      pk: "Hello World",
      sk: now,
      userId: "123",
    },
    // This condition expression is designed to fail if the item with the given userId already exists.
    ConditionExpression: "attribute_not_exists(userId)"
  };
  await dynamoDB.put(params).promise();

  // await dynamoDb.put(params).promise();
  const item = await dynamoDB
  .get({
    TableName: Table.exampleTable.tableName,
    Key: {
      pk: `Hello World`,
      sk: now,
      userId: "123",
    },
  })
  .promise();
  console.log(`Hello World got from DynamoDB: ${JSON.stringify(item)}`);

  return {
    statusCode: 200,
    body: `Hello world. The time is ${new Date().toISOString()}. Got from DynamoDB: ${JSON.stringify(item)}`,
  };
});
