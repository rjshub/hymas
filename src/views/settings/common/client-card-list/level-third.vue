<template>
    <div class="level-third">
        <div class="show-detail"
            v-if="values.operate==undefined">
            <div class="name">
                <div v-hover
                    class="text">
                    <span>{{values.name}}</span>
                </div>

                <span class="more">
                    <el-popover v-if="!isReadOnly"
                        v-model="popover"
                        placement="right"
                        width="100"
                        popper-class="operate-popver"
                        trigger="click">
                        <div>
                            <span class="popver-item"
                                @click="handle_level_third_edit(values)"><i class="iconfont mas-edit"></i> Edit</span>
                            <span class="popver-item"
                                @click="handle_level_third_delete(values)"><i class="el-icon-delete"></i> Delete</span>
                        </div>
                        <i slot="reference"
                            class="iconfont mas-more1-vertical"></i>
                    </el-popover>
                </span>
            </div>
            <div class="time">Updated on {{values.updated_at}}</div>
        </div>
        <div v-else-if="values.operate=='down'"
            class="show-more"
            @click="handle_show_item_more">
            <i class="iconfont mas-down2"></i>
        </div>
        <div v-else-if="values.operate=='up'"
            class="show-more"
            @click="handle_hide_item_more">
            <i class="iconfont mas-up2"></i>
        </div>

        <div v-else-if="values.operate=='add' && !isReadOnly "
            class="show-add"
            @click="handle_add_level_third(values)">
            <i class="el-icon-plus"
                title="Add Client"></i>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Level-Third",
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

    handle_level_third_edit(params) {
      this.popoverClose();
      this.$dispatch("CardList", "edit-card", { level: 3, id: params.id });
    },

    handle_level_third_delete(params) {
      this.popoverClose();

      this.$confirm("Are you sure to delete product?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.$dispatch("CardList", "delete-card", { level: 3, id: params.id });
          }
        }
      });
    },

    handle_add_level_third(params) {
      this.$dispatch("CardList", "add-card", { level: 3, id: params.id });
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
.level-third {
  box-sizing: border-box;
  display: flex;
  padding: 15px;
  width: 250px;
  height: 110px;
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
  }

  .show-more,
  .show-add {
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    i {
      font-size: 24px;
    }
  }

  .name {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-start;

    .text {
      font-size: 23px;
      width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 30px;
      color: #555555;
    }
  }

  .time {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    color: #666666;
  }
}
</style>
