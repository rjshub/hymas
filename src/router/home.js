/*
 * home
 */
import store from "@/store";
import Layout from "@/components/layout";
import CustomPage from "@/views/home/index";
// import CategoryOverview from "@/views/home/category-overview";
// import ElcBrands from "@/views/home/elc-brands";
// import OtherBrands from "@/views/home/other-brands";

const routes = [
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "custom-page"
      },
      {
        path: "custom-page",
        name: "customPage",
        meta: {
          title: "custom-page",
          route: "home",
          subRoute: "custom-page"
        },
        component: CustomPage
      }
    ]
  }
];

export default routes;
