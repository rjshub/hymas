<template>
    <div class="slide-menu">
        <template v-for="(item,index) in list">
            <div v-if="!item.hidden"
                :key="index"
                class="item"
                :class="{active:defaultMenuActive==item.key }"
                @click="handleMenuClick(item.key)">
                {{item.name}}
            </div>
        </template>
    </div>
</template>

<script>
export default {
  name: "OtherSlideMenu",
  components: {},

  props: {
    defaultActive: {
      type: [String, Number],
      required: false
    },
    //菜单列表
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      defaultMenuActive: ""
    };
  },
  computed: {},
  watch: {
    defaultActive(val) {
      this.defaultMenuActive = val;
    }
  },

  methods: {
    handleMenuClick(item) {
      this.defaultMenuActive = item;
      this.$emit("changeSlideMenu", { path: `/${this.$route.meta.route}/${item}`, subRoute: item });
    }
  },

  mounted() {
    if (this.defaultActive) {
      this.defaultMenuActive = this.defaultActive;
    } else {
      if (this.list && this.list.length > 0) {
        this.defaultMenuActive = this.list[0].key;
      }
    }
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
}
</style>
