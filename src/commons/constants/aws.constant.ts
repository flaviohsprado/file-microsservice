import 'dotenv/config';

export const config = {
  bucketName: String(process.env.AWS_S3_BUCKET),
  defaultRegion: String(process.env.DEFAULT_REGION),
  defaultFilesACL: String(process.env.DEFAULT_FILES_ACL),
  accessKeyId: String(process.env.AWS_ACCESS_KEY),
  secretAccessKey: String(process.env.AWS_SECRET_ACCESS),
  endpoint: 'http://localhost:3000',
};
