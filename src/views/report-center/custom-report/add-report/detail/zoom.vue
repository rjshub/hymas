

<template>
    <el-dialog title="Detail"
        class="preview-zoom"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="true"
        width="450px"
        @close="handle_close">
        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="table-wrap">
            <el-table v-if="tableData && tableData.length>0"
                :data="tableData"
                height="100px"
                stripe
                :summary-method="getSummaries"
                show-summary
                header-row-class-name="blue"
                style="min-height:100%;width: 100%"
                :default-sort="getDefaultSort"
                @sort-change="handleSortChange">
                <el-table-column label="Id"
                    width="100"
                    prop="id"
                    sortable="custom"
                    align="center">
                </el-table-column>

                <el-table-column v-for="(item) in rowProps"
                    :show-overflow-tooltip="true"
                    :label="item.name"
                    min-width="280"
                    :key="item.prop"
                    :prop="item.prop"
                    sortable="custom"
                    align="center">
                    <template v-slot="scope">
                        <div>
                            {{getColumnValue(scope.row, scope.column)}}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-else
                class="table-empty">
                No Data
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Competitor-Zoom-In",
  components: {},
  props: {
    tableData: {
      type: [Object, Array],
      required: true
    },
    rowProps: {
      type: [Object, Array],
      required: false
    },
    summaryData: {
      type: [Object, Array],
      required: true,
      default: () => {
        [];
      }
    },
    defaultSort: {
      type: [Object],
      required: false
    },
    isLoading: {
      type: Boolean
    }
  },
  data() {
    return {};
  },

  computed: {
    getDefaultSort() {
      let order = this.defaultSort.order == "asc" ? "ascending" : "descending";
      return { prop: this.defaultSort.column, order };
    }
  },

  methods: {
    handle_close() {
      this.$emit("close");
    },

    getColumnValue(row, column) {
      let result = row.row.find(item => {
        return item.prop == column.property;
      });
      return this.formartValue(result);
    },

    formartValue(data) {
      if (data.value === null || data.value === "" || data.value === false || data.value === undefined) {
        return "";
      } else if (data.value == "-") {
        return "-";
      } else {
        if (data.isInteget) {
          //为整形
          return this.$formatMoney(data.value, 0, "") + "";
        } else if (data.isFloat) {
          //为小数
          return this.$formatMoney(data.value, 2, "") + "";
        } else if (data.isPercent) {
          //为百分比
          return this.$formatMoney(data.value, 2, "") + "%";
        } else {
          //为字符串
          return data.value;
        }
      }
    },

    getSummaries(param) {
      let summaryData = this.summaryData;

      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        let data = summaryData.find(item => {
          return item.prop == column.property;
        });

        sums[index] = this.formartValue(data);
      });

      return sums;
    },

    handleSortChange({ prop, order }) {
      this.$emit("sort", { prop, order });
    }
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
.preview-zoom {
  overflow: visible;
  /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin-top: 2vh !important;
    width: 97vw !important;
    height: 96vh !important;

    .el-dialog__body {
      flex: 1;
      display: flex;
      padding: 0;
      overflow: auto;

      .table-wrap {
        flex: 1;
        contain: strict;

        .table-header-class {
          background-color: #3895c5 !important;
        }

        .el-table {
          td,
          th {
            padding: 5px 0 5px 0;
            &.gutter {
              border-bottom: 1px solid #ebeef5;
            }
          }

          td {
            padding: 0;
            .cell {
              padding: 0;

              div,
              span {
                padding: 2px;
              }

              .summary {
                background-color: #3895c5;
                color: white;
                div,
                span {
                  color: inherit !important;
                }
              }
            }
          }

          .el-table__footer {
            td {
              background-color: #2aa8e9;
              color: white;
            }
          }
        }

        .table-empty {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #adadad;
          border: 1px solid #e1e1e1;
          box-sizing: border-box;
        }
      }
    }
    .el-dialog__footer {
      display: none;
    }
  }
}
</style>