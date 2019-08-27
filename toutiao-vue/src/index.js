import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './pages/main.vue';
import Setting from './pages/setting.vue';
import Detail from './pages/detail.vue';
import Text from './components/detail-page/text.vue';
import Video from './components/detail-page/video.vue';
import { reachBottomNotify /*, functionalTool */ } from './utils';

Vue.use(VueRouter);
// Vue.use(functionalTool);
Vue.use(reachBottomNotify);

const routes = [
  {
    path: '/page',
    component: Main
  },
  {
    path: '/setting',
    component: Setting
  },
  {
    path: '/detail/:id',
    component: Detail,
    children: [
      {path: 'video', component: Video},
      {path: 'text', component: Text}
    ]
  }
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log('scrollBehavior:', to, from , savedPosition);
    return savedPosition;
  }
});

new Vue({
  el: '#app',
  router,
  // render: h => h(Main)
  render(createElement) {
    return createElement('router-view');
  }
});
