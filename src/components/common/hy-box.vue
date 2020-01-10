<template>
    <div class="hy-box"
        :class="{'inline-block':!wrap, 'margin-gap':gap, 'disabled':disabled}"
        @click="handle_click">
        <slot></slot>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "HY-Box",

  props: {
    //是否换行
    wrap: {
      type: Boolean,
      required: false,
      default: false
    },

    //是否有间隙
    gap: {
      type: Boolean,
      required: false,
      default: true
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    handle_click() {
      if (!this.disabled) {
        this.$emit("click");
      }
    }
  }
};
</script> 
  
<style lang="scss" scoped>
.hy-box {
  &.margin-gap {
    margin-left: 5px;
  }

  &.disabled {
    cursor: not-allowed;
    *,
    & {
      color: #C0C4CC!important;
    }
  }
}
</style>