<template>
    <div class="role-tree">
        <div class="list-panel">
            <div class="title">
                <span>Generate Permissions</span>
                <!-- 加号 -->
                <!-- <i v-if="!disabled"
                    class="el-icon-plus"
                    @click="handle_add_permission"></i> -->
            </div>
            <div class="list">
                <div v-for="(per,index) in values"
                    :key="index"
                    class="list-item"
                    :class="{active: per.id==activePermissionId}"
                    @click="handle_active_permission(per)">
                    <span class="name">Permission {{index+1}}</span>

                    <!-- 阻止冒泡，否则 会触发到 v-for中的click，导致性能很慢 -->
                    <span @click.stop="()=>{}">
                        <el-switch v-model="per.state"
                            :disabled="disabled"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0">
                        </el-switch>
                    </span>
                </div>
            </div>
        </div>
        <div class="tree-panel">
            <div class="tree-area">
                <div class="tree-header">
                    <div class="left">Clients Permission</div>
                    <div class="right">System Permission</div>
                </div>

                <div class="tree-body">
                    <div class="left-tree">
                        <el-tree v-if="isShowTree"
                            ref="clientsTree"
                            :data="leftClientsTreeList"
                            :props="treeProps"
                            default-expand-all
                            :indent="20"
                            show-checkbox
                            node-key="id"
                            :default-checked-keys="leftClientsCheckedKeys"
                            @check-change="handle_left_clientsTree_change">
                        </el-tree>
                    </div>
                    <div class="right-tree">
                        <div class="tree-area">
                            <div class="tree-header-second">
                                <div class="left">Custom</div>
                                <div class="right">Fixed</div>
                            </div>

                            <div class="tree-body-second">
                                <div class="left-tree">
                                    <el-tree v-if="isShowTree"
                                        ref="customTree"
                                        :data="rightCustomTreeList"
                                        :props="treeProps"
                                        default-expand-all
                                        :indent="20"
                                        show-checkbox
                                        node-key="id"
                                        :default-checked-keys="rightCustomCheckedKeys"
                                        @check-change="handle_right_customTree_change">
                                    </el-tree>
                                </div>
                                <div class="right-tree">
                                    <el-tree v-if="isShowTree"
                                        ref="fixedTree"
                                        :data="rightFixedTreeList"
                                        :disabled="disabled"
                                        :props="treeProps"
                                        :indent="20"
                                        default-expand-all
                                        show-checkbox
                                        :default-checked-keys="rightFixedCheckedKeys"
                                        node-key="id"
                                        @check-change="handle_right_fixedTree_change">
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="write-and-read">
                <template v-for="(per) in values">
                    <el-radio-group v-if="per.id==activePermissionId"
                        :key="per.id"
                        v-model="per.type"
                        :disabled="disabled">
                        <el-radio :label="1">Writable</el-radio>
                        <el-radio :label="2">Readable</el-radio>
                    </el-radio-group>

                    <div v-if="per.id==activePermissionId && values.length>1 && per.is_back!=1"
                        :key="per.id+'del'"
                        class="delete">
                        <el-button size="mini"
                            :disabled="disabled"
                            @click="handle_delete_permission">Delete</el-button>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import treeJs from "element-tree-js";
import fetch from "@/services/fetch";

treeJs.setDefaultChildName("children");

