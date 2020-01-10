<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
// import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/theme/index.css";
export default {
  /**
   *  * 在刷新或者关闭tab页时给出弹框提醒
   */
  created() {
    //每次加载时先清除之前绑定的事件
    window.onbeforeunload = null;

    //重新绑定新事件, 此事件触发的前提是 首次进入页面后，要进行“修改”，即点到其他地方，或者输入某些东西，然后点击tab关闭，会提示
    if (process.env.NODE_ENV == "production") {
      window.onbeforeunload = () => {
        console.log("onbeforeunload....");
        let isIE = this.$getBrowserType() == "ie";
        if (isIE) {
          return "系统可能不会保存您所做的更改。";
        } else {
          return false;
        }
      };
    }
  }
};
</script>
<style lang="scss">
</style>
