import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = process.env.VUE_APP_REST_API_URL

axios.interceptors.response.use(function (response) {
  Vue.auth.token('auth_token_default', null);
  return response;
}, function (error) {
  return Promise.reject(error);
});

Vue.use(VueAxios, axios)

export default {
  root: process.env.VUE_APP_REST_API_URL
}
