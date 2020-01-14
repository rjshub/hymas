<template>
    <div class="report-field">
        <div class="field-wrap">
            <div v-if="!isEditName"
                class="title"
                @click="handle_click_name">
                <div v-hover
                    class="text">
                    <span>{{values.field_name}}</span>
                </div>
            </div>
            <div v-else
                class="title">
                <el-input ref="inputRef"
                    v-model="values.field_name"
                    size="mini"
                    @blur="handle_change_name"></el-input>
            </div>
            <div class="list">
                <template v-if="values.list && values.list.length>0">
                    <VirtualList :size="29"
                        :remain="8">
                        <div v-for="(item) in values.list"
                            :key="item.id"
                            class="list-item">
                            <span v-hover
                                class="name">
                                <span>{{item.name}}</span>
                            </span>
                            <i class="iconfont mas-close"
                                @click="handle_subordinate_delete(item.id)"></i>
                        </div>
                    </VirtualList>
                </template>
                <div v-else
                    class="no-data">
                    <span v-if="values.hasSubordinate">No Data</span>
                    <span v-else>Data</span>
                </div>
            </div>

            <div v-if="values.hasSubordinate"
                class="add"
                @click="handle_add(values.field_id)">
                <i class="el-icon-plus"></i>
            </div>
            <div v-else
                class="add-disabled">
                <!-- <i class="el-icon-plus"></i> -->
            </div>

            <div class="operate">
                <div class="total"
                    v-if="values.isTotal!=2">
                    <span :class="{active:values.isTotal==1}"
                        @click="handle_change_totol"
                        title="Total">T</span>
                </div>
                <div class="select"
                    v-if="values.isSelect!=2">
                    <span :class="{active:values.isSelect==1}"
                        @click="handle_change_select"
                        title="Select">S</span>
                </div>
                <div class="sort-field">
                    <span class="iconfont mas-arrow-left-end"
                        title="First"
                        @click="handle_first"></span>
                    <span class="iconfont mas-arrow-left"
                        title="Prev"
                        @click="handle_prev"></span>
                    <span class="iconfont mas-arrow-right"
                        title="Next"
                        @click="handle_next"></span>
                    <span class="iconfont mas-arrow-right-end"
                        title="Last"
                        @click="handle_last"></span>
                </div>
                <div class="delete"
                    @click="handle_delete_field"
                    title="Delete">
                    <i class="el-icon-delete"></i>
                </div>
            </div>
        </div>

        <el-dialog title="Please select subordinate fields"
            class="report-field__add-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true"
            v-if="addDialogVisible"
            :visible.sync="addDialogVisible"
            width="800px"
            @close="handle_dialog_close">

            <el-transfer v-model="dialogValue"
                :filterable="true"
                filter-placeholder="Enter Keywords"
                :filter-method="handle_transfer_filter"
                :titles="['Source', 'Target']"
                :props="{
                  key: 'id',
                  label: 'name',
                  disabled:'disabled'
                }"
                :data="fieldsOptions">
                <template v-slot="{option}">
                    <div v-hover
                        class="text">
                        <span>{{option.name}}</span>
                    </div>
                </template>
            </el-transfer>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button size="mini"
                        @click="handle_dialog_close">Cancel</el-button>
                    <el-button size="mini"
                        type="primary"
                        @click="handle_dialog_submit">Save</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import VirtualList from "vue-virtual-scroll-list";
