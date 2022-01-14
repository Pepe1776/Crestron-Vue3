import { createApp } from 'vue'
import * as CrComLib from '@crestron/ch5-crcomlib'
import App from './App.vue'

createApp(App).mount('#app').use(CrComLib)
