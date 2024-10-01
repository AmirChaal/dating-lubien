import axios from 'axios'
import VueAxios from 'vue-axios'
import AsyncComputed from 'vue-async-computed'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import { definePreset } from '@primevue/themes';

const Noir = definePreset(Lara, {
   semantic: {
      primary: {
         50: '{sky.50}',
         100: '{sky.100}',
         200: '{sky.200}',
         300: '{sky.300}',
         400: '{sky.400}',
         500: '{sky.500}',
         600: '{sky.600}',
         700: '{sky.700}',
         800: '{sky.800}',
         900: '{sky.900}',
         950: '{sky.950}'
      },
   }
});

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "./router";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import './assets/scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App)
   .use(pinia)
   // .use(router)
   .use(VueAxios, axios)
   .use(AsyncComputed)
   .use(PrimeVue, {
      theme: {
         preset: Noir,
         options: { darkModeSelector: '.dark-mode', }
      },
   })
   .mount('#app')
