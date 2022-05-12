import { config } from '../../constants/aws.constant';
import { S3 } from 'aws-sdk';

export const s3ClientV2 = new S3({
  region: config.defaultRegion,
  signatureVersion: 'v4',
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  apiVersion: '2006-03-01',
});
