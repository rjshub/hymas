import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

//避免localstorage数据在浏览器上暴露，故而进行加密，压缩
const secureLs = new SecureLS({ isCompression: false });

Vue.use(Vuex);

import user from "./user";
import common from "./common";
import home from "./home";
import reportCenter from "./report-center";
import dataSource from "./data-source";
import settings from "./settings";

const modules = {
  user,
  common,
  home,
  reportCenter,
  dataSource,
  settings
};

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules,
  plugins: [
    createPersistedState({
      key: "hy.mas",
      storage: {
        getItem: key => secureLs.get(key),
        setItem: (key, value) => secureLs.set(key, value),
        removeItem: key => secureLs.remove(key)
      }
    })
  ],
  strict: process.env.NODE_ENV !== "production" //在生产环境启用导致性能损失
});
