import { createRouter, createWebHashHistory } from "vue-router";
import AdminPage from "../views/AdminPage.vue";
import ClientMakeVisit from "../views/ClientMakeVisit.vue";
import ClientPanelPage from "../views/ClientPanelPage.vue";
import ClientTutorListPage from "../views/ClientTutorListPage.vue";
import TutorAdmin from "../views/TutorAdmin.vue";
import TutorManager from "../views/TutorManager.vue";
import XLoginPage from "../views/XLoginPage.vue";
import XWelcomePage from "../views/XWelcomePage.vue";
import XLandingPage from "../views/XLandingPage.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: XLandingPage,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminPage,
  },
  {
    path: "/visit",
    name: "visit",
    component: ClientMakeVisit,
  },
  {
    path: "/panel",
    name: "client-panel",
    component: ClientPanelPage,
  },
  {
    path: "/tutor-list",
    name: "tutor-list",
    component: ClientTutorListPage,
  },
  {
    path: "/tutor-admin",
    name: "tutor-admin",
    component: TutorAdmin,
  },
  {
    path: "/tutor-manager",
    name: "tutor-manager",
    component: TutorManager,
  },
  {
    path: "/login",
    name: "login",
    component: XLoginPage,
  },
  {
    path: "/welcome",
    name: "welcome",
    component: XWelcomePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
