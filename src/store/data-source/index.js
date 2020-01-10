import fetch from "@/services/fetch";
import dataList from "./data-list";
import formatSetting from './format-setting'

const state = {
  allSubRoute: [{ key: "data-list", name: "Data List" }, { key: "format-setting", name: "Format Setting" }],
  enableSubRoute: []
};
const getters = {
  // 获取左侧二级菜单列表
  sourceSubRoute: state => {
    let enableSubMenu = state.allSubRoute.filter(menu => {
      let has = state.enableSubRoute.find(item => {
        return (
          item.subRoute.toLocaleUpperCase() == menu.name.toLocaleUpperCase()
        );
      });
      return has;
    });
    return enableSubMenu;
  }
};
const mutations = {
  /**
   * 登录成功后，更新 当前用户有哪些菜单权限可用
   */
  UPDATE_ENABLE_SUB_ROUTE(state, menus) {
    let sub = menus.find(menu => {
      return menu.root.toLocaleUpperCase() == "Data Source".toLocaleUpperCase();
    });
    if (sub) {
      state.enableSubRoute = sub.children;
    } else {
      state.enableSubRoute = [];
    }
  },
  REST_STATE(state) {
    state.enableSubRoute = [];
    state.allSubRoute = [{ key: "data-list", name: "Data List" }, { key: "format-setting", name: "Format Setting" }];
  }
};

const actions = {};

const modules = {
  dataList,
  formatSetting
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules
};
