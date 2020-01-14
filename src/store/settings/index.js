import fetch from "@/services/fetch";

const state = {
  allSubRoute: [
    { key: "roles", name: "Roles" },
    { key: "users", name: "Users" },
    { key: "clients", name: "Clients" },
    { key: "table-maintain", name: "Table Maintenance" },
    { key: "operation-log", name: "Operation Log" }
  ],
  enableSubRoute: []
};
const getters = {
  // 获取左侧二级菜单列表
  settingsSubRoute: state => {
    let enableSubMenu = state.allSubRoute.filter(menu => {
      let has = state.enableSubRoute.find(item => {
        return (
          item.subRoute.toLocaleUpperCase() == menu.name.toLocaleUpperCase()
        );
      });
      return has;
    });
    return enableSubMenu;
  },

  //roles菜单是否 只读
  isRolesReadable: state => {
    let result = state.enableSubRoute.find(item => {
      return item.subRoute.toLocaleUpperCase() == "Roles".toLocaleUpperCase();
    });

    if (result) {
      return result.isRead;
    } else {
      return true;
    }
  },

  //users菜单是否 只读
  isUsersReadable: state => {
    let result = state.enableSubRoute.find(item => {
      return item.subRoute.toLocaleUpperCase() == "Users".toLocaleUpperCase();
    });

    if (result) {
      return result.isRead;
    } else {
      return true;
    }
  },

  //client菜单是否 只读
  isClientsReadable: state => {
    let result = state.enableSubRoute.find(item => {
      return item.subRoute.toLocaleUpperCase() == "Clients".toLocaleUpperCase();
    });

    if (result) {
      return result.isRead;
    } else {
      return true;
    }
  },

  //Table Maintenance 菜单是否 只读
  isTableMaintanceReadable: state => {
    let result = state.enableSubRoute.find(item => {
      return (
        item.subRoute.toLocaleUpperCase() ==
        "Table Maintenance".toLocaleUpperCase()
      );
    });

    if (result) {
      return result.isRead;
    } else {
      return true;
    }
  },
  //Operation log 菜单是否 只读
  isOperationLogReadable: state => {
    let result = state.enableSubRoute.find(item => {
      return (
        item.subRoute.toLocaleUpperCase() == "Operation Log".toLocaleUpperCase()
      );
    });

    if (result) {
      return result.isRead;
    } else {
      return true;
    }
  }
};
const mutations = {
  /**
   * 登录成功后，更新 当前用户有哪些菜单权限可用
   */
  UPDATE_ENABLE_SUB_ROUTE(state, menus) {
    let sub = menus.find(menu => {
      return menu.root.toLocaleUpperCase() == "Setting".toLocaleUpperCase();
    });
    if (sub) {
      state.enableSubRoute = sub.children;
    } else {
      state.enableSubRoute = [];
    }
  },

  /**
   * 重置 state
   */
  REST_STATE(state) {
    state.enableSubRoute = [];
    state.allSubRoute = [
      { key: "roles", name: "Roles" },
      { key: "users", name: "Users" },
      { key: "clients", name: "Clients" },
      { key: "table-maintain", name: "Table Maintenance" },
      { key: "operation-log", name: "Operation Log" }
    ];
  }
};
const actions = {
  /**
   * 新建role时，获取已存在的 role 列表
   * ! 只有父级，没有子级role
   */
  fetch_role_level({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/getrolelevel", data)
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
   * 获取 已经创建的role的详情
   */
  fetch_role_detail({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/detail", data)
        .then(res => {
          res = {
            ret: 0,
            data: {
              id: "115",
              role_name: "hello 1_2",
              pid: "1",
              created_at: "2020-01-09 10:43:04",
              updated_at: "2020-01-09 10:43:04",
              state: "1",
              parentlevel: 1,
              client_id: ["152", "151"],
              auth_data: [
                {
                  tabId: "152",
                  values: [
                    {
                      id: "25c29fc0-337a-11ea-af17-eda9509fd65b",
                      state: 1,
                      product: [
                        "167_41_219",
                        "1_11_185",
                        "1_11_184",
                        "1_11_183",
                        "1_11_182",
                        "1_11_181",
                        "1_11_180",
                        "1_11_179",
                        "1_11_178",
                        "1_11_176",
                        "1_11_175",
                        "1_11_174"
                      ],
                      auth: { custom: ["2", "3", "18", "16", "17"], fixed: [] },
                      type: 1
                    }
                  ]
                },
                {
                  tabId: "151",
                  values: [
                    {
                      id: "25c29fc1-337a-11ea-af17-eda9509fd65b",
                      state: 1,
                      product: [
                        "167_41_219",
                        "1_11_185",
                        "1_11_184",
                        "1_11_183",
                        "1_11_182",
                        "1_11_181",
                        "1_11_180",
                        "1_11_179",
                        "1_11_178",
                        "1_11_176",
                        "1_11_175",
                        "1_11_174"
                      ],
                      auth: { custom: [], fixed: [] },
                      type: 1
                    }
                  ]
                }
              ]
            }
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
  },

  /**
   * 获取 已经创建的role 列表
   */
  fetch_role_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/list", data)
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
   * 新建 role时的 permission tree 列表，分为 client permission 和 system permission
   */
  fetch_roles_permission_tree({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/getallmenu", data)
        .then(res => {
          res = {
            ret: 0,
            data: {
              menu: {
                fixed: [
                  {
                    id: 0,
                    name: "All Sections",
                    val: "",
                    pid: -1,
                    children: [
                      {
                        id: "11",
                        name: "Setting",
                        val: null,
                        pid: "0",
                        children: [
                          {
                            id: "12",
                            name: "Roles",
                            val: "role/list",
                            pid: "11"
                          },
                          {
                            id: "13",
                            name: "Users",
                            val: "user/list",
                            pid: "11"
                          },
                          {
                            id: "14",
                            name: "Clients",
                            val: "user/clientlist",
                            pid: "11"
                          },
                          {
                            id: "15",
                            name: "Table Maintenance",
                            val: "maintenance/list",
                            pid: "11"
                          },
                          {
                            id: "19",
                            name: "Operation Log",
                            val: null,
                            pid: "11"
                          }
                        ]
                      }
                    ]
                  }
                ],
                custom: [
                  {
                    id: 0,
                    name: "All Sections",
                    val: "",
                    pid: -1,
                    children: [
                      {
                        id: "1",
                        name: "HOME",
                        val: null,
                        pid: "0",
                        children: [
                          {
                            id: "2",
                            name: "Corp Overview",
                            val: "home/corp",
                            pid: "1"
                          },
                          {
                            id: "3",
                            name: "Brand Overview",
                            val: "home/brand",
                            pid: "1"
                          }
                        ]
                      },
                      {
                        id: "7",
                        name: "Report Center",
                        val: null,
                        pid: "0",
                        children: [
                          {
                            id: "8",
                            name: "Custom Report",
                            val: "report/custom",
                            pid: "7",
                            children: [
                              {
                                id: "18",
                                name: "SPD Report",
                                val: null,
                                pid: "8"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        id: "9",
                        name: "Data Source",
                        val: null,
                        pid: "0",
                        children: [
                          {
                            id: "10",
                            name: "Data List",
                            val: "data/list",
                            pid: "9",
                            children: [
                              {
                                id: "16",
                                name: "ELC Performance",
                                val: null,
                                pid: "10"
                              },
                              {
                                id: "17",
                                name: "ELC&competitors Spending",
                                val: null,
                                pid: "10"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              product: [
                {
                  id: 0,
                  name: "All Clients",
                  val: "",
                  pid: -1,
                  children: [
                    {
                      id: "167",
                      name: "test_1218_001",
                      created_at: "2019-12-18 18:08:24",
                      updated_at: "2019-12-18 18:08:24",
                      children: [
                        {
                          id: "167_41",
                          name: "test_1218_p_001",
                          client_id: "167",
                          created_at: "2019-12-18 18:09:07",
                          updated_at: "2019-12-18 18:09:07",
                          ids: "41",
                          children: [
                            {
                              id: "167_41_219",
                              product_id: "219",
                              name: "test_1218_k_001",
                              brand_id: "41",
                              created_at: "2019-12-18 18:09:24",
                              updated_at: "2019-12-18 18:09:24"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      id: "1",
                      name: "ELC",
                      created_at: "2019-09-18 15:32:27",
                      updated_at: "2019-10-22 15:32:05",
                      children: [
                        {
                          id: "1_11",
                          name: "Tom Ford",
                          client_id: "1",
                          created_at: "2019-08-18 15:13:14",
                          updated_at: "2019-12-23 17:19:08",
                          ids: "11",
                          children: [
                            {
                              id: "1_11_185",
                              product_id: "185",
                              name: "Soleil",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_184",
                              product_id: "184",
                              name: "Private Blend",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_183",
                              product_id: "183",
                              name: "Ombre Leather",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_182",
                              product_id: "182",
                              name: "Neroli",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_181",
                              product_id: "181",
                              name: "Metallique",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_180",
                              product_id: "180",
                              name: "Lost Cherry",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_179",
                              product_id: "179",
                              name: "lip",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_178",
                              product_id: "178",
                              name: "Fabulous",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_176",
                              product_id: "176",
                              name: "Cushion",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_175",
                              product_id: "175",
                              name: "Branding",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            },
                            {
                              id: "1_11_174",
                              product_id: "174",
                              name: "Boys&Girls",
                              brand_id: "11",
                              created_at: "2019-08-18 15:13:14",
                              updated_at: "2019-08-18 15:13:14"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
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
  },

  /**
   * 新增role
   */
  fetch_add_role({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/add", data)
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
   * 编辑 role
   */
  fetch_edit_role({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/edit", data)
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
   * 更新 role的状态 enable/disable
   */
  fetch_update_role_state({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/role/state", data)
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
   * 获取 已经创建的user 列表
   */
  fetch_user_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/list", data)
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
   * 新建user 时，获取已存在的 role 列表
   * ! 包含父级和子级 role
   */
  fetch_user_role_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/getuserroles", data)
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
   *
   */
  fetch_user_role_list_self({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .get("/user/getuserrolesandself")
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
   * 添加 user
   */
  fetch_add_user({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/add", data)
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
   * 编辑 user
   */
  fetch_edit_user({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/edit", data)
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
   *  获取 user详情
   */
  fetch_user_detail({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/detail", data)
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
   *  更新 user状态  enable/disable
   */
  fetch_update_user_state({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/state", data)
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
   *  通过角色找出 用户
   */
  fetch_users_by_roles({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/getallusersbyroleid", data)
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
   *  获取客户 列表
   *  !只获取第一层，只有客户
   */
  fetch_custom_list({ getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      fetch
        .get("/user/getclient")
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
   *  通过 client一级，获取 brand 二级 列表
   *  ! 只获取 brand第二级
   */
  fetch_barnd_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/getbrand", data)
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

  //编码表下载
  fetch_code_table_download({ getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      fetch
        .get("/maintenance/codetabledownload")
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
   *  获取operation Log的过滤项列表
   */
  fetch_log_filter_options({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/operation/filter", data)
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
   *  获取operation Log 表格数据
   */
  fetch_log_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/operation/log", data)
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
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
