<template>
    <div class="slide-menu">
        <div style="text-align: center;margin: 10px;">
            <filterSelect v-model="client"
                width="80%"
                :options="clientOptions"
                :prop="{ value: 'id', label: 'name' }"
                filterable
                @change="handle_client_change"></filterSelect>
        </div>
        <template v-if="allSubRoute.length>0">
            <div v-for="(item,index) in allSubRoute"
                :key="index"
                class="item"
                :class="{active:defaultMenuActive==item.key }"
                @click="handleMenuClick(item.key)">
                {{item.name}}
            </div>
        </template>
        <div v-if="isShowAddBtn"
            class="add-menu__btn"
            :class="{active:isAddMenuActive}"
            @click="add_home_menu">
            <i class="el-icon-plus add_menu_icon"></i>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import filterSelect from "@/components/common/filter-select";
import fetch from "@/services/fetch";

export default {
  name: "HomeSlideMenu",
  components: { filterSelect },

  data() {
    return {
      isAddMenuActive: false,
      client: "", //选择的 role 下的第一个客户
      clientOptions: [], //选择的role 下的 客户列表
      defaultMenuActive: "",
      maxMenu: 8
    };
  },
  computed: {
    ...mapState("home", ["allSubRoute", "currentSubMenuKey"]),
    ...mapState("common", ["role"]),
    ...mapState("user", ["pid"]),

    isShowAddBtn() {
      return this.pid == 0 && this.allSubRoute.length < this.maxMenu;
    }
  },
  watch: {
    currentSubMenuKey(val) {
      if (val) {
        console.log("currentSubMenuKey", val);
        this.triggerMenu(val);
      }
    },

    role(val) {
      if (val) {
        this.get_client_list_by_role(val);
      }
    }
  },

  methods: {
    ...mapMutations("home", ["UPDATE_SUB_MENU_CLIENT", "UPDATE_CURRENT_SUB_MENU_KEY"]),
    ...mapActions("home", ["fetch_sub_route_by_client"]),
    ...mapActions("common", ["fetch_client_by_role"]),

    triggerMenu(key) {
      this.isAddMenuActive = false;
      this.defaultMenuActive = key;
      this.$eventHub.$emit("CHANGE-HOME-SUB-MENU", key);
    },

    handleMenuClick(key) {
      this.UPDATE_CURRENT_SUB_MENU_KEY(key);
      // this.triggerMenu(key);
    },
    handle_client_change() {
      this.get_sub_route_by_client(this.client);
    },

    //获取 一级role下对应的client
    async get_client_list_by_role() {
      try {
        this.clientOptions = await this.fetch_client_by_role();

        //设置选中的client为返回的第一个值
        this.client = this.clientOptions[0].id;
        this.UPDATE_SUB_MENU_CLIENT({ client: this.client });
        this.get_sub_route_by_client(this.client);
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    get_sub_route_by_client(client) {
      console.log("通过 client 获取 sub menus", this.role);

      //通过client获取sub menu,并将第一个设置为 选中
      this.fetch_sub_route_by_client({ client }).then(res => {
        if (res[0]) {
          this.UPDATE_CURRENT_SUB_MENU_KEY(res[0].key);
          this.triggerMenu(res[0].key);
        }
      });
    },

    add_home_menu() {
      //只有在未选中 添加时 点击添加才生效
      if (!this.isAddMenuActive) {
        this.UPDATE_CURRENT_SUB_MENU_KEY("");
        this.defaultMenuActive = "";
        this.isAddMenuActive = true;
        this.$eventHub.$emit("CHANGE-HOME-SUB-MENU", "ADD");
      }
    }
  },

  mounted() {
    //右侧点击cancel
    this.$eventHub.$on("CANCEL-ADD-MENU-ACTIVE", key => {
      this.isAddMenuActive = false;
      // this.triggerMenu(key);
    });

    this.get_client_list_by_role();
  },

  destroyed() {
    this.$eventHub.$off("CANCEL-ADD-MENU-ACTIVE");
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/variable.scss";

.slide-menu {
  .item {
    line-height: 45px;
    height: 45px;
    background-color: white;
    color: $default-color;
    padding-left: 30px;
    font-size: 14px;
    cursor: pointer;
    transition: all linear 0.2s;

    &.active {
      font-weight: bold;
      background-color: #dbe3ea;
      color: #0c569d;
    }

    &:hover {
      color: #0c569d;
      background-color: rgba(219, 227, 234, 0.4);
    }
  }

  .add-menu__btn {
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      background-color: #dbe3ea;
      cursor: not-allowed;
    }

    i {
      font-size: 30px;
      color: #0c569d;
    }

    &:hover:not(.active) {
      cursor: pointer;
      .add_menu_icon {
        display: none;
      }
      &::after {
        content: "Add Dashboard";
        color: #0c569d;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
