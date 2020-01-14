<template>
    <el-tabs v-model="tabValue"
        type="border-card"
        class="hy-radio-group"
        size="mini"
        closable
        @tab-remove="removeTab"
        @tab-click="handle_click_tab">
        <el-tab-pane v-for="(item) in getOptions"
            :key="item.name"
            :label="item.title"
            :name="item.name">
        </el-tab-pane>
    </el-tabs>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "HyRadioGroup",
  components: {},

  model: {
    prop: "value",
    event: "change"
  },

  props: {
    options: {
      type: [Object, Array],
      required: false
    },
    value: {
      type: [Number, String]
    }
  },

  data() {
    return {
      tabValue: "",
      tabOldValue: ""
    };
  },

  computed: {
    getOptions() {
      return this.options.map(item => {
        return { title: item.name, name: item.id + "" };
      });
    }
  },

  /* 依赖注入， 本地通过this.injectName调用。 */

  // inject: ["injectName"],

  watch: {
    value(val) {
      this.tabValue = val;
    }
  },

  methods: {
    removeTab() {},

    handle_click_tab(item) {
      if(this.tabValue!=this.tabOldValue){
         this.$emit("change",this.tabValue);
         this.tabOldValue = this.tabValue;
      }
    }
  },
  mounted() {
    this.tabValue = this.value;
    this.tabOldValue = this.value;
  }
};
</script> 
  
<style lang="scss" scoped>
.hy-radio-group {
  border: 0;
  margin-bottom: 5px;

  ::v-deep .el-tabs__header {
    background-color: #fff;
    border-bottom: 0;

    .el-tabs__nav-wrap {
      margin-bottom: 0;

      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        box-sizing: border-box;
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        border: 1px solid #c0c4cc;
        background-color: #04407c;
        color: white;
      }

      .el-tabs__nav {
        .el-tabs__item {
          margin: 0;
          border: 1px solid #c0c4cc;
          height: 25px;
          line-height: 25px;

          &.is-active {
            background-color: #04407c;
            border: 1px solid #04407c;
            color: white;
          }
        }
      }
    }
  }

  ::v-deep .el-tabs__content {
    display: none;
  }
}
</style> 