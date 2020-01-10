import Vue from "vue";
import VueCompositionApi from '@vue/composition-api';  //体验 vue3.0特性
import { sync } from "vuex-router-sync";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";

import "normalize.css";
import Animate from "animate.css";
import "@/assets/css/index.scss";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Util from "@/services/util";

import vueGridLayout from 'vue-grid-layout';
Vue.use(vueGridLayout);

Vue.use(VueCompositionApi); //体验 vue3.0特性
Vue.use(ElementUI, { locale });
Vue.use(Animate);
Vue.use(Util);
sync(store, router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  watch: {
    // 监测路径改变相应的 title
    $route: {
      handler: function(route) {
        let title = (route.meta && route.meta.title) || "";
        document.title = "华扬媒体分析系统 - " + title;
      },
      immediate: true
    }
  },
  render: h => h(App)
}).$mount("#app");
