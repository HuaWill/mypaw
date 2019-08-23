import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './pages/main.vue';
import { reachBottomNotify /*, functionalTool */ } from './utils';

// Vue.use(VueRouter);
// Vue.use(functionalTool);
Vue.use(reachBottomNotify);

// const router = new VueRouter();

new Vue({
  el: '#app',
  render: h => h(Main)
});
