import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "sandbox",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-domain-manager"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    stage: "${env:MS_STAGE, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    deploymentBucket: {
      name: "${ssm:/lambdas-${self:provider.stage}}", //repo infra
      serverSideEncryption: "AES256",
    },
    environment: {
      MS_STAGE: "${self:provider.stage}",
      MS_NAME: "${self:service}",
      USERS_TABLE: "${self:provider.stage}-user",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
              "dynamodb:Query",
              "dynamodb:Scan"
            ],
            Resource: [
              "arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:provider.stage}-user",
              "arn:aws:dynamodb:${aws:region}:${aws:accountId}:table/${self:provider.stage}-user/index/*"
            ]
          }
        ]
      }
    },
  },
  package: {
    individually: true,
    excludeDevDependencies: true,
    patterns: [
      "src/schema/**"
    ]
  },
  custom: {
    version: "v1",
    prefix: "/${self:service}/${self:provider.stage}",
    customDomain: {
      basePath: "${self:service}",
      domainName: "${ssm:domain-api-gateway-${self:provider.stage}}",
      stage: "${self:provider.stage}",
      certificateName: "${ssm:certificate-name-prod}",
      createRoute53Record: false,
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
      external: [
        "@nestjs/microservices",
        "@nestjs/websockets",
        "cache-manager",
        "class-transformer",
        "class-validator"
      ]
    },
  },
  functions: {
    nutriplan: {
      handler: "src/lambda.handler",
      events: [
        {
          http: {
            method: "any",
            path: "/{proxy+}",
            cors: true
          }
        },
        {
          http: {
            method: "any",
            path: "/",
            cors: true
          }
        }
      ]
    }
  },
};

module.exports = serverlessConfiguration;