export default {
  name: "Role-Tree",
  components: {},

  props: {
    values: {
      type: [Object, Array],
      require: true
    },
    treeData: {
      type: [Object, Array],
      require: true
    },
    disabled: {
      type: Boolean,
      deafult: false
    },
    defaultId: {
      type: String
    }
  },

  watch: {
    values: {
      handler: function(val) {
        this.$nextTick(() => {
          this.setTreeCheckedAndDisabled(this.activePermissionId);
        });
      },
      deep: true
    },
    defaultId(val) {
      this.setActivePermissionId(val);
    },
    treeData: {
      handler: function(val) {
        this.setTreeData();
      },
      deep: true
    }
  },

  data() {
    return {
      isShowTree: true, //用来重新渲染tree，不然就近复用有缓存
      treeProps: {
        label: "name",
        children: "children"
      },

      leftClientsTreeList: [], //左侧client树list
      rightCustomTreeList: [], //右侧custom树list
      rightFixedTreeList: [], //右侧fixed树list

      activePermissionId: "", //当前活动的permission id

      leftClientsCheckedKeys: [], //左树默认选中的 keys
      rightCustomCheckedKeys: [], //右树默认选中的 keys
      rightFixedCheckedKeys: [], //右树默认选中的 keys

      timer: null
    };
  },
  computed: {},

  methods: {
    setTreeData() {
      console.log("1");
      this.leftClientsTreeList = this.treeData.product;
       console.log("2");
      this.rightCustomTreeList = this.treeData.menu.custom;
      this.rightFixedTreeList = this.treeData.menu.fixed;
    },

    setActivePermissionId(id) {
      this.activePermissionId = id;
    },

    /**设置选中和禁用 keys*/
    setTreeCheckedAndDisabled(id) {
      let product_ids = [];
      let auth_custom_ids = [];
      let auth_fixed_ids = [];

      let product_arr = [];
      let auth_custom_arr = [];
      let auth_fixed_arr = [];

      //设置禁用
      //找出 除去当前之外所有的id
      for (let item of this.values) {
        if (item.id != id) {
          console.log("3");
          product_arr.push(item.product);
          console.log("4");
          auth_custom_arr.push(item.auth.custom);
          auth_fixed_arr.push(item.auth.fixed);
        }
      }

      for (let i in product_arr) {
        product_ids = product_ids.concat(product_arr[i]);
      }

      for (let i in auth_custom_arr) {
        auth_custom_ids = auth_custom_ids.concat(auth_custom_arr[i]);
      }

      for (let i in auth_fixed_arr) {
        auth_fixed_ids = auth_fixed_ids.concat(auth_fixed_arr[i]);
      }

      //设置选中
      this.$nextTick(() => {
        console.log("5",this.values, id);
        this.leftClientsCheckedKeys = this.values.find(item => item.id == id).product;
        console.log("6");
        this.rightCustomCheckedKeys = this.values.find(item => item.id == id).auth.custom;
        this.rightFixedCheckedKeys = this.values.find(item => item.id == id).auth.fixed;

        //todo

        //将id对应的auth_ids节点设置为禁用

        if (this.disabled) {
          this.rightCustomTreeList = treeJs.modifyAllTreeDisabled(this.treeData.menu.custom, true);
          this.rightFixedTreeList = treeJs.modifyAllTreeDisabled(this.treeData.menu.fixed, true);
        }

        //将id对应的product_ids节点设置为禁用
        if (this.disabled) {
           console.log("7");
          this.leftClientsTreeList = treeJs.modifyAllTreeDisabled(this.treeData.product, true);
           console.log("8");
        } else {
          this.leftClientsTreeList = treeJs.modifyTreeNodeDisabled(this.treeData.product, "id", product_ids, true);
        }

        //todo

        this.isShowTree = true;
      });
    },

    handle_add_permission() {
      this.$emit("add");
    },

    handle_delete_permission() {
      let id = this.activePermissionId;
      for (let i in this.values) {
        if (this.values[i].id == id) {
          if (i == this.values.length - 1) {
            //i 为最后一个
            this.activePermissionId = this.values[Number(i) - 1].id; //将倒数第二个给activePermissionId
            break;
          } else {
            this.activePermissionId = this.values[Number(i) + 1].id;
            break;
          }
        }
      }
      this.$emit("delete", id);
    },

    //切换左侧的permission 项
    handle_active_permission(item) {
      this.isShowTree = false;
      this.setActivePermissionId(item.id);
      this.setTreeCheckedAndDisabled(item.id);
    },

    handle_left_clientsTree_change(a, b, c) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let ids = this.$refs["clientsTree"].getCheckedKeys(true);
        for (let i in this.values) {
          if (this.values[i].id == this.activePermissionId) {
            this.values[i].product = ids;
          }
        }
      }, 250); //防抖时间 150ms
    },
    handle_right_customTree_change(a, b, c) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let ids = this.$refs["customTree"].getCheckedKeys(true);
        for (let i in this.values) {
          if (this.values[i].id == this.activePermissionId) {
            this.values[i].auth.custom = ids;
          }
        }
      }, 250); //防抖时间 150ms
    },

    handle_right_fixedTree_change(a, b, c) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let ids = this.$refs["fixedTree"].getCheckedKeys(true);
        for (let i in this.values) {
          if (this.values[i].id == this.activePermissionId) {
            this.values[i].auth.fixed = ids;
          }
        }
      }, 250); //防抖时间 150ms
    }
  },

  mounted() {
    this.setActivePermissionId(this.defaultId);
    this.setTreeCheckedAndDisabled(this.activePermissionId);

    this.setTreeData();


  }
};
</script>
<style lang="scss" scoped>
$item-height: 35px;
$item-height-second: 25px;

