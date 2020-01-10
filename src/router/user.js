/*
 * 用户登录
 */
import store from "@/store";
import Layout from "@/components/layout";
import Login from "@/components/login";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Login"
    }
  }
];

export default routes;
