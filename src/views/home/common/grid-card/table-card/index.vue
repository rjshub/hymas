<template>
    <div class="collect"
        @click.stop="handle_click">
        <div class="title">Table</div>
        <div class="cards-grid">
            <div class="table-wrap">
                <el-table v-if="tableData && tableData.length>0"
                    :data="tableData"
                    height="100px"
                    border
                    style="min-height:100%;width: 100%">

                    <template v-for="(item,index) in columnProps">
                        <el-table-column :key="index"
                            :label="item.name"
                            :show-overflow-tooltip="true"
                            min-width="200"
                            align="center"
                            :prop="item.name">
                            <template v-slot="scope">
                                <div>
                                    {{getColumnValue(scope.row, scope.column)}}
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

                <div v-else
                    class='no-data'>No Data</div>
            </div>

            <div class="pagination-area">
                <el-pagination background
                    :current-page="currentPage"
                    :page-sizes="pageSizesArr"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange">
                </el-pagination>
            </div>

        </div>

        <div v-if="status!='view'"
            class="close-btn"
            @click.stop="handle_click_close">
            <i class="el-icon-delete-solid"></i>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import uuidv4 from "uuid/v4";

export default {
  name: "TableCard",
  components: {},

  props: {
    value: {
      type: [Object, Array],
      required: true
    },
    status: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      tableData: [],
      columnProps: [],

      currentPage: 1,
      pageSizesArr: [20, 50, 100],
      pageSize: 20,
      total: 0
    };
  },

  computed: {
    toolData() {
      return this.value.toolData;
    }
  },

  watch: {
    toolData: {
      handler: function(val) {
        this.init();
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("home", ["fetch_card_data"]),

    async init() {
      //根据选择的列名，从后端获取数据
      this.tableData = await this.get_card_data();

      if (this.tableData && this.tableData.length > 0) {
        this.columnProps = this.tableData[0].row;
      } else {
        this.columnProps = [];
      }

      this.total = Number("50");
    },

    //获取数据
    async get_card_data() {
      let toolData = this.value.toolData;
      let params = { type: toolData.chartType, data_source: toolData.dataSource, value: toolData.chartValue };

      let result = [
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        },
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        },
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        },
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        },
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        },
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        },
        {
          row: [
            { name: "id", value: "21321" },
            { name: "source_data", value: "【HS-201907069】测试数据_4" },
            { name: "campaign", value: "La Mer FY20 TL Campaign program buy" },
            { name: "permission", value: 0 },
            { name: "path_object", value: 16 },
            { name: "path", value: "http://171.84.4.202/download/upload/20191218/【HS-201907069】测试数据_4.xlsx" },
            { name: "upload_time", value: "2019-12-18 16:27:59" },
            { name: "update_time", value: "2019-12-18 16:28:00" }
          ]
        }
      ];

      // let result = await this.fetch_card_data(params);
      return result;
    },

    handle_click() {
      this.$emit("select", this.value);
    },

    handle_click_close() {
      this.$emit("delete", this.value);
    },

    getColumnValue(row, column) {
      debugger;
      let result = row.row.find(item => {
        debugger;
        return item.name == column.property;
      });

      debugger;
      //   return this.formartValue(result);
      return result.value;
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

    handleSizeChange() {},
    handleCurrentChange() {}
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.collect {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }

  .title {
    height: 30px;
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }

  .cards-grid {
    display: flex;
    flex: 1;
    flex-direction: column;
    // overflow: auto;

    .table-wrap {
      flex: 1;
      contain: strict;

      //滚动条大小
      /deep/ ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      /deep/ .el-table {
        td,
        th {
          padding: 0;
        }

        td {
          padding: 0;
          .cell {
            padding: 5px;
          }
        }

        .el-tooltip {
          div {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }

    .pagination-area {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 40px;
    }
  }

  .no-data {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #adadad;
    border: 1px solid #e1e1e1;
    box-sizing: border-box;
  }

  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer !important;
    }

    i {
      font-size: 20px;
      color: gray;
    }
  }
}
</style> 