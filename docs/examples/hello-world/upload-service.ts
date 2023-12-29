import { Client } from 'minio';
import { v4 as uuidV4 } from 'uuid';
import { isFunction, isString } from 'lodash';
import { type UploadService } from 'lc-vue-minio-upload';

export class MinioUploadService implements UploadService {

  bucket:string;
  mc: Client;
  dir?: string | ((file: File)=>string);
  filename?: (file: File)=>string;

  constructor(data:{ endPoint:string, accessKey:string, secretKey:string, bucket:string, dir?:string | ((file: File)=>string), filename?:(file: File)=>string }) {
    this.bucket = data.bucket;
    this.dir = data.dir;
    this.filename = data.filename;
    
    this.mc = new Client({
      endPoint: data.endPoint,
      accessKey: data.accessKey,
      secretKey: data.secretKey
    });
  }

  async generatePutUploadUrl (data:{file:File}):Promise<{url: string, key: string}> {
    let path: string;
    if (isFunction(this.dir)) {
      path = this.dir(data.file);
    } else if (isString(this.dir)) {
      path = this.dir;
    } else {
      path = 'temp';
    }

    let filename: string;
    if (isFunction(this.filename)) {
      filename = this.filename(data.file);
    } else {
      const uuid = uuidV4();
      filename = data.file.name.replace(/^.+?(\..+?)$/, `${uuid}$1`);
    }
    const objectName = `${path}/${filename}`;
    const url = await this.mc.presignedPutObject(this.bucket, objectName, 24 * 60 * 60);
    return {
      url: url,
      key: objectName
    };
  }
  async generatePostUploadUrl(data:{file:File}, options?:any):Promise<{url: string, key: string}> {
    return {
      url: '',
      key: '' 
    };
  }
  async generateDownloadUrl(data:{key:string}):Promise<string> {
    const url = await this.mc.presignedGetObject(this.bucket, data.key, 24 * 60 * 60);
    return url;
  }
}