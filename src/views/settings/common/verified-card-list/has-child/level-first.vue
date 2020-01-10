<template>
    <div class="level-first">
        <div class="show-detail"
            v-if="values.operate==undefined">
            <div class="name">
                <div v-hover
                    class="text">
                    <span>{{values.name}}</span>
                </div>

                <span class="delete"
                    v-if="!isReadOnly && isFirstDelete"
                    @click="handle_level_one_delete(values)"><i class="el-icon-close"></i></span>
            </div>
        </div>

        <div v-else-if="values.operate=='down'"
            class="show-more"
            @click="handle_show_more">
            <i class="iconfont mas-down2"></i>
        </div>
        <div v-else-if="values.operate=='up'"
            class="show-more"
            @click="handle_hide_more">
            <i class="iconfont mas-up2"></i>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Level-One",
  components: {},

  props: {
    values: {
      type: Object,
      require: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    //第一层是否可以删除
    isFirstDelete: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {};
  },
  computed: {},

  methods: {
    handle_show_more() {
      this.$dispatch("CardList", "show-more");
    },

    handle_hide_more() {
      this.$dispatch("CardList", "hide-more");
    },

    handle_level_one_delete(params) {
      this.$dispatch("CardList", "delete-card", { level: 1, id: params.id });
    }
  }
};
</script>

<style lang="scss" scoped>
.level-first {
  box-sizing: border-box;
  display: flex;
  width: 200px;
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
  padding: 8px;
  margin-bottom: 10px;
  background-color: #768696;
  color: white;
  border: 1px solid #e5e5e5;

  .show-detail {
    display: flex;
    flex-direction: column;
    flex: 1;

    i {
      font-size: 20px;
      cursor: pointer;
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

  .show-more {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    i {
      font-size: 16px;
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
      height: 20px;
    }
  }

  .time {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .status {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>