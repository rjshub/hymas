/*
 * report-center
 */
import store from "@/store";
import Layout from "@/components/layout";
import CustomReport from "@/views/report-center/custom-report";
import CustomReportSPDDetail from "@/views/report-center/custom-report/spd-detail";
import CustomReportAddReport from "@/views/report-center/custom-report/add-report";
import CustomReportAddReportDetail from "@/views/report-center/custom-report/add-report/detail";

const routes = [
  {
    path: "/report-center",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "custom-report"
      },
      {
        path: "custom-report",
        name: "customReport",
        meta: {
          title: "Custom Report",
          route: "report-center",
          subRoute: "custom-report"
        },
        component: CustomReport // () => import(/* webpackChunkName: "report-center" */ "@/views/report-center/custom-report")
      },
      {
        path: "custom-report/spd-detail",
        name: "customReportSPDDetail",
        meta: {
          title: "Custom Report",
          route: "report-center",
          subRoute: "custom-report"
        },
        component: CustomReportSPDDetail // () => import(/* webpackChunkName: "report-center" */ "@/views/report-center/custom-report/detail")
      },
      {
        path: "custom-report/add-report",
        name: "CustomReportAddReport",
        meta: {
          title: "Custom Report",
          route: "report-center",
          subRoute: "custom-report"
        },
        component: CustomReportAddReport // () => import(/* webpackChunkName: "report-center" */ "@/views/report-center/custom-report/detail")
      },
      {
        path: "custom-report/add-report-detail",
        name: "CustomReportAddReportDetail",
        meta: {
          title: "Custom Report",
          route: "report-center",
          subRoute: "custom-report"
        },
        component: CustomReportAddReportDetail // () => import(/* webpackChunkName: "report-center" */ "@/views/report-center/custom-report/detail")
      },
    ]
  }
];

export default routes;
