import cookie from "js-cookie";
import { defineStore } from "pinia";

export const stateManagement = defineStore({
  id: "stateManagement",
  state: () => ({
    access_token: cookie.get("amr_access_token") || "",
    refresh_token: cookie.get("amr_refresh_token") || "",
    user: cookie.get("amr_user") ? JSON.parse(cookie.get("amr_user")) : null,
    current_router: cookie.get("amr_router") || "AMRETA-2021",
    is_loading: false,
  }),
  actions: {
    routerHandler(value: string) {
      cookie.set("amr_router", value);
      this.$state.current_router = value;
    },
    loadingHandler(value: boolean) {
      this.$state.is_loading = value;
    },
    logoutHandler() {
      cookie.remove("amr_access_token");
      cookie.remove("amr_refresh_token");
      cookie.remove("amr_user");
      window.location.href = "/login";
    },
    tokenHandler(access_token: string, refresh_token: string) {
      cookie.set("amr_access_token", access_token);
      cookie.set("amr_refresh_token", refresh_token);
      this.$state.access_token = access_token;
      this.$state.refresh_token = refresh_token;
    },
    userHandler(user_data: any) {
      cookie.set("amr_user", JSON.stringify(user_data));
      this.$state.user = user_data;
    },
  },
  getters: {
    getUser: (state) => state.user,
    getAccessToken: (state) => state.access_token,
    getRefreshToken: (state) => state.refresh_token,
    getCurrentRouter: (state) => state.current_router,
    getIsLoading: (state) => state.is_loading,
    isOwnerAdmin: (state) =>
      state.user.role == 0 || state.user.role == 1 ? true : false,
    isOwner: (state) => (state.user.role == 0 ? true : false),
    isAdmin: (state) => (state.user.role == 1 ? true : false),
    isSales: (state) => (state.user.role == 2 ? true : false),
    isCustomerService: (state) => (state.user.role == 3 ? true : false),
    isNetworkOperator: (state) => (state.user.role == 4 ? true : false),
    isEngineer: (state) => (state.user.role == 5 ? true : false),
    isMitra: (state) => (state.user.role == 6 ? true : false),
    isCustomer: (state) => (state.user.role == 99 ? true : false),
  },
});
