<template>
    <div class="checkbox-popover">
        <el-button size="mini"
            v-popover:filterOptions
            icon="iconfont mas-list3"
            :title="name">
        </el-button>
        <el-popover ref="filterOptions"
            v-model="isFilterShow"
            placement="bottom-end"
            :width="width"
            trigger="click"
            popper-class="filter-popper"
            @show="show">
            <div @mousewheel="handle_mouse_wheel">
                <div class="checkbox-area">
                    <el-checkbox-group v-model="selected"
                        :disabled="disabled">
                        <el-checkbox v-for="(item,index) in items"
                            :disabled="item.disabled"
                            :key="index"
                            :label="item.id">
                            {{item.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div style="margin-top: 10px; width: 100%; text-align: right;">
                    <el-button type="primary"
                        :disabled="disabled"
                        size="mini"
                        @click="save">Confirm</el-button>
                    <el-button size="mini"
                        @click="cancel">Cancel</el-button>
                </div>
            </div>
        </el-popover>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Checkbox-Popover",
  props: {
    name: {
      type: String,
      default: "Select brands"
    },
    placement: {
      type: String,
      default: "top"
    },
    values: {
      type: Array,
      required: false
    },
    items: {
      type: Array,
      required: false
    },
    width: {
      type: String,
      default: "200"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      selected: [], //自定义条件的值
      isFilterShow: false,
      isStayPoppver: false
    };
  },

  watch: {},

  methods: {
    save() {
      this.isFilterShow = false;
      this.$emit("change", this.selected);
    },

    cancel() {
      this.isFilterShow = false;
    },
    show() {
      this.selected = _.cloneDeep(this.values);
      this.isFilterShow = true;
    },

    handle_mouse_wheel() {
      this.isStayPoppver = true;
    },

    scrollclose(event) {
      if (this.isFilterShow && !this.isStayPoppver) {
        this.isFilterShow = false;
      }
      this.isStayPoppver = false;
    }
  },

  mounted() {
    document.addEventListener("DOMMouseScroll", () => {
      this.scrollclose();
    }); // firefox

    // ie  chrome， safari
    window.addEventListener("mousewheel", () => {
      this.scrollclose();
    });
  }
};
</script>

<style lang="scss" scoped>
.checkbox-popover {
  display: inline-block;
}
</style>
<style lang="scss">
.filter-popper {
  ::v-deep ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .checkbox-area {
    height: 300px;
    overflow: auto;

    .el-checkbox-group {
      display: flex;
      flex-direction: column;

      .el-checkbox {
        height: 23px;
        line-height: 23px;
      }
    }
  }
}
</style>
