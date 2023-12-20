import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './custom.scss';
// import Layout from './layout.vue'
import NotFound from './not-found.vue'
import DefaultTheme from 'vitepress/theme'
import Demo from '../../global/demo/demo.vue'
import { setConfig } from 'lc-vue-minio-upload'

export default {
  ...DefaultTheme,
  // Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {
    app.use(ElementPlus);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    app.component('Demo', Demo)

    setConfig({
      endPoint:'file.dev.alsi.cn',
      accessKey:'developer',
      secretKey:'developer@ASDL-APS',
      bucket:'dev',
    })

    setConfig({
      endPoint:'file.uat.alsi.cn',
      accessKey:'developer',
      secretKey:'developer@ASDL-APS',
      bucket:'uat',
    })

    // setConfig({
    //   endPoint:'file.sit.alsi.cn',
    //   accessKey:'minio',
    //   // secretKey:'5mrE2KHRDzm6DMQL',
    //   secretKey:'37BgWp!0$byVbMl&',
    //   bucket:'test',
    // })
  }
};