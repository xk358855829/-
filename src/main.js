// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// import html2canvas from 'html2canvas';
import store from './store/index.js';
import Vuex from 'vuex';
import axios from 'axios';
import Qs from 'qs';
import Mint from 'mint-ui';
import './assets/css/mint.scss';//全局修改mint-UI样式
import'mint-ui/lib/style.css';
import Video from 'video.js';
import 'video.js/dist/video-js.css';

Vue.prototype.$video = Video

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

// router.beforeEach((to,from,next)=>{
//   if(to.meta.title){
//     document.title=to.meta.title
//   }else{
//     document.title="智能门锁"
//   }
// })

Vue.use(Vuex);
Vue.use(Mint);
router.beforeEach((to, from, next) => {
  console.log(to,next)
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export default app;