import fetch from "@/services/fetch";

const state = {
  allSubRoute: [{ key: "custom-report", name: "Custom Report" }],
  enableSubRoute: [],

  permissionMap: [
    { id: 0, label: "Public" },
    { id: 1, label: "Partial Disclosed" },
    { id: 2, label: "Only MySelf" }
  ]
};
const getters = {
  // 获取左侧二级菜单列表
  reportSubRoute: state => {
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

  //data list菜单是否 只读
  permissionSpdReport: state => {
    let spdReport = null;
    let result = state.enableSubRoute.find(item => {
      return (
        item.subRoute.toLocaleUpperCase() == "Custom Report".toLocaleUpperCase()
      );
    });

    if (result) {
      spdReport = result.children.find(item => {
        return (
          item.subRoute.toLocaleUpperCase() == "SPD Report".toLocaleUpperCase()
        );
      });
    }

    return spdReport;
  }
};
const mutations = {
  /**
   * 登录成功后，更新 当前用户有哪些菜单权限可用
   */
  UPDATE_ENABLE_SUB_ROUTE(state, menus) {
    let sub = menus.find(menu => {
      return (
        menu.root.toLocaleUpperCase() == "Report Center".toLocaleUpperCase()
      );
    });
    if (sub) {
      state.enableSubRoute = sub.children;
    } else {
      state.enableSubRoute = [];
    }
  },

  /**
   * 重置state
   */
  REST_STATE(state) {
    state.enableSubRoute = [];
    state.allSubRoute = [{ key: "custom-report", name: "Custom Report" }];
  }
};
const actions = {
  /**
   * 获取 custom report 列表
   */
  fetch_custom_report_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/custom", data)
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
   * 修改 custom report权限    Public | Partial Disclosed | Only MySelf
   */
  fetch_custom_report_modify_permission({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-permission", data)
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
   * 删除 custom report
   */
  fetch_custom_report_delete({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-delete", data)
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
   * 复制 custom report
   */
  fetch_custom_report_copy({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-copy", data)
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
   * 获取 SPD report 绿表 数据
   */
  fetch_roll_traking_table({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/custom_rollingtraking", data)
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
   * 下载 SPD report 绿表 数据
   */
  fetch_roll_traking_download({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/customdownload", data)
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
   * 获取 SPD report 蓝表 大品牌 数据
   */
  fetch_competitor_total_table({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/custom_competitor_spd_total ", data)
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
   * 获取 SPD report 蓝表 小品牌 数据
   */
  fetch_competitor_other_table({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/custom_competitor_spd_other", data)
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
   * 下载 SPD report 蓝表  数据
   */
  fetch_competitor_download({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/competitordownload", data)
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
   * 隐藏 SPD report 蓝表/绿表得 品牌
   */
  fetch_save_hidden_brands({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report/savehiddenbrand", data)
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
   * 获取 定制报表 的 Report Fields 列表
   * ! 在custom report菜单中，除了spd report，剩下的全是新建的定制报表
   */
  fetch_custome_report_field_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/field-list", data)
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
   * 获取 定制报表 的 Report Field面板下的 二级 列表
   */
  fetch_custome_report_subordinate_field_list(
    { getters, commit, dispatch },
    data
  ) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/field-subordinate-list", data)
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
   * 获取 定制报表 的 preview 过滤项 列表
   */
  fetch_custome_report_preview_filter({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/preview-table-filter", data)
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
   * 获取 定制报表 的 detail 过滤项 列表
   */
  fetch_custome_report_detail_filter({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-table-filter", data)
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
   *  通过 group 获取 brand
   */
  fetch_brand_by_group({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/getBrandByClientName", data)
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
   *  通过 brand 获取 product
   */
  fetch_product_by_brand({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/getProductByBrandName", data)
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
   * 获取 定制报表 的 preview的table 信息
   */
  fetch_custome_report_preview_table({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/preview-table", data)
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
   * 获取 定制报表 的 detail的table 信息
   */
  fetch_custome_report_detail_table({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-get", data)
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
   * 下载 定制报表 的 preview 的table 信息
   */
  fetch_custome_report_preview_download({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/preview-download", data)
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
   * 获取  定制报表 的 template configuration 步骤 users信息   在in/not in下，user是不同的
   */
  fetch_custome_report_template_users({ getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/template-users")
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
   * 下载 定制报表 的 detail 的table 信息
   */
  fetch_custome_report_detail_download({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-download", data)
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
   * 保存  定制报表 的 新建 信息
   */
  fetch_custome_report_save_report_step({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/save-report", data)
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
   * 获取  创建的定制报表 的 信息
   */
  fetch_custome_report_get_report_step({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/report-custom/report-data", data)
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