import fetch from "@/services/fetch";
export default {
  name: "Report-Field",
  components: { VirtualList },

  props: {
    values: {
      type: [Object, Array]
      //   require: true
    },
    dataSource: {
      type: [String, Number]
      //   require: true
    },
    cycle: {
      type: Object
    }
  },

  data() {
    return {
      addDialogVisible: false,
      dialogValue: [],

      fieldsOptions: [],
      fieldsOptionsClone: [],
      isEditName: false
    };
  },
  computed: {},

  methods: {
    ...mapActions("reportCenter", ["fetch_custome_report_subordinate_field_list"]),

    handle_click_name() {
      this.isEditName = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();  //由于input在v-if true时并不会马上获取焦点。
      });
    },

    handle_change_name() {
      this.isEditName = false;
    },

    handle_add(field_id) {
      this.addDialogVisible = true;

      this.dialogValue = this.values.list.map(item => {
        return item.id;
      });

      let cycle = { start: this.cycle.start, end: this.cycle.end == "" ? "Today" : this.cycle.end };
      this.fetch_custome_report_subordinate_field_list({ id: field_id, type: this.dataSource, cycle: cycle })
        .then(res => {
          this.fieldsOptionsClone = res;

          this.fieldsOptions = this.fieldsOptionsClone.map(item => {
            let result = this.values.list.filter(i => {
              return i.id == item.id;
            });
            if (result.length == 0) {
              return { ...item, disabled: false };
            } else {
              return { ...item, disabled: true };
            }
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handle_dialog_close() {
      this.addDialogVisible = false;
    },

    handle_dialog_submit() {
      //新增的list
      let add_list = this.fieldsOptions
        .filter(item => {
          let has = this.dialogValue.find(i => {
            return i == item.id;
          });

          if (has) {
            return true;
          } else {
            return false;
          }
        })
        .map(item => {
          return { id: item.id, name: item.name };
        });

      //和原来的list合并去重  排序
      this.values.list = _.uniqBy(_.concat(this.values.list, add_list), "id");
      // if (this.values.sort == "asc") {
      //   this.values.list.sort(function(a, b) {
      //     return b.name <= a.name ? 1 : -1;
      //   });
      // } else {
      //   this.values.list.sort(function(a, b) {
      //     return b.name >= a.name ? 1 : -1;
      //   });
      // }

      this.addDialogVisible = false;
    },

    handle_change_totol() {
      this.values.isTotal = this.values.isTotal == 1 ? 0 : 1;
    },

    handle_change_select() {
      this.$emit("toggleSelect", this.values.id);
    },

    handle_first() {
      this.$emit("first", this.values.id);
    },
    handle_prev() {
      this.$emit("prev", this.values.id);
    },
    handle_next() {
      this.$emit("next", this.values.id);
    },
    handle_last() {
      this.$emit("last", this.values.id);
    },

    handle_subordinate_delete(id) {
      this.values.list = this.values.list.filter(item => {
        return item.id != id;
      });
    },

    handle_delete_field() {
      this.$emit("delete", this.values.id);
    },

    handle_transfer_filter(query, item) {
      let name = item.name.toUpperCase();
      let keyword = query.toUpperCase();
      return name.indexOf(keyword) > -1;
    }
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
.report-field {
  display: inline-block;
  height: 100%;
  width: 190px;
  margin-right: 5px;
  background-color: white;
  border: 1px solid #e0e0e0;

  .field-wrap {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    ::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }

    .title {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 30px;
      background-color: #3895c5;
      color: white;
      padding: 0 10px;
      line-height: 30px;

      .text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .sort-list-name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        i {
          height: 12px;
          line-height: 12px;
          cursor: pointer;

          &.active {
            color: #acacac;
          }
        }
      }
    }

    .list {
      box-sizing: border-box;
      flex: 1;
      overflow: auto;

      .list-item {
        box-sizing: border-box;
        height: 30px;
        border-bottom: 1px solid #e0e0e0;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name {
          width: 85%;
          color: #4a4a4a;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        i {
          color: red;
          cursor: pointer;
          font-size: 12px;
        }
      }

      .no-data {
        position: relative;
        height: 100%;

        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: gray;
        }
      }
    }

    .add {
      box-sizing: border-box;
      height: 30px;
      line-height: 30px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      cursor: pointer;

      i {
        font-size: 20px;
        color: #3895c5;
      }
    }

    .add-disabled {
      box-sizing: border-box;
      height: 30px;
      line-height: 30px;
      border-top: 1px solid #e0e0e0;
      text-align: center;

      i {
        font-size: 20px;
        color: #d4d4d4;
      }
    }
    .operate {
      display: flex;
      align-items: center;
      align-items: center;
      box-sizing: border-box;
      height: 30px;
      border-top: 1px solid #e0e0e0;
      padding: 0 10px;

      .total,
      .select {
        display: inline-flex;
        align-items: center;
        height: 100%;
        margin-right: 5px;
        cursor: pointer;

        span {
          display: inline-block;
          width: 20px;
          border-radius: 50%;
          background-color: #858585;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          font-weight: bolder;
          color: white;

          &.active {
            background-color: #0c569d;
          }
        }
      }
      .sort-field {
        flex: 1;
        justify-content: space-around;
        display: inline-flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
      }
      .delete {
        display: inline-flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
        i {
          font-size: 20px;
        }
      }
    }
  }
}

.list-move {
  transition: all 0.5s;
}
</style>

<style lang="scss">
.report-field__add-dialog {
  ::v-deep .el-dialog__body {
    .el-transfer {
      .el-transfer-panel {
        width: 330px;

        .el-transfer-panel__item {
          box-sizing: border-box;
          width: 100%;
          margin: 0;

          .text {
            font-size: 14px;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>