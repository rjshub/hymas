<template>
    <transition mode="out-in"
        name="el-zoom-in-top">
        <div v-show="isShow">
            <div class="tree-content"
                :style="treeWidth">
                <div class="tree-tool">
                    Please Select
                    <div class="pull-right"
                        :inline="true">
                        <el-button type="text"
                            :disabled="disabled"
                            size="mini"
                            @click="selectAll">Select All</el-button>
                        <span> - </span>
                        <el-button type="text"
                            :disabled="disabled"
                            size="mini"
                            @click="reset">Reset</el-button>
                    </div>
                </div>
                <div class="tree"
                    :style="treeHeight">
                    <el-input v-if="hasFilter"
                        :disabled="disabled"
                        size="mini"
                        placeholder="Enter Keyword"
                        v-model="filterText">
                    </el-input>
                    <el-tree :data="values"
                        :disabled="disabled"
                        show-checkbox
                        node-key="key"
                        ref="leftTree"
                        :props="defaultProps"
                        :filter-node-method="filterKeyWordNode"
                        :default-checked-keys="selectedKeys">
                        <template v-slot="{ node }">
                            <span class="el-tree-custom-item"
                                style="margin-left:5px;">
                                <div v-hover
                                    class="label">
                                    <span>{{node.label}}</span>
                                </div>
                            </span>
                        </template>
                    </el-tree>
                </div>
            </div>

            <div class="select-add">
                <el-button type="primary"
                    :disabled="disabled"
                    size="mini"
                    @click="addSelectToRight">Add</el-button>
            </div>

            <div class="tree-content"
                :style="treeWidth">
                <div class="tree-tool">
                    Selected ({{selectedKeys.length}})
                    <div class="pull-right"
                        :inline="true">
                        <el-button type="text"
                            :disabled="disabled"
                            size="mini"
                            @click="clearAll">Clear</el-button>
                    </div>
                </div>
                <div class="tree"
                    :style="treeHeight">
                    <div>
                        <el-tree :data="defaultSelectedValues"
                            :disabled="disabled"
                            default-expand-all
                            node-key="key"
                            ref="rightTree"
                            :props="defaultProps"
                            :filter-node-method="filterNode">
                            <template v-slot="{ node, data }">
                                <span v-if="data[defaultProps.children] && data[defaultProps.children].length > 0"
                                    class="el-tree-custom-item">
                                    <div v-hover
                                        class="label">
                                        <span>{{node.label}}</span>
                                    </div>
                                </span>

                                <span v-else
                                    class="el-tree-custom-item">
                                    <div v-hover
                                        class="label">
                                        <span>{{node.label}}</span>
                                    </div>
                                    <span class="btn">
                                        <el-button style="font-size: 12px;"
                                            :disabled="disabled"
                                            type="text"
                                            @click="remove(node,data)">Delete
                                        </el-button>
                                    </span>
                                </span>
                            </template>
                        </el-tree>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import treeJs from "element-tree-js";

export default {
  name: "tree",
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    //tree的宽度
    width: {
      type: String,
      required: true
    },

    //tree的高度
    height: {
      type: String,
      required: true
    },

    defaultProps: {
      type: Object,
      required: true
    },

    //tree需要显示的值
    values: {
      type: Array,
      required: true
    },

    // 右侧树的values
    defaultSelectedValues: {
      type: Array,
      required: false
    },
    defaultSelectedKeys: {
      type: Array,
      required: true
    },

    hasFilter: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isShow: true,
      filterText: "", //搜索框 关键字

      selectedKeys: [], //选中的条目keys
      selectedIds: [] //选中的条目ids
    };
  },

  computed: {
    treeWidth() {
      return { width: this.width };
    },
    treeHeight() {
      return { height: this.height };
    }
  },

  watch: {
    filterText(val) {
      this.$refs.leftTree.filter(val);
    },

    defaultSelectedKeys: {
      handler: function(val) {
        let result = val.filter(item => item != ""); //过滤掉数组中空元素
        this.selectedKeys = _.cloneDeep(result);

        this.$nextTick(() => {
          this.$refs.leftTree.setCheckedKeys(this.selectedKeys);
          this.$refs.rightTree.filter(this.selectedKeys);
        });
      },
      deep: true
    },

    defaultSelectedValues: {
      handler: function(val) {
        this.$refs.leftTree.setCheckedKeys(this.selectedKeys);

        this.$nextTick(() => {
          this.$refs.rightTree.filter(this.selectedKeys);
        });
      },
      deep: true
    }
  },

  methods: {
    /**全选 */
    selectAll() {
      this.$refs.leftTree.setCheckedNodes(this.values);
    },

    /**重置 */
    reset() {
      this.$refs.leftTree.setCheckedNodes([]);
      this.filterText = "";
    },

    /**添加 */
    addSelectToRight() {
      this.selectedKeys = this.$refs.leftTree.getCheckedKeys(true);
      let idList = treeJs.getTreeDestList(this.values, "key", this.selectedKeys, "id");
      this.$emit("update:add", {
        keys: this.selectedKeys,
        ids: idList
      });
    },

    /**清空 */
    clearAll() {
      this.$emit("update:clear");
    },

    /**删除 */
    remove(node, data) {
      let key = this.selectedKeys.indexOf(data.key);
      let removedKey = this.selectedKeys.slice(key, key + 1);

      let idList = treeJs.getTreeDestList(this.values, "key", removedKey, "id");

      this.$emit("update:remove", {
        keys: removedKey,
        ids: idList
      });
    },

    //左侧树关键词搜索
    filterKeyWordNode(value, data) {
      if (!value) return true;
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },

    //执行 filter 方法后调用
    filterNode(value, data) {
      if (!value) return true;
      return value.indexOf(data.key) !== -1;
    }
  },
  mounted() {
    treeJs.setDefaultChildName(this.defaultProps.children);
    this.selectedKeys = _.cloneDeep(this.defaultSelectedKeys);

    this.$nextTick(() => {
      this.$refs.rightTree.filter(this.selectedKeys);
    });
  }
};
</script>

<style lang="scss" scoped>
.tree-content {
  float: left;
  border: 1px solid #dedede;

  .tree-tool {
    height: 28px;
    padding: 0 10px;
    line-height: 2;
    background-color: #fafafa;
    border-bottom: 1px #eee solid;

    .pull-right {
      float: right;
    }
  }

  .tree {
    overflow: auto;
    width: 100%;
  }
}

.select-add {
  width: 55px;
  float: left;
  margin: 0px 5px;
}

.el-tree-custom-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;

  .label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btn {
    width: 50px;
    text-align: center;
  }
}
</style>