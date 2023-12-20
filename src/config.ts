declare global {
  interface Window {
    __MINIO_CONFIG__: {
      endPoint: string,
      accessKey: string,
      secretKey: string,
      bucket: string,
    }
  }
}

export const setConfig = ({
  endPoint,
  accessKey,
  secretKey,
  bucket
}) => {
  window.__MINIO_CONFIG__ = {
    endPoint,
    accessKey,
    secretKey,
    bucket
  };
};

export const getConfig = () => new Proxy({
  endPoint: '',
  accessKey: '',
  secretKey: '',
  bucket: ''
}, { get: (_, key) => window.__MINIO_CONFIG__[key] });