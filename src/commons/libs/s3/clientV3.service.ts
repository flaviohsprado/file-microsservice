import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../../constants/aws.constant';

export const s3ClientV3 = new S3Client({
  region: config.defaultRegion,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});
