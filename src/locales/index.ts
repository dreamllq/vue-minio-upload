import { useLocale } from 'element-plus';
import { get } from 'lodash';
import zhCn from './zh-cn';
import en from './en';
import ja from './ja';

const locales = {
  'zh-cn': zhCn,
  en,
  ja 
};

export default locales;

export const ct = (path:string, option?:Record<string, string | number>) => {
  const { lang } = useLocale();
  const locale = locales[lang.value] || locales['zh-cn'];
  const str = get(locale, path, undefined) || get(locales['zh-cn'], path, undefined) || path;
  return str.replace(/\{(\w+)\}/g, (_, key) => {
    let _a;
    return `${(_a = option === null ? void 0 : option?.[key]) !== null ? _a : `{${key}}`}`;
  });
};