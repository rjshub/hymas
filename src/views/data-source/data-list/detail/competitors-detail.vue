<template>
    <div class="competitors-detail">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <div class="info-area">
                <div class="title">ELC&amp;competitors Spending </div>
                <div class="info">
                    <span>Year: {{info.year}}</span>
                    <span class="divide">|</span>
                    <span>Name: {{info.name}}</span>
                    <span class="divide">|</span>
                    <span>Updated on: {{info.updateTime}}</span>
                </div>
                <div class="download">
                    <el-button size="mini"
                        @click="handle_download"
                        title="Download"
                        class="iconfont mas-download"></el-button>
                </div>
            </div>
            <div class="table-wrap">
                <el-table :data="tableData"
                    height="100px"
                    stripe
                    style="min-height:100%;width: 100%"
                    header-row-class-name="blue">
                    <el-table-column min-width="80"
                        align="center"
                        prop="id">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>条目编号</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.id}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="group">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>品牌集团</span>
                                <span>Group</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.group}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="brand">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>客户</span>
                                <span>Brand</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.brand}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="product_line">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>产品线</span>
                                <span>Product Line</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.product_line}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="250"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="product">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>具体产品</span>
                                <span>Product</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.product}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="category">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>产品大类别</span>
                                <span>Category</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.category}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="sub_category">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>产品小类别</span>
                                <span>Sub-Category</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                {{scope.row.sub_category}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="100"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>自然年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="fiscal_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>财年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_begin_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign开始自然年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_begin_month">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign开始月</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_start">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign开始日</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_end_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign结束自然年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_end_month">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign结束月</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_end">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign结束日</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="month">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>月</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_category">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Media Category</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_type">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Media Type</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Media</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="city">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>City</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="200"
                        :show-overflow-tooltip="true"
                        align="right"
                        prop="total_cost">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Total Cost</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.total_cost_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.total_cost)"
                                    placement="top-start">
                                    <div>{{ scope.row.total_cost }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.total_cost}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-area">
                <el-pagination background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizesArr"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import breadCrumb from "@/components/common/bread-crumb";

export default {
  name: "Competitors-Detail",
  components: { breadCrumb },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [
        { path: "/data-source/data-list", name: "Data Source" },
        { path: "/data-source/data-list", name: "Data List" },
        { path: "", name: "ELC&competitors Spending" }
      ],

      info: {
        name: "",
        year: "",
        updateTime: ""
      },

      currentPage: 1,
      pageSizesArr: [20, 50, 100],
      pageSize: 20,
      total: 0,

      tableData: []
    };
  },
  computed: {},

  methods: {
    ...mapActions("dataSource/dataList", ["fetch_competitors_detail", "fetch_elc_download"]),

    get_table_list() {
      let param = {
        id: this.$route.query.id,
        perpage: this.pageSize,
        page: this.currentPage
      };
      this.isLoading = true;
      this.fetch_competitors_detail(param)
        .then(res => {
          this.isLoading = false;
          let data = res.data;
          this.tableData = data.list;

          this.info.year = data.year;
          this.info.name = data.name;
          this.info.updateTime = data.updated_at;

          this.total = Number(data.total);
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message);
        });
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

    handle_download() {
      this.fetch_elc_download({ type: "2", id: [this.$route.query.id] })
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    getShowDisplayText(value) {
      return String(value);
    }
  },

  mounted() {
    this.get_table_list();
  }
};
</script>
<style lang="scss" scoped>
.competitors-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    .info-area {
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      height: 150px;
      background-color: white;

      .title {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        color: #333333;
      }

      .info {
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: #909399;
      }

      .divide {
        display: inline-block;
        width: 20px;
        text-align: center;
      }
    }
    .table-wrap {
      flex: 1;
      display: flex;
      contain: strict;

      // 滚动条大小
      ::v-deep ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::v-deep .el-table {
        td,
        th {
          padding: 5px 0 5px 0;
        }
      }

      .header-title {
        text-align: center;
        vertical-align: middle;
        padding-left: 0 !important;
        padding-right: 0 !important;
        span {
          display: block;
          line-height: 1;
        }
      }
    }

    .pagination-area {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 40px;
      background-color: white;
    }
  }
}
</style>