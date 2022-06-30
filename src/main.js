import { createApp } from 'vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/assets/css/global.css'
import {hasPerm} from '@/utils/permission'
import * as filters from './filters' // global filters

const app = createApp(App)
app.use(store)
app.use(ElementPlus, {
    locale: zhCn,
    size:'small',
})
app.use(router)
app.use(hasPerm)
app.mount('#app')


