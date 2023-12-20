import { getConfig } from '../config';
import { Client } from 'minio';

export default async (...args) => {
  if (args.length === 3) {
    const [
      bucketName,
      objectName,
      options
    ] = args;

    const mc = new Client({
      endPoint: options.endPoint || getConfig().endPoint,
      accessKey: options.accessKey || getConfig().accessKey,
      secretKey: options.secretKey || getConfig().secretKey
    });
    return await mc.presignedGetObject(bucketName, objectName, 24 * 60 * 60);
  } else if (args.length === 1) {
    const [objectName] = args;
    const mc = new Client({
      endPoint: getConfig().endPoint,
      accessKey: getConfig().accessKey,
      secretKey: getConfig().secretKey
    });
    return await mc.presignedGetObject(getConfig().bucket, objectName, 24 * 60 * 60);
  } else {
    throw new Error('bad params');
  }
};