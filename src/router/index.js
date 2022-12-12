import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      alias: ["/", "/index"],
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/battle",
      name: "battle",
      component: () => import("../views/BattleView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/battle/battling",
      name: "battling",
      component: () => import("../views/BattlingView.vue"),
    },
    {
      path: "/battle/stats",
      name: "PKStats",
      component: () => import("../views/PKStatsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/gallery",
      name: "gallery",
      component: () => import("../views/GalleryView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("../views/FavoritesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/personal",
      name: "personal",
      component: () => import("../views/PersonalView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/home/news/:id",
      name: "news",
      component: () => import("../views/NewsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/personal/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // trying to access a restricted page + not logged in
  // redirect to login page
  // const loggedIn = localStorage.getItem("user");
  const authRequired = to.matched.some((record) => record.meta.requiresAuth);
  if (authRequired) {
    AuthService.loginState().then(
      (user) => {
        if (!store.getters.loggedIn) {
          store.dispatch("auth/alter", user);
        }
        next();
      },
      () => {
        if (store.getters.loggedIn) {
          store.dispatch("auth/alter", null);
        }
        next("/login");
      }
    );
  } else {
    next();
  }
});

export default router;
