import { ApiHandler } from "sst/node/api";
export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: `Hello world - this is using x86_64. The time is ${new Date().toISOString()}`,
  };
});
