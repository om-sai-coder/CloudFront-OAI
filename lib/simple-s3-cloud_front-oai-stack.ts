// Imports.
import { Construct } from "constructs";
import {
  Stack,
  StackProps,
  aws_s3 as s3,
  RemovalPolicy,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
} from "aws-cdk-lib";

export interface SimpleS3CloudFrontOaiStackProps extends StackProps {
  deployment_environment: string;
}

export class SimpleS3CloudFrontOaiStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: SimpleS3CloudFrontOaiStackProps
  ) {
    super(scope, id, props);
    const applicationName = "SimpleS3CloudFrontOAIStack";
    const deployment_environment = props.deployment_environment;
    // Creating an S3 Bucket.
    const s3_bucket = new s3.Bucket(
      this,
      `s3-${applicationName}-${deployment_environment}`,
      {
        bucketName: `s3-simples3cloudfrontoaistack-${deployment_environment}`,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }
    );
    // Creating an Origin Access Identity
    const oai = new cloudfront.OriginAccessIdentity(
      this,
      `oai-${applicationName}-${deployment_environment}`,
      {
        comment: "OAI",
      }
    );
    // Grant Origin Access Identity Access to S3 Bucket.
    s3_bucket.grantRead(oai);
    // Creating a Cloudfront Distribution
    const cloudfront_distribution = new cloudfront.Distribution(
      this,
      `cf-${applicationName}-${deployment_environment}`,
      {
        defaultBehavior: {
          origin: new origins.S3Origin(s3_bucket, {
            originAccessIdentity: oai,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
      }
    );
  }
}
