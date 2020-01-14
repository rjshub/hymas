<template>
    <div v-loading="isLoading"
        element-loading-spinner="iconfont mas-loading"
        class="custom-page">

        <div class="operation">
            <div class="name-wrap">
                <label>Interface Name:</label>
                <el-input v-if="isOperate!='view'"
                    v-model="menu.name"
                    style="width: 200px;"
                    size="mini"
                    placeholder="请输入内容"></el-input>
                <span v-else>
                    {{menu.name}}
                </span>
            </div>
            <div v-if="isOperate!='view'"
                class="btn-wrap">
                <el-button size="mini"
                    @click="handle_cancel">Cancel</el-button>
                <el-button type="primary"
                    size="mini"
                    @click="handle_save">Save</el-button>
            </div>
            <div v-else
                class="btn-wrap">
                <el-button size="mini"
                    @click="handle_delete">Delete</el-button>
                <el-button v-if="pid==0"
                    size="mini"
                    type="primary"
                    @click="handle_edit">
                    Edit
                </el-button>
            </div>
        </div>
        <div v-if="isOperate=='view' && menu.layout.length==0"
            class="contents">

            <div v-if="pid!=0"
                class="blank">No Content.</div>
            <div v-else
                class="blank">Please create your dashboard for each client if your account already has data source.</div>
        </div>

        <div v-else
            class="contents">
            <div class="grid-area">
                <grid-layout :layout.sync="menu.layout"
                    :col-num="24"
                    :row-height="20"
                    :is-draggable="true"
                    :is-resizable="true"
                    :vertical-compact="true"
                    :margin="[10, 10]"
                    :use-css-transforms="true"
                    @layout-mounted="layoutMountedEvent">
                    <grid-item v-for="(item,index) in menu.layout"
                        :key="index"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                        :static="item.static || isOperate=='view'">
                        <component :is="item.component"
                            :value="item"
                            :status="isOperate"
                            @select="handle_select_component"
                            @delete="handle_delete_component"></component>
                    </grid-item>
                </grid-layout>
            </div>
            <custom-tools v-if="isOperate!='view'"
                :current-grid="currentGrid"
                @add="add_visual"
                @change="change_visual"></custom-tools>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import uuidv4 from "uuid/v4";
import fetch from "@/services/fetch";
import filterArea from "@/views/home/common/filter-area";
import customTools from "@/views/home/common/custom-tools/index";

//grid-card
import collectCard from "@/views/home/common/grid-card/collect-card/index";
import parallelCard from "@/views/home/common/grid-card/cluster-card/index";
import heepCard from "@/views/home/common/grid-card/stack-card/index";
import pieCard from "@/views/home/common/grid-card/pie-card/index";
import lineCard from "@/views/home/common/grid-card/line-card/index";
import tableCard from "@/views/home/common/grid-card/table-card/index";
import filterCard from "@/views/home/common/grid-card/filter-card/index";

