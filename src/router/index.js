import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ()=>import("../views/TimeTable.vue"),
    },
    {
      path: "/time_setting",
      name: "time_setting",
      component: () => import("../views/TimeSetting.vue"),
    },
  ],
});

export default router;
