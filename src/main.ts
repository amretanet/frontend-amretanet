import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import ability from "@/plugins/casl/ability";
import layoutsPlugin from "@/plugins/layouts";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import { abilitiesPlugin } from "@casl/vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "@core/scss/template/index.scss";
import "@styles/custom.scss";
import "@styles/animation.scss";
import "@styles/font-custom.scss";
import "@styles/library-custom.scss";
import "@styles/mobile-responsive.scss";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { createPinia } from "pinia";
import { createApp } from "vue";

loadFonts();

// Create vue app
const app = createApp(App);

// Use plugins
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(layoutsPlugin);
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});

// Global components
app.component("QuillEditor", QuillEditor);
app.component("VueDatePicker", VueDatePicker);

// Mount vue app
app.mount("#app");
