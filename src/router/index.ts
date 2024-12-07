import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
});
router.beforeEach((to) => {
  // console.log(to);
  // if (to.name == "index") {
  //   window.location.href = "/landing-page/index.html";
  // }
});
router.afterEach((to) => {
  document.title = `${to.meta.title} | AMRETA Network`;
});

export default router;
