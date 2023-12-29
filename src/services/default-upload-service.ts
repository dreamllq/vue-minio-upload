import { UploadService } from '@/types';
import { v4 as uuidV4 } from 'uuid';
import { BaseUploadService } from './base-upload-services';

export class DefaultUploadService extends BaseUploadService implements UploadService {
  url: string;
  keyMap: Map<string, string> = new Map();

  constructor(data:{url: string}) {
    super();
    this.url = data.url;
  }
  
  async generatePutUploadUrl(data: { file: File; }, options?: any) : Promise<{ url: string; key: string; }> {
    const key = uuidV4();
    return {
      url: this.url,
      key: key
    };
  }
  
  async generatePostUploadUrl(data: { file: File; }, options?: any) : Promise<{ url: string; key: string; }> {
    const key = uuidV4();
    return {
      url: this.url,
      key: key
    };
  }

  async generateDownloadUrl (data: { key: string; }, options?: any) : Promise<string> {
    return this.keyMap.get(data.key)!;
  }
}