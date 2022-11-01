import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/home/battle",
      name: "battle",
      component: () => import("../views/BattleView.vue"),
    },
    {
      path: "/home/gallery",
      name: "gallery",
      component: () => import("../views/GalleryView.vue"),
    },
    {
      path: "/home/favorites",
      name: "favorrites",
      component: () => import("../views/FavoritesView.vue"),
    },
    {
      path: "/home/personal",
      name: "personal",
      component: () => import("../views/PersonalView.vue"),
    },
    {
      path: "/home/news",
      name: "news",
      component: () => import("../views/NewsView.vue"),
    },
  ],
});

export default router;
