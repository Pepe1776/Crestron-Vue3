import Vue from 'vue';
import VueRouter from 'vue-router';



Vue.use(VueRouter);

const routes = [
  {
    path: '/presentation',
    name: "Presentation",
    component: Presentation
  }
]


const router = new VueRouter({
  routes,
  mode: 'abstract'  // keeps the URL from changing
})

export default router