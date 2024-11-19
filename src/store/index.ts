import cookie from "js-cookie";
import { defineStore } from "pinia";

export const stateManagement = defineStore({
  id: "stateManagement",
  state: () => ({
    access_token: cookie.get("amr_access_token") || "",
    refresh_token: cookie.get("amr_refresh_token") || "",
    user: cookie.get("amr_user") ? JSON.parse(cookie.get("amr_user")) : null,
    is_loading: false,
  }),
  actions: {
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
    getIsLoading: (state) => state.is_loading,
    isAdmin: (state) => (state.user.role == 1 ? true : false),
    isMemberPPOE: (state) => (state.user.role == 2 ? true : false),
    isMemberHostpot: (state) => (state.user.role == 3 ? true : false),
    isReselerHostpot: (state) => (state.user.role == 4 ? true : false),
    isSalesPPOE: (state) => (state.user.role == 5 ? true : false),
    isNetworkOperator: (state) => (state.user.role == 6 ? true : false),
    isCustomerService: (state) => (state.user.role == 7 ? true : false),
    isEmployee: (state) => (state.user.role == 8 ? true : false),
    isMemberPremium: (state) => (state.user.role == 10 ? true : false),
    isBillCollector: (state) => (state.user.role == 8 ? true : false),
  },
});
