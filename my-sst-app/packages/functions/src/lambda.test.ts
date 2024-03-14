import { handler } from '../src/lambda';
import { describe, it, expect, vi } from 'vitest';

describe('handler', () => {
  it('should put an item in DynamoDB and return a success response', async () => {
    const putMock = vi.fn().mockReturnValue({ promise: vi.fn() });
    const dynamoDbMock = {
        DocumentClient: vi.fn().mockImplementation(() => ({
            put: putMock,
        })),
    };

    const response = await handler({
        version: '',
        routeKey: '',
        rawPath: '',
        rawQueryString: '',
        headers: {},
        requestContext: {
            accountId: '',
            apiId: '',
            domainName: '',
            domainPrefix: '',
            http: {
                method: '',
                path: '',
                protocol: '',
                sourceIp: '',
                userAgent: ''
            },
            requestId: '',
            routeKey: '',
            stage: '',
            time: '',
            timeEpoch: 0
        }, // Assign an empty object instead of undefined
        isBase64Encoded: false
    }, {
        callbackWaitsForEmptyEventLoop: false,
        functionName: '',
        functionVersion: '',
        invokedFunctionArn: '',
        memoryLimitInMB: '',
        awsRequestId: '',
        logGroupName: '',
        logStreamName: '',
        getRemainingTimeInMillis: function (): number {
            throw new Error('Function not implemented.');
        },
        done: function (error?: Error | undefined, result?: any): void {
            throw new Error('Function not implemented.');
        },
        fail: function (error: string | Error): void {
            throw new Error('Function not implemented.');
        },
        succeed: function (messageOrObject: any): void {
            throw new Error('Function not implemented.');
        }
    }); // Pass the context argument

    expect(dynamoDbMock.DocumentClient).toHaveBeenCalledTimes(1);
    expect(putMock).toHaveBeenCalledTimes(1);
    expect(putMock).toHaveBeenCalledWith({
      TableName: 'exampleTable',
      Item: {
        id: '1',
        message: 'Hello World',
      },
    });
    expect(response).toEqual({
      statusCode: 200,
      body: expect.stringContaining('Hello world. The time is'),
    });
  });
});