<template>
    <div class="level-first">
        <div class="show-detail"
            v-if="values.operate==undefined">
            <div class="name">
                <div v-hover
                    class="text">
                    <span>{{values.serial}}</span>
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
                                @click="handle_level_first_edit(values)"><i class="iconfont mas-edit"></i> Edit</span>
                            <span class="popver-item"
                                @click="handle_level_third_delete(values)"><i class="el-icon-delete"></i> Delete</span>
                        </div>

                        <i slot="reference"
                            class="iconfont mas-more1-vertical"></i>
                    </el-popover>

                </span>
            </div>
            <div class="name">
                <div v-hover
                    class="text">
                    <span>{{values.name}}</span>
                </div>
            </div>
            <div class="status">
                <div v-hover
                    class="text">
                    <span>{{values.industry}}</span>
                </div>
            </div>

            <div class="status">
                <span class="time">
                    Updated on {{values.updated_at}}
                </span>
                <span v-if="!isReadOnly"
                    class="add"
                    @click="handle_add_level_second(values)"><i class="el-icon-plus"></i></span>
            </div>
        </div>
        <div v-else-if="values.operate=='down'"
            class="show-more"
            @click="handle_show_more">
            <i class="iconfont mas-down2"></i>
        </div>
        <div v-else-if="values.operate=='up'"
            class="show-add"
            @click="handle_hide_more">
            <i class="iconfont mas-up2"></i>
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
    return {
      popover: false
    };
  },
  computed: {},

  methods: {
    handle_show_more() {
      this.$dispatch("CardList", "show-more");
    },

    handle_hide_more() {
      this.$dispatch("CardList", "hide-more");
    },

    handle_level_first_edit(params) {
      this.popoverClose();
      this.$dispatch("CardList", "edit-card", { level: 1, id: params.id });
    },

    handle_level_third_delete(params) {
      this.popoverClose();

      this.$confirm("Are you sure to delete client?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.$dispatch("CardList", "delete-card", { level: 1, id: params.id });
          }
        }
      });
    },
    handle_add_level_second(params) {
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
.level-first {
  box-sizing: border-box;
  display: flex;
  padding: 15px;
  width: 250px;
  height: 150px;
  border-radius: 5px;
  margin-right: 10px;
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
      font-size: 25px;
      width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 30px;
    }
  }

  .time {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    white-space: nowrap;
  }

  .status {
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: flex-end;
  }
}
</style>

