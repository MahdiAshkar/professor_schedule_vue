import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import NotFoundPage from "../views/NotFoundPage.vue";
import registerPage from "../views/registerPage.vue";
import HomePage from "@/views/HomePage.vue";
import ProfessorPage from "@/views/ProfessorPage.vue";
const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/professor/:id",
    name: "ProfessorPage",
    component: ProfessorPage,
  },
  {
    path: "/register",
    name: "registerPage",
    component: registerPage,
  },
  {
    path: "/dashboard:id",
    name: "DashboardPage",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFoundPage",
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const authToken = getCookie("access_token");
    if (!authToken) {
      next({ name: "NotFoundPage" });
    } else {
      next();
    }
  } else {
    next();
  }
});
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default router;
