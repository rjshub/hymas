import fetch from "@/services/fetch";

const state = {
  subMenuClient: "", //左侧菜单中的 选中的client
  currentSubMenuKey: "", //当前左侧的menu key
  chartMap: {
    collect: 1,
    cluster: 2,
    stack: 3,
    pie: 4,
    line: 5,
    table: 6,
    filter: 7
  },

  //属于特定的client
  allSubRoute: [
    // { key: "corp-overview", name: "Corp Overview", layout:[] },
  ],
  enableSubRoute: []
};
const getters = {
  // 获取左侧二级菜单列表
  // homeSubRoute: state => {
  //   let enableSubMenu = state.allSubRoute.filter(menu => {
  //     let has = state.enableSubRoute.find(item => {
  //       return (
  //         item.subRoute.toLocaleUpperCase() == menu.name.toLocaleUpperCase()
  //       );
  //     });
  //     return has;
  //   });
  //   return enableSubMenu;
  // }
};
const mutations = {
  /**
   * 登录成功后，更新 当前用户有哪些菜单权限可用
   */
  UPDATE_ENABLE_SUB_ROUTE(state, menus) {
    let sub = menus.find(menu => {
      return menu.root == "HOME";
    });
    if (sub) {
      state.enableSubRoute = sub.children;
    } else {
      state.enableSubRoute = [];
    }
  },

  UPDATE_SUB_MENU_CLIENT(state, data) {
    state.subMenuClient = data.client;
  },

  /**
   * 更新 sub menu 列表
   */
  UPDATE_SUB_MENUS(state, data) {
    state.allSubRoute = data;
  },

  /**
   * 更新 sub menu 列表
   */
  UPDATE_CURRENT_SUB_MENU_KEY(state, key) {
    console.log("this.name==3", key);
    state.currentSubMenuKey = key;
  },

  /**
   * 重置 state
   */
  REST_STATE(state) {
    state.enableSubRoute = [];
    state.allSubRoute = [];
    state.subMenuClient = "";
  }
};
const actions = {
  /**
   * 根据类型获取 过滤框列表
   */
  fetch_filter_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/home/corp_filter", data)
        .then(res => {
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
  },


  /**
   * 通过client获取 sub menu list
   */
  fetch_sub_route_by_client({ state, getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      let res = {
        data: [
          {
            key: "libb",
            name: "libb",
            layout: [
              {
                x: 0,
                y: 0,
                w: 24,
                h: 12,
                i: "a1e456ca-d494-4c87-963f-c14fa9e2028a",
                component: "collectCard",
                toolData: { chartType: 1, dataSource: [], chartValue: {} },
                childLayout: [
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "e18011b7-f20a-43f6-a0a7-c5844adc19b1",
                    x: 0,
                    y: 0,
                    id: "1",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "da962cc2-6970-4d63-b3ea-4a2443778d5d",
                    x: 4,
                    y: 0,
                    id: "2",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "a37d0d52-08f1-49e6-b8bc-46bb2b19bbbb",
                    x: 8,
                    y: 0,
                    id: "3",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "9be7d62e-0b0c-46c4-8561-578c4569bc60",
                    x: 12,
                    y: 0,
                    id: "4",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "5cb3ae7c-5357-48e7-be08-68e30c490772",
                    x: 16,
                    y: 0,
                    id: "5",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "4155e400-59d9-4364-b343-7384afd38652",
                    x: 20,
                    y: 0,
                    id: "6",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "d5994d30-9dc3-477d-823e-a8aa50887429",
                    x: 0,
                    y: 5,
                    id: "7",
                    moved: false
                  },
                  {
                    w: 4,
                    h: 5,
                    maxH: 5,
                    i: "6626bbcc-e259-4804-9cb1-78c4e9b3301d",
                    x: 4,
                    y: 5,
                    id: "8",
                    moved: false
                  },
                  {
                    w: 16,
                    h: 5,
                    maxH: 5,
                    i: "b8957b95-2e5a-41b1-869d-3a35244f6f11",
                    x: 8,
                    y: 5,
                    id: "9",
                    moved: false
                  }
                ],

                moved: false
              },
              {
                x: 0,
                y: 12,
                w: 24,
                h: 12,
                i: "08bf920b-eb15-44e9-8fa3-30ebe0103ea3",
                component: "parallelCard",
                toolData: { chartType: 2, dataSource: [], chartValue: {} },
                childLayout: [
                  {
                    x: 0,
                    y: 0,
                    w: 24,
                    h: 11,
                    maxH: 11,
                    i: "16c3c21e-be9f-440e-83ae-ab940af481bd",
                    moved: false
                  }
                ],
                moved: false
              }
            ]
          },
          {
            key: "hello",
            name: "hello",
            layout: [
              {
                x: 0,
                y: 0,
                w: 24,
                h: 12,
                i: "19224f3c-3cd9-47d7-af1a-8f463429a3c9",
                component: "pieCard",
                toolData: { chartType: 4, dataSource: [], chartValue: {} },
                childLayout: [
                  {
                    x: 0,
                    y: 0,
                    w: 24,
                    h: 11,
                    maxH: 11,
                    i: "1c67b0bd-f55e-497c-a892-eadf44c908e3",
                    moved: false
                  }
                ],
                moved: false
              }
            ]
          },
          {
            key: "world",
            name: "world",
            layout: [
              {
                x: 0,
                y: 0,
                w: 24,
                h: 12,
                i: "6fa45837-cd44-47be-96f6-09b764ae756a",
                component: "lineCard",
                toolData: { chartType: 5, dataSource: [], chartValue: {} },
                childLayout: [
                  {
                    x: 0,
                    y: 0,
                    w: 24,
                    h: 11,
                    maxH: 11,
                    i: "f3ca7980-5e2a-45bd-bee6-1cedb2c2ee2e",
                    moved: false
                  }
                ],
                moved: false
              }
            ]
          }
        ]
      };
      commit("UPDATE_SUB_MENUS", res.data);
      resolve(res.data);

      // fetch
      //   .post("/home/get_sub_menus", data)
      //   .then(res => {
      //     commit("UPDATE_SUB_MENUS", res.data);
      //     resolve(res.data);
      //   })
      //   .catch(err => {
      //     reject(err);
      //   });
    });
  },

  /**
   * 新建 的定制 sub menu
   */
  add_custom_menu({ state, getters, commit, dispatch }, data) {
    let params = {
      client: state.subMenuClient,
      ...data
    };

    return new Promise((resolve, reject) => {
      fetch
        .post("/home/add_sub_menus", params)
        .then(res => {
          //res中含有key
          let allSubRoute = getFinalSubRoute(state.allSubRoute, {
            ...data,
            key: data.name
          });

          commit("UPDATE_SUB_MENUS", allSubRoute);
          // commit("UPDATE_CURRENT_SUB_MENU_KEY", res.key);
          commit("UPDATE_CURRENT_SUB_MENU_KEY", data.name);

          resolve(allSubRoute);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 编辑 的定制 sub menu
   */
  update_custom_menu({ state, getters, commit, dispatch }, data) {
    let params = {
      client: state.subMenuClient,
      ...data
    };
    console.log("this.menu.layout==2", data.layout);

    return new Promise((resolve, reject) => {
      fetch
        .post("/home/update_sub_menus", params)
        .then(res => {
          console.log("this.menu.layout==3", data.layout);
          let allSubRoute = getFinalSubRoute(state.allSubRoute, {
            ...data
          });

          commit("UPDATE_SUB_MENUS", allSubRoute);
          commit("UPDATE_CURRENT_SUB_MENU_KEY", data.key);

          resolve(allSubRoute);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 删除 定制的menu
   */
  delete_custom_menu({ state, getters, commit, dispatch }, data) {
    let params = {
      client: state.subMenuClient,
      key: data.key
    };

    return new Promise((resolve, reject) => {
      fetch
        .post("/home/delete_sub_menus", params)
        .then(res => {
          let allSubRoute = getFinalSubRoute(
            state.allSubRoute,
            {
              ...data
            },
            false
          );

          commit("UPDATE_SUB_MENUS", allSubRoute);
          commit("UPDATE_CURRENT_SUB_MENU_KEY", allSubRoute[0].key);

          resolve(allSubRoute);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * 点击data source 获取 右侧基本数据
   */
  fetch_basic_visual_options({ state, getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/home/get_visual_basic_options", data)
        .then(res => {
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
  },

  /**
   * 选中legend后，获取对应的options
   */
  fetch_legend_options({ state, getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/home/get_visual_legend_options", data)
        .then(res => {
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
  },

  /**
   * 获取中间 卡片区域 的数据
   */
  fetch_card_data({ state, getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/home/get_card_data", data)
        .then(res => {
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

let getFinalSubRoute = (subRoute, data, type = true) => {
  //type为 true表示增加和更新。 false表示删除
  let allSubRoute = _.cloneDeep(subRoute);
  if (type) {
    let hasKey = allSubRoute.find(item => {
      return item.key == data.key;
    });

    if (hasKey) {
      for (let item of allSubRoute) {
        if (item.key == data.key) {
          item.name = data.name;
          item.layout = data.layout;
          break;
        }
      }
    } else {
      allSubRoute.push(data);
    }
  } else {
    allSubRoute = allSubRoute.filter(item => {
      return item.key != data.key;
    });
  }
  return _.cloneDeep(allSubRoute);
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
