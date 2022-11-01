import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/home",
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

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register", "/home"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
