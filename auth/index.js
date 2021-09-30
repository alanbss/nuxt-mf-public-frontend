import Vue from 'vue'
import router from '@/router'
import auth from '@websanova/vue-auth'
import authBasic from '@websanova/vue-auth/drivers/auth/devise.js'
import httpAxios from '@websanova/vue-auth/drivers/http/axios.1.x'
import routerVueRouter from '@websanova/vue-auth/drivers/router/vue-router.2.x'

const RESOURCE_URL = '/user_auth'

Vue.router = router

export default Vue.use(auth, {
  auth: authBasic,
  http: httpAxios,
  router: routerVueRouter,

  // Sobreescrevendo as requests data do vue-auth
  registerData: {
    url: RESOURCE_URL,
    method: 'POST',
    fetchUser: true,
    staySignedIn: true,
    redirect: '/cadastro-concluido'
  },
  loginData: {
    url: `${RESOURCE_URL}/sign_in`,
    method: 'POST',
    redirect: '/',
    fetchUser: true,
    staySignedIn: true
  },
  logoutData: {
    url: `${RESOURCE_URL}/sign_out`,
    method: 'DELETE',
    redirect: '/',
    makeRequest: true
  },
  refreshData: {
    url: `${RESOURCE_URL}/validate_token`,
    method: 'GET',
    enabled: true,
    interval: 30
  },
  fetchData: {
    url: `${RESOURCE_URL}/validate_token`,
    method: 'GET',
    enabled: true,
    interval: 30
  }
})
