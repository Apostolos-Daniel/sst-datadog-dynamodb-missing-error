import { StackContext, Api, EventBus, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const table = new Table(stack, "exampleTable", {
    fields: {
      pk: "string",
      sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus, table],
        environment: {
          DD_TRACE_DISABLED_PLUGINS: "dns",
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /x86_64": {
        function: {
          handler: "packages/functions/src/x86_64.handler",
          architecture: "x86_64",
        },
      },
      "GET /arm_64": {
        function: {
          handler: "packages/functions/src/arm_64.handler",
          architecture: "arm_64",
        },
      },
      "GET /todo": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
