#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SimpleS3CloudFrontOaiStack } from "../lib/simple-s3-cloud_front-oai-stack";

const app = new cdk.App();
new SimpleS3CloudFrontOaiStack(app, "SimpleS3CloudFrontOaiStack", {
  deployment_environment: "sandbox",
  env: { account: "ACCOUNT_NUMBER", region: "REGION" },
});
