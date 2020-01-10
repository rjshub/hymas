/*
 * data-source
 */
import store from "@/store";
import Layout from "@/components/layout";
import DataList from "@/views/data-source/data-list";
import FormatSetting from '@/views/data-source/format-setting';
import DataListAdd from "@/views/data-source/data-list/add";
import PerformanceDetail from "@/views/data-source/data-list/detail/performance-detail";
import CompetitorsDetail from "@/views/data-source/data-list/detail/competitors-detail";
import FormatCreate from "@/views/data-source/format-setting/createIndex";
import FormatList from '@/views/data-source/format-setting/listIndex';

const routes = [
  {
    path: "/data-source",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "data-list"
      },
      {
        path: "data-list",
        name: "dataList",
        meta: {
          title: "Data List",
          route: "data-source",
          subRoute: "data-list"
        },
        component: DataList //  () => import(/* webpackChunkName: "data-source" */ "@/views/data-source/data-list")
      },
      {
        path: "data-list-add",
        name: "dataListAdd",
        meta: {
          title: "Data List",
          route: "data-source",
          subRoute: "data-list"
        },
        component: DataListAdd //() => import(/* webpackChunkName: "data-source" */ "@/views/data-source/data-list/add")
      },
      {
        path: "data-list/performance-detail",
        name: "dataListPerformanceDetail",
        meta: {
          title: "Data List",
          route: "data-source",
          subRoute: "data-list"
        },
        component: PerformanceDetail // () => import(/* webpackChunkName: "data-source" */ "@/views/data-source/data-list/detail/performance-detail")
      },
      {
        path: "data-list/competitors-detail",
        name: "dataListCompetitorsDetail",
        meta: {
          title: "Data List",
          route: "data-source",
          subRoute: "data-list"
        },
        component: CompetitorsDetail // () => import(/* webpackChunkName: "data-source" */ "@/views/data-source/data-list/detail/competitors-detail")
      },
      {
        path: "format-setting",
        name: "FormatSetting",
        meta: {
          title: "Format Setting",
          route: "data-source",
          subRoute: "format-setting"
        },
        component: FormatSetting, 
        children: [
          {
            path: '',
            redirect: 'list',
            
          },
          {
            path: "list",
            name: "formatList",
            component: FormatList,
            meta: {
              title: "Format Setting",
              route: "data-source",
              subRoute: "format-setting"
            },
          },
          {
            path: "create",
            name: "formatCreating",
            component: FormatCreate,
            meta: {
              title: "Format Setting",
              route: "data-source",
              subRoute: "format-setting"
            },
          }
          
        ]
      },
    ]
  }
];

export default routes;
