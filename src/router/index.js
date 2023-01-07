import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service";
import store from "@/store";
import { nextTick } from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        title: "登录",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: {
        title: "注册",
      },
    },
    {
      path: "/home",
      alias: ["/", "/index"],
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        requiresAuth: true,
        title: "主页",
      },
    },
    {
      path: "/battle",
      name: "battle",
      component: () => import("../views/BattleView.vue"),
      meta: {
        requiresAuth: true,
        title: "对战",
      },
    },
    {
      path: "/battle/battling",
      name: "battling",
      component: () => import("../views/BattlingView.vue"),
      meta: {
        requiresAuth: true,
        title: "对战界面",
      },
    },
    {
      path: "/battle/stats",
      name: "PKStats",
      component: () => import("../views/PKStatsView.vue"),
      meta: {
        requiresAuth: true,
        title: "对战结算",
      },
    },
    // {
    //   path: "/gallery",
    //   name: "gallery",
    //   component: () => import("../views/GalleryView.vue"),
    //   meta: {
    //     requiresAuth: true,
    //     title: "礼品屋",
    //   },
    // },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("../views/FavoritesView.vue"),
      meta: {
        requiresAuth: true,
        title: "收藏夹",
      },
    },
    {
      path: "/personal",
      name: "personal",
      component: () => import("../views/PersonalView.vue"),
      meta: {
        requiresAuth: true,
        title: "个人信息",
      },
      children: [
        {
          path: "history",
          alias: [""],
          name: "history",
          component: () => import("../views/personal/PKHistoryView.vue"),
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../views/personal/SettingsView.vue"),
        },
      ],
    },
    {
      path: "/home/news/:id",
      name: "news",
      component: () => import("../views/NewsView.vue"),
      meta: {
        requiresAuth: true,
        title: "咨询详情",
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
      meta: {
        requiresAuth: true,
        title: "管理员后台",
      },
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("../views/LogoutView.vue"),
      meta: {
        requiresAuth: true,
        title: "退出登录",
      },
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

router.afterEach((to) => {
  nextTick(() => {
    document.title = (to.meta.title ? to.meta.title + " - " : "") + "MarsOJ";
  });
});

export default router;
