import fetch from "@/services/fetch";
import elementResizeDetectorMaker from "element-resize-detector";
import sloarToLunar from "./solarAndLunar.js";
import hyBox from "@/components/common/hy-box";

/**文件下载 */
let getBrowserType = () => {
  //if顺序不能乱
  if (window.navigator.userAgent.indexOf("Trident") > -1) {
    return "ie";
  } else if (window.navigator.userAgent.indexOf("Edge") > -1) {
    return "edge";
  } else if (window.navigator.userAgent.indexOf("Firefox") > -1) {
    return "firefox";
  } else if (window.navigator.userAgent.indexOf("Chrome") > -1) {
    return "chrome";
  } else if (window.navigator.userAgent.indexOf("Safari") > -1) {
    return "safari";
  } else {
    return "other";
  }
};

let downloadFile = function(data) {
  let url = data.path || data.url;
  let isChrome = getBrowserType() == "chrome";
  let isSafari = getBrowserType() == "safari";
  let isFirefox = getBrowserType() == "firefox";

  if (!url) {
    console.error("url不存在", data, url);
  }

  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    alert(
      "Your device does not support files downloading. Please try again in desktop browser."
    );
    return false;
  }

  var link = document.createElement("a");
  link.href = url;
  link.target = "_blank";

  if (link.download !== undefined) {
    var fileName = url.substring(url.lastIndexOf("/") + 1, url.length);
    link.download = fileName;
  }

  //Dispatching click event.  download via virtual link click
  if (document.createEvent) {
    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    link.dispatchEvent(e);
  } else {
    if (url.indexOf("?") === -1) {
      url += "?download";
    }
    window.open(url, "_self");
  }

  // 在下载结束后，记录下来此次操作。
  fetch
    .post("/operation/downloadlog", {
      object: data.object,
      item: data.item,
      path: url
    })
    .then(res => {
      console.log("记录日志成功");
    })
    .catch(err => {
      console.error("记录日志失败", err.message);
    });

  return true;
};

/**金额格式化
 * @param {*} number 数字
 * @param {*} places 小数后几位
 * @param {*} symbol 货币符号  $
 * @param {*} thousand 千分位符号   ,
 * @param {*} decimal 小数点符号   .
 */
let formatMoney = function(number, places, symbol, thousand, decimal) {
  number = number || 0;
  places = !isNaN((places = Math.abs(places))) ? places : 2;
  symbol = symbol !== undefined ? symbol : "¥";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "")
  );
};

