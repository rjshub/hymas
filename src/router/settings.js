/*
 * settings
 */
import store from "@/store";
import Layout from "@/components/layout";
import Roles from "@/views/settings/roles";
import RolesCreateAndEdit from "@/views/settings/roles/create-and-edit";
import Users from "@/views/settings/users";
import UsersCreateAndEdit from "@/views/settings/users/create-and-edit";
import Clients from "@/views/settings/clients";
import TableMaintain from "@/views/settings/table-maintain";
import VerifiedCardEdit from "@/views/settings/table-maintain/verified-card/edit";
import MappingCardEdit from "@/views/settings/table-maintain/mapping-card/edit";
import OperationLog from "@/views/settings/operation-log";

const routes = [
  {
    path: "/settings",
    component: Layout,
    children: [
      {
        path: "",
        redirect: "roles"
      },
      {
        path: "roles",
        name: "roles",
        meta: {
          title: "Roles",
          route: "settings",
          subRoute: "roles"
        },
        component: Roles // () => import(/* webpackChunkName: "settings" */ "@/views/settings/roles")
      },
      {
        path: "roles/edit-or-create",
        name: "rolesEditOrCreate",
        meta: {
          title: "Roles",
          route: "settings",
          subRoute: "roles"
        },
        component: RolesCreateAndEdit //() =>  import(/* webpackChunkName: "settings" */ "@/views/settings/roles/create-and-edit")
      },
      {
        path: "users",
        name: "users",
        meta: {
          title: "Users",
          route: "settings",
          subRoute: "users"
        },
        component: Users // () => import(/* webpackChunkName: "settings" */ "@/views/settings/users")
      },
      {
        path: "users/edit-or-create",
        name: "usersEditOrCreate",
        meta: {
          title: "Users",
          route: "settings",
          subRoute: "users"
        },
        component: UsersCreateAndEdit //() => import(/* webpackChunkName: "settings" */ "@/views/settings/users/create-and-edit")
      },
      {
        path: "clients",
        name: "clients",
        meta: {
          title: "Clients",
          route: "settings",
          subRoute: "clients"
        },
        component: Clients // () =>import(/* webpackChunkName: "settings" */ "@/views/settings/clients")
      },
      {
        path: "table-maintain",
        name: "tableMaintain",
        meta: {
          title: "Table Maintain",
          route: "settings",
          subRoute: "table-maintain"
        },
        component: TableMaintain //() => import(/* webpackChunkName: "settings" */ "@/views/settings/table-maintain")
      },
      {
        path: "table-maintain/verified-edit",
        name: "fixedTableEdit",
        meta: {
          title: "Fixed Table Edit",
          route: "settings",
          subRoute: "table-maintain"
        },
        component: VerifiedCardEdit //() => import(/* webpackChunkName: "settings" */ "@/views/settings/table-maintain")
      },
      {
        path: "table-maintain/mapping-edit",
        name: "codeTableEdit",
        meta: {
          title: "Code Table Edit",
          route: "settings",
          subRoute: "table-maintain"
        },
        component: MappingCardEdit //() => import(/* webpackChunkName: "settings" */ "@/views/settings/table-maintain")
      },
      {
        path: "operation-log",
        name: "operationLog",
        meta: {
          title: "Operation Log",
          route: "settings",
          subRoute: "operation-log"
        },
        component: OperationLog //() => import(/* webpackChunkName: "settings" */ "@/views/settings/table-maintain")
      }
    ]
  }
];

export default routes;
