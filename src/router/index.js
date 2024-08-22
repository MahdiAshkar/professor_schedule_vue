import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import DashboardPage from "../views/DashboardPage.vue";
import NotFoundPage from "../views/NotFoundPage.vue";
import registerPage from "../views/registerPage.vue";
import HomePage from "@/views/HomePage.vue";
import ProfessorPage from "@/views/ProfessorPage.vue";
import ChatPage from "@/views/chatPage.vue";
import StudentLoginPage from "@/views/StudentLoginPage.vue";
import DashboardStudentPage from "@/views/DashboardStudentPage.vue";
import getCookie from "@/utils/function";
import axios from "axios";
const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },

  {
    path: "/student/login",
    name: "StudentLoginPage",
    component: StudentLoginPage,
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
    path: "/chat/:professorId/:studentId/:isStudent/:senderName/:imageProfessor/:imageStudent",
    name: "chatPage",
    component: ChatPage,
    meta: { chatAuth: true, requiresAuth: true },
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
    meta: { AuthProfessor: true },
  },
  {
    path: "/student/dashboard:id",
    name: "DashboardStudentPage",
    component: DashboardStudentPage,
    meta: { AuthStudent: true },
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

let isAuth = false;
router.beforeEach(async (to, from, next) => {
  const profToken = getCookie("access_token");
  const stuToken = getCookie("student_token");
  if (to.matched.some((record) => record.meta.chatAuth)) {
    const isStudent = to.params.isStudent === "true";
    const studentId = to.params.studentId;
    const professorId = to.params.professorId;
    try {
      let res;
      if (isStudent) {
        res = await axios.get(
          `http://localhost:3000/checkId/${studentId}/${stuToken}`
        );
      } else {
        res = await axios.get(
          `http://localhost:3000/checkId/${professorId}/${profToken}`
        );
      }
      const isAuthChat = res.data;
      console.log(isAuthChat);
      if (!isStudent && !profToken) {
        next({ name: "NotFoundPage" });
      } else if (!isAuthChat) {
        next({ name: "NotFoundPage" });
      } else if (isStudent && !stuToken) {
        next({ name: "NotFoundPage" });
      } else if (!isStudent && profToken) {
        next();
      } else {
        next();
      }
    } catch (error) {
      console.error("Error during authentication", error);
      next({ name: "NotFoundPage" });
    }
  } else {
    next();
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!profToken && !stuToken) {
      next({ name: "NotFoundPage" });
    } else if (profToken || stuToken) {
      next();
    } else {
      next({ name: "NotFoundPage" });
    }
  } else {
    next();
  }
});
router.beforeEach(async (to, from, next) => {
  const profToken = getCookie("access_token");
  const stuToken = getCookie("student_token");
  if (to.matched.some((record) => record.meta.AuthProfessor)) {
    const id = to.params.id;
    try {
      const res = await axios.get(
        `http://localhost:3000/checkId/${id}/${profToken}`
      );
      isAuth = res.data;

      if (profToken && isAuth) {
        next();
      } else {
        next({ name: "NotFoundPage" });
      }
    } catch (error) {
      console.error("Error during authentication", error);
      next({ name: "NotFoundPage" });
    }
  } else if (to.matched.some((record) => record.meta.AuthStudent)) {
    const id = to.params.id;
    try {
      const res = await axios.get(
        `http://localhost:3000/checkId/${id}/${stuToken}`
      );
      isAuth = res.data;
      if (stuToken && isAuth) {
        next();
      } else {
        next({ name: "NotFoundPage" });
      }
    } catch (error) {
      console.error("Error during authentication", error);
      next({ name: "NotFoundPage" });
    }
  } else {
    next();
  }
});

export default router;
