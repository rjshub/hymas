<template>
    <div class="level-first">
        <div class="show-detail"
            v-if="values.operate==undefined && values.isAdd==undefined">
            <div class="name">
                <div v-hover
                    class="text">
                    <span>{{values.name}}</span>
                </div>

                <span class="edit"
                    v-if="!isReadOnly"
                    @click="handle_level_two_delete(values)"><i class="el-icon-close"></i></span>
            </div>
        </div>
        <!-- 展开 -->
        <div v-else-if="values.operate=='down'"
            class="show-more"
            @click="handle_show_item_more">
            <i class="iconfont mas-down2"></i>
        </div>
        <!-- 收起 -->
        <div v-else-if="values.operate=='up'"
            class="show-more"
            @click="handle_hide_item_more">
            <i class="iconfont mas-up2"></i>
        </div>
        <!-- 添加 -->
        <div v-else-if="values.operate=='add' && !isReadOnly"
            class="show-add"
            @click="handle_add_level_two(values)">
            <i class="el-icon-plus"
                title="Add Role"></i>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Level-First",
  components: {},

  props: {
    values: {
      type: Object,
      require: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },
  computed: {},

  methods: {
    handle_show_item_more() {
      this.$dispatch("CardList", "show-item-more");
    },
    handle_hide_item_more() {
      this.$dispatch("CardList", "hide-item-more");
    },

    handle_level_two_delete(params) {
      this.$dispatch("CardList", "delete-card", { level: 1, id: params.id });
    },
    handle_add_level_two(params) {
      this.$dispatch("CardList", "add-card", { level: 1, id: params.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.level-first {
  box-sizing: border-box;
  display: flex;
  padding: 8px;
  width: 200px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #e5e5e5;

  .show-detail {
    display: flex;
    flex-direction: column;
    flex: 1;

    i {
      font-size: 18px;
      cursor: pointer;
      color: #666666;
    }

    .sign {
      display: inline-block;
      height: 10px;
      width: 10px;
      background-color: #00a8e5;
      border-radius: 50%;

      &.disabled {
        background-color: #f1b657;
      }
    }
  }

  .show-more,
  .show-add {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #666666;

    i {
      font-size: 16px;
      color: #666666;
    }
  }

  .name {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-start;

    .text {
      font-size: 18px;
      width: 160px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #666666;
      height: 20px;
    }
  }
}
</style>
