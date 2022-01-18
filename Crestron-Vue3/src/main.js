import { createApp } from "vue";
import * as CrComLib from "@crestron/ch5-crcomlib/build_bundles/cjs/cr-com-lib";
import { Icon } from "@iconify/vue/dist/offline";
import App from "./App.vue";
import router from "./router";
import store from "./store";

export default {
  return: Icon,
};

createApp(App).use(store).use(router).use(CrComLib).mount("#app");
