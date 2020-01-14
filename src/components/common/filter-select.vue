<template>
    <el-select ref="selectRef"
        v-model="value"
        :multiple="multiple"
        collapse-tags
        :filterable="filterable"
        :clearable="clearable"
        :style="{width:selectWidth}"
        :multiple-limit="limit"
        size="mini"
        :class="{overlap:isOverlapPlaceholderColor }"
        :placeholder="placeholder"
        @change="change_select">
        <slot></slot>
        <el-option v-for="item in options"
            :key="item[prop.value]"
            :label="item[prop.label]"
            :value="item[prop.value]">
        </el-option>
    </el-select>
</template>

<script>
export default {
  name: "Filter-Select",
  components: {},
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    options: {
      type: Array,
      required: true
    },
    checked: {
      type: [Array, String, Number]
    },
    prop: {
      type: Object,
      default: () => {
        return { value: "value", label: "label" };
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },

    width: {
      type: String,
      default: "200px"
    },
    placeholder: {
      type: String,
      default: "please select"
    },
    limit: {
      type: Number,
      default: 0
    },
    isOverlapPlaceholderColor: {
      type: Boolean
      // default: "please select"
    }
  },

  data() {
    return {
      value: this.checked,
      selectWidth: this.width
    };
  },

  watch: {
    checked: {
      handler: function(val) {
        this.value = val;
      },
      deep: true
    }
  },

  methods: {
    change_select(item) {
      this.$emit("change", item);
    }
  },
  computed: {},

  mounted() {
    // jquery(".el-select .el-select__input").on("blur", e => {
    //   jquery(e.target)
    //     .closest(".el-select")
    //     .css("width", this.width);
    // });
    // jquery(".el-select .el-select__input").on("focus", e => {
    //   jquery(e.target)
    //     .closest(".el-select")
    //     .css("width", "200px");
    // });
  }
};
</script>
<style lang="scss" scoped>
.el-select {
  transition: all ease-in-out 1s;
  margin-right: 5px;

  // & + .el-select {
  //   margin-left: 0;
  // }

  .el-tag {
    margin: 0px 0 0px 3px;
  }

  .el-select__input {
    margin-left: 5px;
    // width:0px!important
  }

  .overlap {
    ::placeholder {
      color: #606266;
    }
  }
}
</style>