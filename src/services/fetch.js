import axios from "axios";
import { MessageBox } from "element-ui";
import QS from "qs";
import router from "@/router";
import store from "@/store";

let expireTimer = null;

let paramsSerializer = function(params) {
  return QS.stringify(params, { arrayFormat: "indices" });
};

let instance = axios.create({
  baseURL: "/api",
  timeout: 60000,
  paramsSerializer: function(params) {
    return paramsSerializer(params);
  }
});

// instance.defaults.retry = 2;
// instance.defaults.retryDelay = 1000;
// instance.defaults.headers["Cache-Control"] = "max-age=86400";

//响应拦截器
instance.interceptors.response.use(res => {
  let result = res.data;
  let statusCode = res.status;
  let statusText = res.statusText;
  return new Promise((resolved, reject) => {
    if (statusCode >= 200 && statusCode < 300) {
      if (Object.prototype.toString.call(result) === "[object Object]") {
        if (result.hasOwnProperty("ret")) {
          if (result.ret == -1) {
            if (!expireTimer) {
              expireTimer = setTimeout(() => {
                MessageBox.alert("Login information has expired.", "Tips", {
                  confirmButtonText: "OK",
                  callback: action => {
                    store.dispatch("user/remove_login_info").then(() => {
                      router.push("/login");

                      clearTimeout(expireTimer);
                      expireTimer = null;
                    });
                  }
                });
              }, 0);
            }
          } else {
            resolved(result);
          }
        } else {
          reject(
            new Error("Server exception, please contact system administrator!")
          );
        }
      } else {
        //返回的格式不是object类型
        reject(
          new Error("Server exception, please contact system administrator!")
        );
      }
    } else if (statusCode > 400 || statusCode < 600) {
      reject(new Error(statusText));
    }
  });
});

export default instance;