export default {
  name: "CustomPage",
  components: { filterArea: filterArea, customTools, collectCard, parallelCard, heepCard, pieCard, lineCard, tableCard, filterCard },

  data() {
    return {
      isLoading: false,
      isOperate: "view", // add edit view
      currentGrid: {},

      menu: {
        key: "",
        name: "",
        layout: []
        //具体 文档查看链接  https://github.com/jbaysolutions/vue-grid-layout/blob/master/README-zh_CN.md
      }
    };
  },

  computed: {
    ...mapState("home", ["chartMap"]),
    ...mapState("home", ["allSubRoute"]),
    ...mapState("user", ["pid"]) // pid为0 表示root，权限，如果为1表示二级权限
  },

  watch: {
    allSubRoute: {
      handler: function(val) {
        if (this.menu.key) {
          this.refresh(this.menu.key);
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("home", ["add_custom_menu", "update_custom_menu", "delete_custom_menu"]),

    init() {
      this.currentGrid = {};
      this.menu.key = "";
      this.menu.name = "";
      this.menu.layout = [];
    },

    //校验名称是否合法
    validateName() {
      let nameRegx = this.$REGXMAP.name;
      let value = this.menu.name.trim();
      return new Promise((resolve, reject) => {
        if (!value) {
          reject(new Error("Name is required"));
          return;
        }

        if (!nameRegx.firstPlace.regx.test(value)) {
          reject(new Error(nameRegx.firstPlace.message));
          return;
        } else if (!nameRegx.character.regx.test(value)) {
          reject(new Error(nameRegx.character.message));
          return;
        } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
          reject(new Error(nameRegx.length.message));
          return;
        } else {
          resolve();
          return;
        }
      });
    },
    layoutMountedEvent() {
      //点击中间空白区域时，重置右侧的 工具栏
      jquery(".grid-area").click(event => {
        this.currentGrid = {};
      });

      // 点击左侧二级菜单空白区域时，重置右侧的 工具栏
      jquery(".el-aside").click(event => {
        this.currentGrid = {};
      });

      //点击顶部header空白区域时，重置右侧的 工具栏
      jquery(".el-header").click(event => {
        this.currentGrid = {};
      });
    },

    getComponent(type) {
      switch (type) {
        case 1:
          return "collectCard";
          break;
        case 2:
          return "parallelCard";
          break;
        case 3:
          return "heepCard";
          break;
        case 4:
          return "pieCard";
          break;
        case 5:
          return "lineCard";
          break;
        case 6:
          return "tableCard";
          break;
        case 7:
          return "filterCard";
          break;
      }
    },

    //是否已经有一个 filter card
    hasFilterCard(layout) {
      let has = layout.find(item => {
        return item.component == "filterCard";
      });
      if (has) {
        return true;
      } else {
        return false;
      }
    },

    //点击右侧的工具栏的 visual management 来新建或者切换一个 visual chart
    add_visual(type) {
      //type为7表示增加的是个drop list
      if (type == 7 && this.hasFilterCard(this.menu.layout)) {
        this.$message.warning("the Drop List Max one");
        return;
      }

      let isStatic = type == 7 ? true : false;
      let grid = {};
      if (this.menu.layout.length == 0) {
        grid = {
          x: 0,
          y: 0,
          w: 24,
          h: 12,
          i: uuidv4(),
          static: isStatic,
          component: this.getComponent(type),
          toolData: { chartType: type, dataSource: [], chartValue: {} },
          childLayout: []
        };

        console.log("add_visual");
        this.menu.layout.push(_.cloneDeep(grid));
        this.currentGrid = _.cloneDeep(grid);
      } else {
        if (type == 7) {
          //新增个drop list
          grid = {
            x: 0,
            y: 0,
            w: 24,
            h: 6,
            i: uuidv4(),
            static: true,
            component: this.getComponent(type),
            toolData: { chartType: type, dataSource: [], chartValue: {} },
            childLayout: []
          };

          console.log("add_visual==2");
          this.menu.layout.unshift(_.cloneDeep(grid));
        } else {
          //新增个其他

          //返回所有grid的y数组。然后得到最大的。
          let yArray = this.menu.layout.map(item => {
            return item.y;
          });
          let maxY = _.max(yArray);
          let nextY = maxY + 12;

          grid = {
            x: 0,
            y: nextY,
            w: 24,
            h: 12,
            i: uuidv4(),
            static: false,
            component: this.getComponent(type),
            toolData: { chartType: type, dataSource: [], chartValue: {} },
            childLayout: []
          };

          console.log("add_visual==3");
          this.menu.layout.push(_.cloneDeep(grid));
        }

        this.currentGrid = _.cloneDeep(grid);
      }
    },

    //切换右侧的 data source 和 value 来更新当前的chart图
    change_visual(params) {
      //更新当前grid对应得组件
      for (let item of this.menu.layout) {
        if (item.i == this.currentGrid.i) {
          if (params.type) {
            item.component = this.getComponent(params.type);
            item.toolData.chartType = params.type;
            // 当change type时，应该将data source和 chartValue清空
            item.toolData.dataSource = [];
            item.toolData.chartValue = {};
            item.childLayout = [];
          }

          if (params.dataSource) {
            item.toolData.dataSource = params.dataSource;
          }

          if (params.value) {
            item.toolData.chartValue = params.value;
          }
        }
      }
    },

    //点击对应的chart，右侧的工具栏也要跟着联动
    handle_select_component(param) {
      this.currentGrid = _.cloneDeep(param);
    },

    //删除对应的chart，右侧的联动的工具栏要重置。
    handle_delete_component(param) {
      console.log("handle_delete_component");
      this.menu.layout = this.menu.layout.filter(item => {
        return item.i != param.i;
      });

      this.currentGrid = {};
    },

    //取消当前新建或者编辑 状态
    async handle_cancel() {
      this.$confirm("Are you sure to abandon this page configuration?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.isOperate = "view";
            this.$eventHub.$emit("CANCEL-ADD-MENU-ACTIVE", this.menu.key);

            this.refresh(this.menu.key);
          }
        }
      });
    },

    //删除 menu
    async handle_delete() {
      this.$confirm("Are you sure to delete menu?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: async action => {
          if (action == "confirm") {
            this.isLoading = true;

            await this.delete_custom_menu({
              key: this.menu.key
            });

            this.isLoading = false;
          }
        }
      });
    },

    //开始编辑
    handle_edit() {
      this.isOperate = "edit";
    },

    //保存新建的menu
    async handle_save() {
      try {
        await this.validateName();

        this.$confirm("Do you want to save the current menu?", "Tips", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          closeOnClickModal: false,
          type: "warning",
          callback: async action => {
            if (action == "confirm") {
              this.isLoading = true;

              if (this.isOperate == "add") {
                await this.add_custom_menu({
                  name: this.menu.name,
                  layout: this.menu.layout,
                });
              } else {
                console.log("this.menu.layout==1", this.menu.layout);
                await this.update_custom_menu({
                  name: this.menu.name,
                  layout: this.menu.layout,
                  key: this.menu.key
                });
              }

              this.isOperate = "view";

              this.isLoading = false;
              this.$eventHub.$emit("CANCEL-ADD-MENU-ACTIVE", this.menu.key);
            }
          }
        });
      } catch (err) {
        this.$message.warning(err.message);
        this.isLoading = false;
      }
    },

    refresh(key) {
      if (key !== "ADD") {
        let allSubRoute = _.cloneDeep(this.allSubRoute);
        if (allSubRoute.length > 0) {
          let page = allSubRoute.find(item => {
            return item.key == key;
          });

          this.menu.layout = page.layout;
          this.menu.name = page.name;
          this.menu.key = page.key;
        } else {
          this.menu.layout = [];
          this.menu.name = "";
          this.menu.key = "";
        }

        this.isOperate = "view";
      } else {
        //新建
        this.isOperate = "add";
        this.init();
      }
    }
  },

  mounted() {
    this.$eventHub.$on("CHANGE-HOME-SUB-MENU", key => {
      this.refresh(key);
    });

    this.init();
  },

  destroyed() {
    this.$eventHub.$off("CHANGE-HOME-SUB-MENU");
  }
};
</script>
<style lang="scss" scoped>
$chart-height: 400px;

.custom-page {
  flex: 1;
  display: flex;
  flex-direction: column;

  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0 10px;

    .name-wrap {
      color: white;
    }
  }

  .contents {
    flex: 1;
    display: flex;
    // margin: 0 10px 0 10px;

    ::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }

    .grid-area {
      flex: 1;
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      contain: strict;
      // transform: translateX(-10px);
    }

    .blank {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #909399;
    }
  }
}

.vue-grid-layout {
  .vue-grid-item:not(.vue-grid-placeholder) {
    background: white;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
  }
}
</style>
