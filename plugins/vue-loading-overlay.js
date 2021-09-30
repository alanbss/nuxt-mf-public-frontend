import Vue from 'vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.use(Loading, {
  // props
  color: '#0cb695',
  loader: 'spinner', //spinner/dots/bars
  width: 110,
  height: 110,
  backgroundColor: '#0cb695',
  opacity: 0.3,
  isFullPage: true,

});
Vue.component('loading-overlay', Loading);