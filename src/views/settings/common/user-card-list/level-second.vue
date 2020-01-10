<template>
    <div class="level-second">
        <div class="show-detail"
            v-if="values.operate==undefined && values.isAdd==undefined">
            <div class="name">
                <div v-hover
                    class="text">
                    <span>{{values.name}}</span>
                </div>
                <span class="more">
                    <el-popover v-model="popover"
                        placement="right"
                        width="100"
                        popper-class="operate-popver"
                        trigger="click">
                        <div>
                            <span v-if="!isReadOnly"
                                class="popver-item"
                                @click="handle_level_two_edit(values)"><i class="iconfont mas-edit"></i> Edit</span>
                            <span v-if="isReadOnly"
                                class="popver-item"
                                @click="handle_level_two_detail(values)"><i class="el-icon-document"></i> Detail</span>
                            <span v-if="values.state==0 && !isReadOnly"
                                class="popver-item"
                                @click="handle_level_two_turnOn(values)"><i class="iconfont mas-open"></i> Enable</span>
                            <span v-if="values.state==1 && !isReadOnly"
                                class="popver-item"
                                @click="handle_level_two_turnOff(values)"><i class="iconfont mas-pause"></i> Disable</span>
                        </div>

                        <i slot="reference"
                            class="iconfont mas-more1-vertical"></i>
                    </el-popover>
                </span>
            </div>
            <div class="time">Updated on {{values.update_time}}</div>
            <div class="role">Role: {{values.pname}}&gt;{{values.role_name}}</div>
            <div class="status">
                <span class="sign"
                    :class="{disabled: values.state==0}"></span>
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
        <div v-else-if="values.operate=='add'"
            class="show-add"
            @click="handle_add_level_two(values)">
            <i class="el-icon-plus"
                title="Add User"></i>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Level-Two",
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
    return {
      popover: false
    };
  },
  computed: {},

  methods: {
    handle_show_item_more() {
      this.$dispatch("CardRow", "show-item-more");
    },
    handle_hide_item_more() {
      this.$dispatch("CardRow", "hide-item-more");
    },

    handle_level_two_edit(params) {
      this.popoverClose();
      this.$dispatch("CardList", "edit-card", { level: 2, id: params.id });
    },

    handle_level_two_detail(params) {
      this.popoverClose();
      this.$dispatch("CardList", "detail-card", { level: 2, id: params.id });
    },

    handle_level_two_turnOn(params) {
      this.popoverClose();
      this.$dispatch("CardList", "turn-on-card", { level: 2, id: params.id });
    },

    handle_level_two_turnOff(params) {
      this.popoverClose();
      this.$dispatch("CardList", "turn-off-card", { level: 2, id: params.id });
    },

    handle_add_level_two(params) {
      this.$dispatch("CardList", "add-card", { level: 2, id: params.id });
    },

    popoverClose() {
      this.popover = false;
    }
  },

  mounted() {
    document.addEventListener("DOMMouseScroll", () => {
      this.popoverClose();
    }); // firefox

    // ie  chrome， safari
    window.addEventListener("mousewheel", () => {
      this.popoverClose();
    });
  }
};
</script>

<style lang="scss" scoped>
.level-second {
  box-sizing: border-box;
  display: flex;
  padding: 15px;
  width: 250px;
  height: 130px;
  background-color: white;
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
      font-size: 24px;
      color: #666666;
    }
  }

  .name {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-start;

    .text {
      font-size: 23px;
      width: 170px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #666666;
      height: 30px;
    }
  }

  .time,
  .role {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    color: #666666;
  }

  .status {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>