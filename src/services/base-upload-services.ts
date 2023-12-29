export class BaseUploadService {
  keyMap: Map<string, string> = new Map();

  async success (data: { key: string; http: XMLHttpRequest; }) : Promise<void> {
    const url = data.http.responseText;
    this.keyMap.set(data.key, url);
  }
}