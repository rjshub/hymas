import fetch from "@/services/fetch";
import Cookies from "js-cookie";

const state = {
  token: 0, //是否登录的标志, 1为已登录
  id: "",
  role_id: "",
  username: "",
  nickname: "",
  email: "",
  cellphone: "",
  pid: ""
};
const getters = {
  isLogin: state => {
    return state.token == "1";
  }
};
const mutations = {
  /**
   * 更新 是否已登录标志
   */
  UPDATE_TOKEN(state, value) {
    state.token = value;
  },

  /**
   * 更新 state
   */
  UPDATE_USER_INFO(state, value) {
    if (value.id) {
      state.id = value.id;
    }
    if (value.role_id) {
      state.role_id = value.role_id;
    }
    if (value.username) {
      state.username = value.username;
    }
    if (value.nickname) {
      state.nickname = value.nickname;
    }
    if (value.email) {
      state.email = value.email;
    }
    if (value.cellphone) {
      state.cellphone = value.cellphone;
    }
    if (value.pid !== "" || value.pid !== null) {
      state.pid = value.pid;
    }
  },

  /**
   * 重置 state
   */
  REST_STATE(state, value) {
    state.id = "";
    state.role_id = "";
    state.username = "";
    state.nickname = "";
    state.email = "";
    state.cellphone = "";

    localStorage.removeItem("hy.mas");
    Cookies.remove("PHPSESSID");
  }
};
const actions = {
  /**
   * 登录
   */
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/login/check", data)
        .then(res => {
          if (res.ret == 0) {
            commit("UPDATE_TOKEN", 1);
            commit("UPDATE_USER_INFO", res.data);

            commit("common/UPDATE_ROLE_OPTIONS", res.data.roleOptions, {
              root: true
            });

            commit(
              "common/UPDATE_DATA_SOURCE_OPTIONS",
              res.data.dataSourceOptions,
              {
                root: true
              }
            );

            commit("reportCenter/UPDATE_ENABLE_SUB_ROUTE", res.data.menu, {
              root: true
            });
            commit("dataSource/UPDATE_ENABLE_SUB_ROUTE", res.data.menu, {
              root: true
            });
            commit("settings/UPDATE_ENABLE_SUB_ROUTE", res.data.menu, {
              root: true
            });

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
   * 退出登录
   */
  logout({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .get("/login/logout")
        .then(res => {
          if (res.ret == 0) {
            dispatch("remove_login_info");
            resolve();
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
   * 在退出登录或者登录过期时，重置store
   */
  remove_login_info({ commit, dispatch }) {
    commit("common/REST_STATE", "", { root: true });
    commit("home/REST_STATE", "", { root: true });
    commit("reportCenter/REST_STATE", "", { root: true });
    commit("dataSource/REST_STATE", "", { root: true });
    commit("settings/REST_STATE", "", { root: true });
    commit("user/REST_STATE", "", { root: true });

    return Promise.resolve();
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
