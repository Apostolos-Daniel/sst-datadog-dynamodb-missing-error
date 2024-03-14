# sst-datadog-dynamodb-missing-error

The issue we're seeing is that the DynamoDB POST call is not traced by Datadog (`dd-trace`) as a DynamoDB span. And when it errors, we get a "Missing error message and stack trace" in the trace Errors. 

![alt text](image.png)

Datadog suggests that using the `dd-trace/esbuild` plugin will automatically instrument the DynamoDB calls. We're using the `aws-sdk` and the `@aws-sdk/client-dynamodb` package to make the calls.

This repo adds the dd esbuild plugin to [sst config](./my-sst-app/sst.config.ts). This is [recommended by Datadog](https://docs.datadoghq.com/tracing/trace_collection/automatic_instrumentation/dd_libraries/nodejs/#bundling) to configure esbuild to maximise `dd-trace`'s potential of tracing 3rd party libraries. 

I have not been able to reproduce the issue we get above, I'm not even getting DynamoDB `http.request` spans. I'm not sure if I'm missing something or if the `@aws-sdk/client-dynamodb` package is not supported by `dd-trace`. 

![alt text](image-1.png)

But we definitely get an `http.request` span for DynamoDB in our use case in production. 

![alt text](image-2.png)
