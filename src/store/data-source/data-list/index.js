import fetch from "@/services/fetch";

const state = {};
const getters = {
  /**
   * * Performance菜单 权限
   * 如果返回为null或者undefined,则表示当前菜单不存在，
   * 如果不为null或underfined，那么判断 isRead是否为true
   */
  permissionPerformance: (state, getter, rootState, rootGetter) => {
    let dataSource = rootState["dataSource"];

    let performance = null;
    let result = dataSource.enableSubRoute.find(item => {
      return (
        item.subRoute.toLocaleUpperCase() == "Data List".toLocaleUpperCase()
      );
    });

    if (result) {
      performance = result.children.find(item => {
        return (
          item.subRoute.toLocaleUpperCase() ==
          "ELC Performance".toLocaleUpperCase()
        );
      });
    }
    return performance;
  },

  //CompetitorsSpending 菜单 权限
  permissionCompetitorsSpending: (state, getter, rootState, rootGetter) => {
    let dataSource = rootState["dataSource"];

    let performance = null;
    let result = dataSource.enableSubRoute.find(item => {
      return (
        item.subRoute.toLocaleUpperCase() == "Data List".toLocaleUpperCase()
      );
    });

    if (result) {
      performance = result.children.find(item => {
        return (
          item.subRoute.toLocaleUpperCase() ==
          "ELC&competitors Spending".toLocaleUpperCase()
        );
      });
    }
    return performance;
  }
};
const mutations = {};
const actions = {
  /**
   * 新建 获取 季度财年 列表
   */
  fetch_quarter_info_source_data({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/get_fy_quarter", data)
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
   * 新建 上传完成后，保存
   */
  fetch_save_source_data({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post(data.url, data.params)
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
   * format 模板下载
   */
  fetch_elc_template_download({ getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      fetch
        .get("/source/elc_format_download")
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
   * 获取 performance tab 列表信息
   */
  fetch_performance_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/list_performance", data)
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
   * 列表 删除
   */
  fetch_elc_delete({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/elc_del", data)
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
   * performance 列表 详情
   */
  fetch_performance_detail({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/performance_report", data)
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
   * 获取 competitors Spending  tab 列表信息
   */
  fetch_competitors_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/list_competitors_spending", data)
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
   * 获取 过滤项 列表
   */
  fetch_filter_list({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/brand_product_compaign_list", data)
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
   * elc 记录 下载
   */
  fetch_elc_download({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/elc_downLoad", data)
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
   * competitors spending 列表 详情
   */
  fetch_competitors_detail({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/source/competitors_spending_report", data)
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
