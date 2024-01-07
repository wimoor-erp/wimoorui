import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/assets/css/global.css'
import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/assets/css/css-vars.css'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import {hasPerm,dataType} from '@/utils/permission'
import print from 'vue3-print-nb'
import * as filters from './filters' // global filters
import {listDictsByCode} from '@/api/sys/admin/dict'
import Pagination from '@/components/Pagination/index.vue'
import GlobalTable from "@/components/Table/GlobalTable/index";
import mitt from 'mitt';
const emitter = mitt();
const app = createApp(App)
app.use(store)
app.use(ElementPlus, {
    locale: zhCn,
    size:'default',
})
app.config.globalProperties.listDictsByCode = listDictsByCode;
app.use(router)
app.use(hasPerm)
app.use(dataType)
app.use(print)
app.component('Pagination', Pagination)
app.component('GlobalTable', GlobalTable)
app.provide('emitter', emitter); // 注入provider
app.mount('#app')


