export type UploadState = {
  success: boolean;
  complete: boolean;
}

export interface UploadService {
  generatePutUploadUrl: (data:{file:File}, options?:any)=>Promise<{url: string, key: string}>;
  generatePostUploadUrl: (data:{file:File}, options?:any)=>Promise<{url: string, key: string}>;
  generateDownloadUrl: (data:{key:string}, options?:any)=>Promise<string>;
  success:(data:{key:string, http: XMLHttpRequest})=>Promise<void>
}