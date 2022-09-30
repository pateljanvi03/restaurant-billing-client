import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import VModal from 'vue-js-modal/dist/index.nocss.js'
import 'vue-js-modal/dist/styles.css'

Vue.use(VModal)

import './assets/main.css'
import { ValidationProvider, ValidationObserver } from 'vee-validate/dist/vee-validate.full.esm';

Vue.config.productionTip = false

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL || "http://localhost:5000";

// Register it globally
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
