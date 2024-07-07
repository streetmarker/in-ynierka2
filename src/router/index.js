import { createRouter, createWebHashHistory } from "vue-router";
import AdminPage from "../views/AdminPage.vue";
import ClientMakeVisit from "../components/VisitPaymentDialog.vue";
import ClientPanelPage from "../views/ClientPanelPage.vue";
import ClientTutorListPage from "../views/ClientTutorListPage.vue";
import TutorAdmin from "../views/TutorAdmin.vue";
import TutorManager from "../views/TutorManager.vue";
import XLandingPage from "../views/XLandingPage.vue";
import TutorRegister from "../views/TutorRegister.vue";
import { trackRouter } from "vue-gtag-next";

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
    path: "/tutor-register",
    name: "tutor-register",
    component: TutorRegister,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

trackRouter(router, {
  useScreenview: true
});

router.afterEach((to) => {
  gtag('event', 'screen_view', {
    'app_name': 'TutorApp',
    'screen_name' : to.path
  });
});


export default router;
