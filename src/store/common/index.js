import fetch from "@/services/fetch";

/**主要用来存放 和具体业务无关的，公共的数据 */
const state = {
  welcome: "Welcome to HYMAS, the Advanced agency reporting system",
  copyright: "Copyright©2019 Hylink. All Rights Reserved", //版权声明
  route: "", //一级路由
  subRoute: "", //二级路由
  yearTypeList: [
    { id: "1", label: "CY" },
    { id: "2", label: "FY" }
  ], // cy表示自然年， fy表示财年，1月1日~12月31日为一个自然年；7月1日~6月30日为一个财年

  categoryList: [
    { value: "0", label: "All Categories" },
    { value: "1", label: "Skincare" },
    { value: "2", label: "MakeUp" },
    { value: "3", label: "Fragrances" }
  ],

  //当前账号下的 data source
  dataSourceOptions: [],

  roleOptions: [],
  role: "1"
};
const getters = {};
const mutations = {
  UPDATE_ROUTE(state, value) {
    state.route = value;
  },

  UPDATE_ROLE_OPTIONS(state, value) {
    // state.roleOptions = value;
    state.roleOptions = [
      { id: "1", name: "libb" },
      { id: "2", name: "test" }
    ];
    //默认将 sh-root给 role

    state.role = "1";
  },

  UPDATE_DATA_SOURCE_OPTIONS(state, value) {
    state.dataSourceOptions = [
      { value: "a", label: "A Table" },
      { value: "b", label: "B Table" },
      { value: "c", label: "C Table" },
      { value: "d", label: "D Table" }
    ];
  },

  UPDATE_ROLE(state, value) {
    console.log("value", value);
    state.role = value;
  },

  /**
   * 重置state
   */
  REST_STATE(state) {
    state.route = "";
    state.subRoute = "";
    state.roleOptions = [];
    state.dataSourceOptions = [];
    state.role = "";
  }
};
const actions = {
  /**
   * 根据选择的role，获取对应的client
   */
  fetch_client_by_role({ state, getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      let roleId = data ? data.role_id : state.role;

      fetch
        .post("/home/corp_filter", { role_id: roleId })
        .then(res => {
          res = {
            ret: 0,
            data: [
              {
                id: "152",
                name: "test_001"
              },
              {
                id: "151",
                name: "test_mas_00023"
              },
              {
                id: "1",
                name: "ELC"
              }
            ]
          };
          if (res.ret == 0) {
            resolve(res.data);
          } else {
            reject(new Error(res.msg));
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
