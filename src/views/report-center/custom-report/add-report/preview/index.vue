<template>
    <div class="template-preview">
        <div class="info">
            <div v-hover
                class="name">
                <span>{{name}}</span>
            </div>
            <div>
                <span class="cycle"
                    style="margin-right: 30px;">Client: {{client}}</span>
                <span class="cycle">Cycle: {{cycle.join("~")}}</span>
            </div>
        </div>
        <div class="table-panel">
            <div class="title">
                Detail
            </div>
            <div class="filter">
                <el-row style="width: 100%;">
                    <el-col :span="20"
                        style="line-height:2;">
                        <hy-box>
                            <el-date-picker size="mini"
                                style="width:220px"
                                v-model="filter.date"
                                type="daterange"
                                unlink-panels
                                :clearable="false"
                                value-format="yyyy-MM-dd"
                                range-separator="-"
                                start-placeholder="Start Date"
                                end-placeholder="End Date"
                                @change="handle_change_date">
                            </el-date-picker>
                        </hy-box>
                    </el-col>
                    <el-col :span="4"
                        style="text-align: right;">
                        <checkbox-dropdown :items="allColumns"
                            :values="filter.selectedColumns"
                            @change="handle_change_dropdown"></checkbox-dropdown>

                        <hy-box>
                            <el-button size="mini"
                                icon="iconfont mas-zoom-in"
                                title="Full screen view"
                                @click="handle_zoom"></el-button>
                        </hy-box>

                        <hy-box>
                            <el-button size="mini"
                                icon="iconfont mas-download"
                                title="Download"
                                @click="handle_download"></el-button>
                        </hy-box>

                    </el-col>
                </el-row>
                <el-row style="width: 100%;">
                    <el-col :span="24"
                        style="line-height:2;">
                        <hy-box :gap="false">
                            <hy-box v-for="(item) in allFilters"
                                :key="item.key">
                                <!-- group -->
                                <template v-if="item.key.toUpperCase()=='GROUP'">
                                    <el-select size="mini"
                                        style="width:160px;"
                                        v-model="filter.selects[item.key]"
                                        filterable
                                        clearable
                                        multiple
                                        collapse-tags
                                        :placeholder="getPlaceholder(item.name)"
                                        @change="handle_change_group(item.key)">
                                        <el-option v-for="jtem in groupOptions"
                                            :key="jtem.id"
                                            :label="jtem.name"
                                            :value="jtem.id">
                                        </el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="item.key.toUpperCase()=='BRAND'">
                                    <el-select size="mini"
                                        style="width:160px;"
                                        v-model="filter.selects[item.key]"
                                        filterable
                                        clearable
                                        multiple
                                        collapse-tags
                                        :placeholder="getPlaceholder(item.name)"
                                        @change="handle_change_brand(item.key)">
                                        <el-option v-for="jtem in brandOptions"
                                            :key="jtem.id"
                                            :label="jtem.name"
                                            :value="jtem.id">
                                        </el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="item.key.toUpperCase()=='PRODUCT'">
                                    <el-select size="mini"
                                        style="width:160px;"
                                        v-model="filter.selects[item.key]"
                                        filterable
                                        clearable
                                        multiple
                                        collapse-tags
                                        :placeholder="getPlaceholder(item.name)"
                                        @change="handle_change_product(item.key)">
                                        <el-option v-for="jtem in productOptions"
                                            :key="jtem.id"
                                            :label="jtem.name"
                                            :value="jtem.id">
                                        </el-option>
                                    </el-select>
                                </template>

                                <template v-else>
                                    <el-select size="mini"
                                        style="width:160px;"
                                        v-model="filter.selects[item.key]"
                                        filterable
                                        clearable
                                        multiple
                                        collapse-tags
                                        :placeholder="getPlaceholder(item.name)"
                                        @change="handle_change_select(item.key)">
                                        <el-option v-for="jtem in getOptions(item.value)"
                                            :key="jtem.id"
                                            :label="jtem.name"
                                            :value="jtem.id">
                                        </el-option>
                                    </el-select>
                                </template>
                            </hy-box>
                        </hy-box>
                    </el-col>
                </el-row>
            </div>
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

                    <template v-for="(item) in rowProps">
                        <el-table-column :key="item.prop"
                            :show-overflow-tooltip="true"
                            :label="item.name"
                            :prop="item.prop"
                            sortable="custom"
                            min-width="250"
                            align="center">
                            <template v-slot="scope">
                                <div>
                                    {{getColumnValue(scope.row, scope.column)}}
                                </div>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

                <div v-else
                    class="no-data">No Data</div>

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

        <transition mode="out-in"
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut">
            <zoom-in v-if="isShowZoomIn"
                :is-loading="isLoading"
                :table-data="tableData"
                :row-props="rowProps"
                :summary-data="summaryData"
                :default-sort="currentSort"
                @close="isShowZoomIn=false"
                @sort="handleSortChange"></zoom-in>
        </transition>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import checkboxDropdown from "@/components/common/checkbox-dropdown";
