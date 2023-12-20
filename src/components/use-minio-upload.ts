import { Client } from 'minio';
import { ref, computed } from 'vue';
import { getConfig } from '../config';
import { isFunction, isString } from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { ct } from '@/locales';

let _mc: Client;

const mc = new Proxy({}, {
  get: (_, key) => {
    if (!_mc) {
      _mc = new Client({
        endPoint: getConfig().endPoint,
        accessKey: getConfig().accessKey,
        secretKey: getConfig().secretKey
      });
    }

    return _mc[key];
  }
}) as Client;

export const useMinioUpload = ({ file, dir, filename }) => {
  let path: string;
  if (isFunction(dir)) {
    path = dir(file);
  } else if (isString(dir)) {
    path = dir;
  } else {
    path = 'temp';
  }

  let fn: string;
  if (isFunction(filename)) {
    fn = filename(file);
  } else {
    const uuid = uuidV4();
    fn = file.name.replace(/^.+?(\..+?)$/, `${uuid}$1`);
  }

  const bucketName = getConfig().bucket;
  const progress = ref(0);
  const progressString = computed(() => `${Math.floor(progress.value * 100)}%`);
  const downloadUrl = ref('');
  const complete = ref(false);
  const success = ref(false);
  const error = ref<any>(null);
  const objectName = `${path}/${fn}`;
  const http = new XMLHttpRequest();
  let _abort = false;
  let _sended = false;

  const upload = async () => {
    const filePutUrl = await mc.presignedPutObject(bucketName, objectName, 24 * 60 * 60);

    if (_abort) return;
    http.upload.addEventListener('progress', (e) => { 
      progress.value = e.loaded / e.total;
    }, false);

    http.onload = async () => {
      if (http.status === 200 && http.status < 300 || http.status === 304) {
        try {
          downloadUrl.value = await mc.presignedGetObject(bucketName, objectName, 24 * 60 * 60);
          success.value = true;
          complete.value = true;
        } catch (e: any) {
          error.value = e;
          complete.value = true;
        }
      } else {
        error.value = new Error(ct('warning.failed'));
        complete.value = true;
      }
    };

    http.onerror = () => {
      error.value = new Error(ct('warning.failed'));
      complete.value = true;
    };
    

    http.open('PUT', filePutUrl, true);
    http.send(file);
    _sended = true;
  };

  const abort = () => {
    _abort = true;
    if (_sended === true) {
      http.abort();
      _sended = false;
    }
  };

  upload().catch(e => {
    error.value = e;
    complete.value = true;
    console.error(e);
  });
  return {
    abort,
    fileName: fn,
    realFileName: file.name,
    dir: path,
    objectName,
    bucket: bucketName,
    progress,
    progressString,
    downloadUrl,
    success,
    error,
    complete
  };
};