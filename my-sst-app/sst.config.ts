import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Datadog } from "datadog-cdk-constructs-v2";
import { Stack } from "sst/constructs";
const ddPlugin = require('dd-trace/esbuild');

export default {
  config(_input) {
    return {
      name: "my-sst-app",
      region: "us-east-1",
    };
  },
  async stacks(app) {
    const datadogApiKeySecretArn =
      "arn:aws:secretsmanager:us-east-1:643476110649:secret:DdApiKeySecret-XiVnMDcSAlrU-GhvrL0";
    // Allow functions to access secret
    app.addDefaultFunctionPermissions([
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [datadogApiKeySecretArn],
        actions: ["secretsmanager:GetSecretValue"],
      }),
    ]);
    app.setDefaultFunctionProps({
      nodejs: {
        esbuild: {
          external: ["datadog-lambda-js", "dd-trace"],
          plugins: [ddPlugin],
        },
      },
      environment: {
        DD_TRACE_DISABLED_PLUGINS: "dns",
      },
    });
    app.stack(API);
    await app.finish();

    // Attach the Datadog contruct to each stack
    app.node.children.forEach((stack) => {
      if (stack instanceof Stack) {
        const datadog = new Datadog(stack, "datadog", {
          // Get the latest version from
          // https://github.com/Datadog/datadog-lambda-js/releases
          nodeLayerVersion: 107,
          // Get the latest version from
          // https://github.com/Datadog/datadog-lambda-extension/releases
          extensionLayerVersion: 55,
          site: "datadoghq.eu",
          apiKeySecretArn: datadogApiKeySecretArn,
          enableColdStartTracing: true,
          env: app.stage,
          service: app.name,
          version: "1.0.0",
        });

        datadog.addLambdaFunctions(stack.getAllFunctions());
      }
    });
  },
} satisfies SSTConfig;