//滚动条大小
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.role-tree {
  display: flex;
  height: 100%;
  background-color: #f3f3f3;

  .title {
    height: $item-height;
    line-height: $item-height;
    text-align: center;
    border-bottom: 1px solid white;
    font-weight: bold;
    font-size: 13px;
  }

  ::v-deep .el-tree {
    background: transparent;

    * {
      min-width: initial;
    }

    .el-checkbox__inner {
      border-radius: 0px;
    }

    > .el-tree-node {
      border-right: 1px solid white;
    }

    .el-checkbox__inner.is-disabled {
      .el-checkbox__inner {
        background-color: #d7d7d7;
      }
    }
  }

  .list-panel {
    display: flex;
    flex-direction: column;
    width: 250px;
    box-sizing: border-box;
    border-right: 1px solid white;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      background-color: inherit;

      i {
        cursor: pointer;
      }
    }

    .list {
      flex: 1;
      overflow: auto;

      .list-item {
        height: $item-height;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        background-color: transparent;
        cursor: pointer;

        &.active {
          background-color: #e0e0e0;
        }
      }
    }
  }

  .tree-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    box-sizing: border-box;

    .title {
      background-color: #e0e0e0;
    }

    .tree-area {
      display: flex;
      flex-direction: column;
      flex: 1;
      box-sizing: border-box;

      .tree-header {
        display: flex;
        box-sizing: border-box;
        height: $item-height;
        line-height: $item-height;
        border-bottom: 1px solid white;
        background-color: #bcbcbc;

        .left {
          flex: 2;
          border-right: 1px solid white;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
        }
        .right {
          flex: 3;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
        }
      }

      .tree-body {
        display: flex;
        flex: 1;
        overflow: hidden;

        .left-tree {
          display: flex;
          flex-direction: column;
          flex: 2;
          overflow: auto;
          overflow: overlay;
        }

        .right-tree {
          display: flex;
          flex-direction: column;
          flex: 3;
        }
      }

      .tree-header-second {
        display: flex;
        box-sizing: border-box;
        height: $item-height-second;
        line-height: $item-height-second;
        border-bottom: 1px solid white;
        background-color: #dadada;

        .left {
          flex: 1;
          border-right: 1px solid white;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
        }
        .right {
          flex: 1;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
        }
      }

      .tree-body-second {
        display: flex;
        flex: 1;
        overflow: hidden;

        .left-tree {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: auto;
          overflow: overlay;
        }

        .right-tree {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: auto;
          overflow: overlay;
        }
      }

      ::v-deep .el-tree-node__content {
        .el-tree-node__label {
          padding-left: 0;
        }
      }
    }

    .write-and-read {
      display: flex;
      align-items: center;
      border-top: 1px solid white;
      height: 50px;
      padding-left: 25px;

      .delete {
        margin-left: 25px;
      }
    }
  }
}
</style>
