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
   *  获取 client 列表
   *  ! 除了client一级，还有第二级brand，和第三级product
   */
  fetch_clients_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/clientlist", data)
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
   *  添加 client
   */
  fetch_client_add({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/addclient", data)
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
   *  删除 client
   */
  fetch_client_delete({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/delclient", data)
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
   *  获取 client详情
   */
  fetch_client_detail({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/clientdetail", data)
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
   *  编辑 client
   */
  fetch_client_edit({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/user/editclient", data)
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

  //
  fetch_table_maintenance_list({ getters, commit, dispatch }) {
    let result = {
      verified: {
        id: 6,
        serial: "faljlfaj-faljfa-fajlfa",
        name: "Verified Fields",
        update_time: "09-08 15:38:07",
        download_url: "https://1233",
        isEdit: 1
      },
      mapping: [
        {
          id: 6,
          serial: "faljlfaj-faljfa-fajlfa",
          name: "Mapping Table",
          update_time: "09-08 15:38:07",
          upload_url: "/321321",
          download_url: "https://1233",
          isEdit: 1
        },
        {
          id: 7,
          serial: "faljlfaj-faljfa-fajlfa",
          name: "Mapping Table",
          update_time: "09-08 15:38:07",
          upload_url: "/321321",
          download_url: "https://1233",
          isEdit: 1
        }
      ]
    };

    return result;

    return new Promise((resolve, reject) => {
      fetch
        .get("/maintenance/list")
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

  // 添加 code table 列表
  fetch_code_table_add({ getters, commit, dispatch }, data) {
    let result = [
      {
        id: 1,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      },
      {
        id: 2,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      }
    ];
    return result;

    return new Promise((resolve, reject) => {
      fetch
        .post("/codeTable/add", data)
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
  // 编辑 code table 列表
  fetch_code_table_edit({ getters, commit, dispatch }, data) {
    let result = [
      {
        id: 1,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      },
      {
        id: 2,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      }
    ];
    return result;

    return new Promise((resolve, reject) => {
      fetch
        .post("/codeTable/edit", data)
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

  // 编辑 code table 列表
  fetch_code_table_delete({ getters, commit, dispatch }, data) {
    let result = [
      {
        id: 1,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      },
      {
        id: 2,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      }
    ];
    return result;

    return new Promise((resolve, reject) => {
      fetch
        .post("/codeTable/delete", data)
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
  // 获取 code table 列表
  fetch_code_table_list({ getters, commit, dispatch }) {
    let result = [
      {
        id: 1,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      },
      {
        id: 2,
        code_level_1: "Code Table",
        code_level_2: "09-08 15:38:07"
      }
    ];
    return result;

    return new Promise((resolve, reject) => {
      fetch
        .get("/codeTable/list")
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
