<template>
    <div class="header">
        <div class="logo">
            <img src="~@/assets/images/logo@2x1.svg" />
        </div>
        <div class="menu">
            <el-menu :default-active="$route.meta.route"
                class="el-menu-demo"
                mode="horizontal"
                text-color="#929196"
                active-text-color="#ffffff"
                @select="handleChangeMenu">
                <el-menu-item index="home">
                    <div>
                        <i class="iconfont mas-home"></i>
                        <hy-box class="title">Home</hy-box>
                    </div>
                </el-menu-item>
                <el-menu-item v-if="reportSubRoute && reportSubRoute.length>0"
                    index="report-center">
                    <div>
                        <i class="iconfont mas-report-center"></i>
                        <hy-box class="title">Report Center</hy-box>
                    </div>
                </el-menu-item>
                <el-menu-item v-if="sourceSubRoute && sourceSubRoute.length>0"
                    index="data-source">
                    <div>
                        <i class="iconfont mas-data-source"></i>
                        <hy-box class="title">Data Source</hy-box>
                    </div>
                </el-menu-item>
                <el-menu-item v-if="settingsSubRoute && settingsSubRoute.length>0"
                    index="settings">
                    <div>
                        <i class="iconfont mas-settings"></i>
                        <hy-box class="title">Settings</hy-box>
                    </div>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="profile">
            <filter-select v-model="headerRole"
                width="120px"
                style="margin-right:50px;"
                :options="roleOptions"
                filterable
                :prop="{ value: 'id', label: 'name' }"
                :is-overlap-placeholder-color="true"
                placeholder="Select Role"
                @change="handle_change_role">
            </filter-select>

            <span class="iconfont mas-user"
                style="font-size:25px;color:#929196"></span>
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                    <span class="username">{{nickname}}</span><i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template v-slot:dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile">Your Profile</el-dropdown-item>
                        <el-dropdown-item command="signout">Sign Out</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <userProfile v-if="isShowProfile"
            @close="isShowProfile=false">
        </userProfile>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import userProfile from "@/components/common/user-profile";
import filterSelect from "@/components/common/filter-select";

export default {
  name: "Header",
  components: { userProfile, filterSelect },
  data() {
    return {
      menuActive: "home",
      isShowProfile: false,
      headerRole: ""
    };
  },

  computed: {
    ...mapState({
      userId: state => state.user.id
    }),

    ...mapState("common", ["role", "roleOptions"]),
    ...mapState("user", ["nickname"]),
    ...mapGetters("settings", ["isUsersReadable"]),

    ...mapGetters("reportCenter", ["reportSubRoute"]),
    ...mapGetters("dataSource", ["sourceSubRoute"]),
    ...mapGetters("settings", ["settingsSubRoute"])
  },

  methods: {
    ...mapMutations("common", ["UPDATE_ROUTE", "UPDATE_ROLE"]),
    ...mapActions("user", ["logout"]),

    handle_change_role() {
      this.UPDATE_ROLE(this.headerRole);
    },
    //处理顶栏 一级菜单
    handleChangeMenu(item) {
      this.UPDATE_ROUTE(item);

      if (item == "home") {
        this.$router.push({ path: `/${item}/custom-page` });
      } else if (item == "report-center") {
        this.$router.push({ path: `/${item}/${this.reportSubRoute[0].key}` });
      } else if (item == "data-source") {
        this.$router.push({ path: `/${item}/${this.sourceSubRoute[0].key}` });
      } else if (item == "settings") {
        this.$router.push({ path: `/${item}/${this.settingsSubRoute[0].key}` });
      } else {
        this.$router.push({ path: `/${item}` });
      }
    },

    // 点击profile项的回调
    handleCommand(item) {
      if (item == "profile") {
        this.isShowProfile = true;
      }
      if (item == "signout") {
        this.$confirm("Are you sure to log out the system?", "Tips", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            return this.logout();
          })
          .then(() => {
            this.$router.push({
              path: "/login"
            });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },

    handle_go_home() {
      this.$router.push({
        path: "/home/corp-overview"
      });
    },
    getroute() {
      console.log("$route", this.$route);
    }
  },

  mounted() {
    this.headerRole = this.role;
    console.log("role", this.role);
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/variable.scss";

$menu-default-color: #929196;

.header {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  border-bottom: 2px solid $menu-active-bgColor;
  background-color: white;

  .logo {
    box-sizing: border-box;
    padding: 10px 20px;
    width: $slide-width;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
      width: 120px;
    }
  }

  .menu {
    flex: 1;
    .el-menu {
      height: 100%;
      border-bottom: 2px solid $menu-active-bgColor;
      .el-menu-item {
        border-bottom: 2px solid $menu-active-bgColor !important;
        &.is-active {
          background-color: $menu-active-bgColor !important;
          border-bottom: 2px solid $menu-active-bgColor !important;
        }

        &:hover {
          background-color: $menu-hover-bgColor !important;
          border-bottom: 2px solid $menu-active-bgColor !important;

          & * {
            color: #ffffff !important;
          }
        }

        i {
          font-size: 27px;
        }

        .title {
          font-size: 18px;
          font-weight: bold;
        }
      }
    }
  }

  .profile {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-dropdown {
      padding: 0 10px;

      .username {
        color: $menu-default-color;
        font-size: 18px;
      }
    }
  }
}
</style>