/**常用正则表达式 */
const REGXMAP = {
  name: {
    firstPlace: {
      regx: /^[a-zA-Z][\w-_]*/,
      message: "The first character of name must be alphabetic."
    }, //首位允许的字符
    character: {
      regx: /^[\w-_\s]*$/,
      message:
        "Only alphabetics, numbers, underscore, hyphen, blank are allowed."
    }, //只能允许的字符
    length: {
      min: 2,
      max: 20,
      message: "The length can be between 2 and 20 characters."
    } //字符长度
  },
  password: {
    number: {
      regx: /^\d+$/,
      message:
        "At least two combinations of alphabets, numbers, and special characters are used as passwords"
    }, //首位允许的字符
    alphabets: {
      regx: /^[a-zA-Z]+$/,
      message:
        "At least two combinations of alphabets, numbers, and special characters are used as passwords"
    }, //首位允许的字符
    special: {
      regx: /^[!-+*@#$\.]+$/,
      message:
        "At least two combinations of alphabets, numbers, and special characters are used as passwords"
    }, //首位允许的字符
    character: {
      regx: /^[\w!\-+\*@#\$\.~]+$/,
      message: "Special characters only allow the following '.!-+*@#$~'"
    }, //只能允许的字符
    length: {
      min: 8,
      max: 20,
      message: "The length can be between 8 and 20 characters."
    } //字符长度
  },
  realName: {
    character: {
      regx: /^[a-zA-Z\u4e00-\u9fbf]*$/,
      message: "Only alphabetics, Chinese character are  allowed."
    }, //只能允许的字符
    length: {
      min: 2,
      max: 25,
      message: "The length can be between 2 and 25 characters."
    } //只能允许的字符
  },
  cellphone: {
    character: {
      regx: /^[1][3,4,5,7,8][0-9]{9}$/,
      message: "Please enter valid phone number."
    } //只能允许的字符
  },
  email: {
    character: {
      regx: /^([a-zA-Z0-9_\.-]{1,50})@([a-z0-9A-Z]{1,15})([.]{1})([a-zA-Z]{2,4})$/,
      message: "Please enter valid email."
    } //只能允许的字符
  },

  positiveInt: /^[1-9]\d*$/, //匹配正整数

  //URL规则：
  //(1)、地址必须以http/https/ftp/ftps开头；
  //(2) 、地址不能包含双字节符号或非链接特殊字符
  url: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/ //
};

/**
 * 使用mathjs 重写toFixed方法
 * @param {*} d
 */
Number.prototype.toFixed = function(d) {
  return mathjs.format(this, { notation: "fixed", precision: d });
};

let getStringByteLength = str => {
  let len = 0;
  let regex = /[^\u0000-\u00FF]/; //中文，中文标点正则  按照两个字符来计算
  for (let i = 0; i < str.length; i++) {
    if (regex.test(str[i])) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};

/**是否为空的object， 如 {}  */
let isObjectNull = obj => {
  let keys = Object.keys(obj);

  if (keys.length == 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * 用于 子组件向父组件 通知
 * 尤其在不想再父元素上html上定义@事件时，可用此法
 *
 * 在父组件通过$on("事件名",function)监听到
 */
let dispatch = function(componentName, eventName, params) {
  var parent = this.$parent || this.$root;
  var name = parent.$options.componentName;

  //寻找父级，如果父级不是符合的组件名，则循环向上查找
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.componentName;
    }
  }
  //找到符合组件名称的父级后，触发其事件。整体流程类似jQuery的closest方法
  if (parent) {
    parent.$emit.apply(parent, [eventName].concat(params));
  }
};

/**
 *  用于父组件向 后代组件通知。
    在子组件通过$on("事件名",function)监听到
 */
let broadcast = function(componentName, eventName, params) {
  broadcast.call(this, componentName, eventName, params);
  function broadcast(componentName, eventName, params) {
    //遍历所有子组件
    this.$children.forEach(child => {
      var name = child.$options.componentName;
      //寻找符合指定名称的子组件
      if (name === componentName) {
        //在符合的自组件上触发的事件，但是不会再继续寻找符合名称的组件的子集，原因？
        child.$emit.apply(child, [eventName].concat(params));
      } else {
        //不符合继续寻找他的子集（即孙子组件）
        broadcast.apply(child, [componentName, eventName].concat([params]));
      }
    });
  }
};

/**
 *  监听dom的尺寸变化，不管是由于 window还是css导致的width/height改变
 */
let detectDomResize = function(element, callback) {
  let erd = elementResizeDetectorMaker();
  erd.listenTo(element, callback);
};

let uploadHttpRequest = params => {
  // const CancelToken = fetch.CancelToken;

  //必须为 promise，这样才能执行完后，调用 on-success等钩子
  return new Promise((resolve, reject) => {
    let action = params.action; //上传的url
    let file = params.file; //上传的文件
    let data = params.data; //上传的附加 数据

    //开始上传
    let formData = new FormData();
    formData.append("file", file);
    formData.append("data", data);

    fetch
      .post(action, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: function(event) {
          let percent = (event.loaded / event.total) * 100;
          params.onProgress({
            percent: Math.floor(percent * 100) / 100,
            total: event.total
          });
        }
        // cancelToken: new CancelToken(function executor(c) {
        //   // executor 函数接收一个 cancel 函数作为参数
        //   cancel = c;
        // })
      })
      .then(res => {
        if (res.ret == 0) {
          resolve(res.data);
        } else {
          reject(new Error(res.msg));
        }
      })
      .catch(err => {
        reject(new Error(err.message));
      });
  });
};

//作为插件必须定义公开的 install 方法
export default function install(Vue, options) {
  Vue.$eventHub = Vue.prototype.$eventHub = new Vue(); //用来随时随地注册事件和触发事件
  Vue.prototype.$downloadFile = downloadFile;
  Vue.prototype.$formatMoney = formatMoney;
  Vue.prototype.$getBrowserType = getBrowserType;
  Vue.prototype.$REGXMAP = REGXMAP;
  Vue.prototype.$getStringByteLength = getStringByteLength;
  Vue.prototype.$isObjectNull = isObjectNull;
  Vue.prototype.$uploadHttpRequest = uploadHttpRequest;
  Vue.prototype.$dispatch = dispatch;
  Vue.prototype.$broadcast = broadcast;

  Vue.prototype.$detectDomResize = detectDomResize;
  Vue.prototype.$sloarToLunar = sloarToLunar;

  Vue.directive("hover", {
    /**
     * 具体用法
     *  <div v-hover
          class="label">
          <span>{{node.label}}</span>
        </div>
        div为容器，一旦里面的span超过这个容器宽度，则会显示 toolip
     */
    inserted: function(el, binding, VNode) {
      let div = document.createElement("div");
      jquery(".toolip-hover").remove();

      el.onmouseover = () => {
        jquery(".toolip-hover").remove();

        let width = jquery(el)
          .find("span")
          .width();

        let realWidth = jquery(el).width();
        if (width > Math.ceil(realWidth)) {
          jquery(div).html(el.innerText);
          jquery(div).addClass("toolip-hover");

          let body = document.querySelector("body");
          body.appendChild(div);

          let left =
            el.getBoundingClientRect().left -
            (jquery(div).width() - el.getBoundingClientRect().width) / 2; //让toolip在所有居中位置
          let top =
            el.getBoundingClientRect().top - el.getBoundingClientRect().height;
          jquery(div).css({
            top: top - 10, //偏移的10是留给小三角用的
            left: left
          });
        }
      };
      el.onmouseout = () => {
        jquery(".toolip-hover").remove();
      };
    }
  });

  //注册全局组件
  Vue.component("hy-box", hyBox); //行内块
}
