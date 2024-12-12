import { stateManagement } from "@/store";
import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";
import { isRoutesPermitted } from "./rules";
import axiosIns from "@/plugins/axios";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
});
router.beforeEach((to, from, next) => {
  const store = stateManagement();
  if (to.path !== "/error-404") {
    const is_permitted = isRoutesPermitted(store.getUser, to.path);
    if (is_permitted) {
      if (to.name != from.name) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
        if (
          to.name !== "login" &&
          to.name !== "index" &&
          to.name !== "register"
        ) {
          store.loadingHandler(true);
          axiosIns
            .get("auth/verify")
            .then(() => {
              next();
            })
            .catch(() => {
              next({ name: "login" });
            })
            .finally(() => {
              store.loadingHandler(false);
            });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next({ path: "error-404" });
    }
  } else {
    next();
  }
});
router.afterEach((to) => {
  document.title = `${to.meta.title} | AMRETA Network`;
});

export default router;