import zoomIn from "./zoom";

export default {
  name: "TemplatePreview",
  components: { checkboxDropdown, zoomIn },
  props: {
    values: {
      type: [Object, Array]
    }
  },

  data() {
    return {
      currentPage: 1,
      pageSizesArr: [20, 50, 100],
      pageSize: 20,
      total: 0,

      name: "",
      isLoading: false,
      cycle: [], //周期
      client: "", //客户名

      isShowZoomIn: false,
      filter: {
        date: [],
        selects: {},

        selectedColumns: []
      },

      //旧的sort
      oldSort: {
        order: "asc",
        column: "id"
      },
      currentSort: {
        order: "asc",
        column: "id"
      },

      allFilters: {},

      //这三个要联动 start
      prevGroup: "",
      groupOptions: [],
      brandOptions: [],
      productOptions: [],
      // end

      allColumns: [],

      tableData: [],
      rowProps: [],
      summaryData: []
    };
  },
  computed: {
    getDefaultSort() {
      let order = this.currentSort.order == "asc" ? "ascending" : "descending";
      return { prop: this.currentSort.column, order };
    }
  },

  methods: {
    ...mapActions("reportCenter", [
      "fetch_custome_report_preview_filter",
      "fetch_custome_report_preview_table",
      "fetch_custome_report_preview_download",
      "fetch_product_by_brand",
      "fetch_brand_by_group"
    ]),

    ...mapActions("home", ["fetch_filter_list"]),

    async init() {
      try {
        this.isLoading = true;

        this.setNameAndCycle();

        this.get_client_name();
        await this.get_filter_select_data();
        await this.get_table_list();

        //默认选中所有的列
        this.filter.selectedColumns = this.allColumns.map(item => item.prop);

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    setNameAndCycle() {
      //设置名字和cycle

      this.name = "Preview";

      let begin = this.values.start_date;
      let end = this.values.end_date == "Today" ? moment().format("YYYY-MM-DD") : this.values.end_date;

      this.filter.date = [begin, end];
      this.cycle = [begin, this.values.end_date];
    },

    handle_change_date() {
      this.currentPage = 1;
      this.get_table_list();
    },

    handle_change_group(key) {
      this.currentPage = 1;

      //清空brand和 product选项
      this.filter.selects["brand"] = [];

      let value = this.filter.selects[key] ? this.filter.selects[key] : [];
      this.fetch_brand_by_group({ ...this.getStep1Params(), client: value }).then(res => {
        this.brandOptions = res.map(item => {
          return { id: item.name, name: item.name };
        });
      });

      if (this.filter.selects["group"] == "ELC") {
        //即 group 为ELC时,产品要联动
        this.filter.selects["product"] = [];
        this.get_product_by_brand("");
      } else {
        if (this.prevGroup == "ELC") {
          this.filter.selects["product"] = [];
        }
        this.get_product_by_brand("");
      }

      this.prevGroup = this.filter.selects[key];
      this.get_table_list();
    },

    handle_change_brand(key) {
      this.currentPage = 1;

      if (this.filter.selects["group"] == "ELC") {
        //即 group 为ELC时,产品要联动
        this.filter.selects["product"] = [];

        this.get_product_by_brand(this.filter.selects[key]);
      }

      this.get_table_list();
    },

    get_product_by_brand(brand) {
      let params = {
        type: "brand",
        ...this.getStep1Params(),
        // columns: this.allColumns.length != 0 ? this.filter.selectedColumns : "all",
        brand
      };

      this.fetch_product_by_brand(params).then(res => {
        this.productOptions = res.map(item => {
          return { id: item.name, name: item.name };
        });
      });
    },

    handle_change_product(name) {
      this.currentPage = 1;
      this.get_table_list();
    },

    handle_change_select(name) {
      this.currentPage = 1;

      this.get_table_list();
    },

    handle_change_dropdown(value) {
      this.filter.selectedColumns = value;

      this.currentPage = 1;
      this.get_table_list();
    },

    /**获取过滤项 brand数据 */
    async get_filter_select_data() {
      let params = {
        type: "brand",
        ...this.getStep1Params(),
        columns: this.allColumns.length != 0 ? this.filter.selectedColumns : "all"
      };

      this.allFilters = await this.fetch_custome_report_preview_filter(params);

      for (let item of this.allFilters) {
        if (item.key.toUpperCase() == "GROUP") {
          this.groupOptions = item.value.map(item => {
            return { id: item, name: item };
          });
        }
        if (item.key.toUpperCase() == "BRAND") {
          this.brandOptions = item.value.map(item => {
            return { id: item, name: item };
          });
        }
        if (item.key.toUpperCase() == "PRODUCT") {
          this.productOptions = item.value.map(item => {
            return { id: item, name: item };
          });
        }
      }

      for (let item of this.allFilters) {
        this.$set(this.filter.selects, item.key, []);
      }
    },

    async get_table_list() {
      try {
        this.isLoading = true;

        this.tableData = [];

        let params = {
          ...this.filter.selects,
          columns: this.allColumns.length != 0 ? this.filter.selectedColumns : "all",
          ...this.getStep1Params(),
          search_start: this.filter.date[0], //用date控件将step1中的时间覆盖掉。
          search_end: this.filter.date[1], //用date控件将step1中的时间覆盖掉。
          perpage: this.pageSize,
          page: this.currentPage,
          order: this.currentSort.order,
          field: this.currentSort.column
        };
        let res = await this.fetch_custome_report_preview_table(params);

        //设置 获取当前table有哪些列
        if (res.table && res.table.length > 0) {
          this.tableData = res.table;
          this.rowProps = res.table[0].row;
        } else {
          this.tableData = [];
          this.rowProps = [];
        }

        //获取所有列
        this.allColumns = res.allColumns;

        this.summaryData = res.summary || []; //获取汇总行

        this.total = Number(res.total);

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    async get_client_name() {
      try {
        let clientOptions = await this.fetch_filter_list({ type: "client", value: "" });
        let value = this.values.client;
        let result = clientOptions.find(item => item.value == value);
        if (result) {
          this.client = result.label;
        } else {
          this.client = "ELC";
        }
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    handle_zoom() {
      this.isShowZoomIn = true;
    },

    getStep1Params() {
      return {
        client_id: this.$route.query.client,
        dataSourceRadio: this.values.dataSourceRadio,
        start_date: this.values.start_date,
        end_date: this.values.end_date,
        fields: this.values.fields
      };
    },

    handle_download() {
      let params = {
        ...this.filter.selects,
        columns: this.allColumns.length != 0 ? this.filter.selectedColumns : "all",
        ...this.getStep1Params(),
        search_start: this.filter.date[0], //用date控件将step1中的时间覆盖掉。
        search_end: this.filter.date[1], //用date控件将step1中的时间覆盖掉。
        perpage: this.pageSize,
        page: this.currentPage
      };
      this.fetch_custome_report_preview_download(params)
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
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

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.get_table_list();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.get_table_list();
    },

    getPlaceholder(name) {
      return "All " + name;
    },

    getOptions(value) {
      return value.map(item => {
        return { id: item, name: item };
      });
    },

    handleSortChange({ prop, order }) {
      this.currentSort.order = order == "ascending" ? "asc" : "desc";
      this.currentSort.column = prop;
      this.currentPage = 1;

      console.log(" this.currentSort", this.currentSort, this.oldSort, _.isEqual(this.currentSort, this.oldSort));

      if (!_.isEqual(this.currentSort, this.oldSort)) {
        this.oldSort = _.cloneDeep(this.currentSort);
        this.get_table_list();
      }
    }
  },

  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.template-preview {
  display: flex;
  flex-direction: column;
  flex: 1;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 80px;
    background-color: whitesmoke;
    border: 1px solid #e3e3e3;
    margin-bottom: 20px;
    padding: 10px 20px;
    box-sizing: border-box;

    .name {
      font-size: 24px;
      font-weight: bold;
      color: #333333;
      width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .cycle {
      font-size: 14px;
      color: #666666;
      margin-top: 5px;
    }
  }

  .table-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: 1px solid #e3e3e3;

    .title {
      height: 40px;
      background-color: whitesmoke;
      line-height: 40px;
      padding-left: 20px;
    }

    .filter {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      margin-top: 10px;
      margin-bottom: 10px;
      ::v-deep .el-select {
        input::placeholder {
          color: #606266;
        }
      }
    }

    .table-wrap {
      flex: 1;
      contain: strict;

      ::v-deep .table-header-class {
        background-color: #3895c5 !important;
      }

      ::v-deep .el-table {
        td,
        th {
          padding: 2px 0 2px 0;
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
}
</style>