import { ApiHandler } from "sst/node/api";
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Table } from 'sst/node/table';

export const handler = ApiHandler(async (_evt) => {
  // post hello world to DynamoDB
  const dynamoDb: DynamoDB.DocumentClient = new DynamoDB.DocumentClient();

  // const params = {
  //   TableName: Table.exampleTable.tableName,
  //   Item: {
  //     pk: "Hello World",
  //     sk: new Date().toISOString(),
  //   },
  // };

  // await dynamoDb.put(params).promise();
  const item = await dynamoDb
  .get({
    TableName: Table.exampleTable.tableName,
    Key: {
      pk: `1`,
      sk: 'Hello World',
    },
  })
  .promise();
  console.log(`Hello World got from DynamoDB: ${JSON.stringify(item)}`);

  return {
    statusCode: 200,
    body: `Hello world. The time is ${new Date().toISOString()}`,
  };
});
