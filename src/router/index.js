import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import userRoute from "./user";
import homeRoute from "./home";
import reportCenterRoute from "./report-center";
import dataSourceRoute from "./data-source";
import settingsRoute from "./settings";
Vue.use(Router);

let routes = [].concat(
  userRoute,
  homeRoute,
  reportCenterRoute,
  dataSourceRoute,
  settingsRoute
);

let isLogin = () => {
  return store.getters["user/isLogin"];
};

const router = new Router({
  routes: routes
});

router.beforeEach((to, from, next) => {
  if (isLogin()) {
    next();
  } else {
    
    if(to.fullPath=="/login"){
      next();
    }else{
      next("/login");
    }
    // router.go("/login");
    // next();

    // console.log("login------", router);
    // next({
    //   path: "/login",
    //   query: { redirect: to.fullPath }
    // });
  }
});

export default router;
