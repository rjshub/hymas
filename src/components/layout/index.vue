<template>
    <el-container class="layout">
        <el-header>
            <header-layout></header-layout>
        </el-header>
        <el-container class="layout__body">
            <!-- 侧边栏 start-->
            <el-aside width="200px">
                <component :is="sildeMenuType"
                    :list="slideMenuList"
                    :default-active="$route.meta.subRoute"
                    @changeSlideMenu="handleChangeSlideMenu"></component>
            </el-aside>

            <el-container>
                <el-main style="display:flex;position:relative">
                    <router-view></router-view>
                </el-main>
                <el-footer>
                    <footer-layout></footer-layout>
                </el-footer>
            </el-container>
            <!-- 侧边栏 end-->
        </el-container>
    </el-container>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import headerLayout from "./header";
import HomeSlideMenu from "@/components/common/secondary-menu/HomeSlideMenu";
import OtherSlideMenu from "@/components/common/secondary-menu/OtherSlideMenu";
import footerLayout from "./footer";
export default {
  name: "Layout",
  components: { headerLayout, HomeSlideMenu, OtherSlideMenu, footerLayout },
  data() {
    return {
      sildeMenuType: "",
      slideMenuList: []
    };
  },
  computed: {
    ...mapState("common", ["route"]),

    ...mapGetters("reportCenter", ["reportSubRoute"]),
    ...mapGetters("dataSource", ["sourceSubRoute"]),
    ...mapGetters("settings", ["settingsSubRoute"])
  },

  watch: {
    //监听一级和二级路由的改变
    $route(to, from) {
      this.setSubMenuList(this.$route.meta.route);
    }
  },
  methods: {
    //处理左侧 二级菜单
    handleChangeSlideMenu({ path, subRoute }) {
      this.$router.push({
        path: path
      });
    },

    setSubMenuList(route) {
      console.log("route===", route);

      if (route == "" || route.indexOf("home") > -1) {
        this.sildeMenuType = "HomeSlideMenu";
      } else if (route.indexOf("report-center") > -1) {
        this.sildeMenuType = "OtherSlideMenu";
        this.slideMenuList = this.reportSubRoute;
      } else if (route.indexOf("data-source") > -1) {
        this.sildeMenuType = "OtherSlideMenu";
        this.slideMenuList = this.sourceSubRoute;
      } else if (route.indexOf("settings") > -1) {
        this.sildeMenuType = "OtherSlideMenu";
        this.slideMenuList = this.settingsSubRoute;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setSubMenuList(this.route);
    });
  }
};
</script>
<style lang="scss">
.layout {
  height: 100%;
  width: 100%;
  .el-header {
    height: 60px !important;
    padding: 0;
  }
  .layout__body {
    height: calc(100vh - 60px);
    .el-aside {
      background-color: white;
      border-right: 1px solid #dedede;
      box-sizing: border-box;
    }
    .el-main {
      padding: 0;
      // margin: 10px;
    }

    .el-footer {
      height: 30px !important;
    }
  }
}
</style>


