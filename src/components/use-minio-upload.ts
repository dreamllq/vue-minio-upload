import { ref, computed } from 'vue';
import { ct } from '@/locales';
import { UploadService } from '@/types';



export const useMinioUpload = (service:UploadService, { file, uploadType }) => {

  const progress = ref(0);
  const downloadUrl = ref('');
  const complete = ref(false);
  const success = ref(false);
  const error = ref<any>(null);
  const http = new XMLHttpRequest();
  let _abort = false;
  let _sended = false;

  const upload = async () => {
    let uploadUrl = '';
    let downloadKey = 'POST';
    if (uploadType === 'PUT') {
      const { url, key } = await service.generatePutUploadUrl({ file: file });
      uploadUrl = url;
      downloadKey = key;
    } else if (uploadType === 'POST') {
      const { url, key } = await service.generatePostUploadUrl({ file: file });
      uploadUrl = url;
      downloadKey = key;
    }

    if (_abort) return;
    http.upload.addEventListener('progress', (e) => { 
      progress.value = e.loaded / e.total;
    }, false);

    http.onload = async () => {
      if (http.status === 200 && http.status < 300 || http.status === 304) {
        try {
          service.success && await service.success({
            key: downloadKey,
            http 
          });
          downloadUrl.value = await service.generateDownloadUrl({ key: downloadKey });
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
    

    http.open(uploadType, uploadUrl, true);
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
    progress,
    downloadUrl,
    success,
    error,
    complete
  };
};