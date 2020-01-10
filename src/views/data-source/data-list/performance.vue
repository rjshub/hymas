<template>
    <div id="performance">
        <div class="filter">
            <div style="line-height: 2.5;">

                <hy-box>
                    <el-button type="primary"
                        plain
                        size="mini"
                        title="Download the templates"
                        icon="iconfont mas-download"
                        @click="handle_download_template"> Format</el-button>
                </hy-box>

                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="brand"
                        filterable
                        placeholder="Select Brand"
                        @change="handle_brand_change">
                        <el-option label="All Brands"
                            value="">
                        </el-option>
                        <el-option v-for="item in brandOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </hy-box>

                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="product"
                        filterable
                        placeholder="Select Product"
                        @change="handle_product_change">
                        <el-option label="All Products"
                            value="">
                        </el-option>
                        <el-option v-for="item in productOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </hy-box>

                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="campaigns"
                        filterable
                        placeholder="Select Campaigns"
                        @change="handle_campaign_change">
                        <el-option label="All Campaigns"
                            value="">
                        </el-option>
                        <el-option v-for="(item,index) in campaignOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </hy-box>

                <hy-box>
                    <el-select size="mini"
                        style="width:120px;"
                        v-model="status"
                        filterable
                        placeholder="Select Status"
                        @change="handle_status_change">
                        <el-option label="Importing"
                            value="1">
                        </el-option>
                        <el-option label="Success"
                            value="2">
                        </el-option>
                        <el-option label="Failure"
                            value="3">
                        </el-option>
                    </el-select>
                </hy-box>

            </div>
            <div>
                <hy-box>
                    <el-date-picker size="mini"
                        style="width:220px"
                        v-model="date"
                        type="daterange"
                        unlink-panels
                        range-separator="-"
                        value-format="yyyy-MM-dd"
                        start-placeholder="Start Date"
                        end-placeholder="End Date"
                        @change="handle_date_change">
                    </el-date-picker>
                </hy-box>

                <hy-box>
                    <el-input size="mini"
                        style="width:250px"
                        placeholder="Please enter keywords"
                        @keyup.enter.native="handle_keywords_change"
                        v-model="keywords">
                        <template v-slot:append>
                            <el-button icon="el-icon-search"
                                @click="handle_keywords_change"></el-button>
                        </template>
                    </el-input>
                </hy-box>
            </div>

        </div>
        <div class="table-wrap"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <el-table :data="tableData"
                height="100px"
                stripe
                @selection-change="handle_section_change"
                style="min-height:100%;width: 100%">
                <el-table-column type="selection"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column label="ID"
                    align="center"
                    type="index"
                    width="50">
                </el-table-column>
                <el-table-column prop="source_data"
                    :show-overflow-tooltip="true"
                    align="center"
                    label="Source Data">
                </el-table-column>
                <el-table-column prop="campaign"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="Campaign">
                </el-table-column>
                <el-table-column prop="upload_time"
                    width="160"
                    align="center"
                    label="Upload Time">
                </el-table-column>
                <el-table-column prop="update_time"
                    width="160"
                    align="center"
                    label="Update Time">
                </el-table-column>
                <el-table-column prop="status"
                    width="90"
                    align="center"
                    label="Status">
                    <template v-slot="scope">
                        <el-tag :type="formatStatus(scope.row.status).type"
                            size="mini">
                            {{formatStatus(scope.row.status).text}}
                        </el-tag>
                    </template>
                </el-table-column>
              
                <el-table-column label="Operating"
                    align="center"
                    width="250">
                    <template v-slot="scope">
                        <div class="operate">
                            <hy-box>
                                <el-button type="text"
                                    @click="handle_detail(scope.row.id)">
                                    <i class="el-icon-document"
                                        title="Detail"></i>
                                </el-button>
                            </hy-box>

                            <hy-box>
                                <el-button type="text"
                                    @click="handle_download_batch(scope.row.id,'single')">
                                    <i class="iconfont mas-download"
                                        title="Download"></i>
                                </el-button>
                            </hy-box>

                            <el-upload class="upload-demo"
                                ref="upload"
                                :disabled="scope.row.permission==2 || isReadOnly"
                                action="/source/performance_upload"
                                :data="{client_id:client}"
                                :show-file-list="false"
                                :before-upload="handleBeforeUpload"
                                :on-success="handleSuccess"
                                :on-error="handleError"
                                :http-request="$uploadHttpRequest">
                                <template v-slot:trigger>
                                    <el-button type="text"
                                        :disabled="scope.row.permission==2 || isReadOnly">
                                        <i class="iconfont mas-upload"
                                            title="re-upload"></i>
                                    </el-button>
                                </template>
                            </el-upload>

                            <hy-box>
                                <el-button type="text"
                                    :disabled="scope.row.permission==2 || isReadOnly"
                                    @click="handle_delete(scope.row.id, 'single')">
                                    <i class="el-icon-delete"
                                        title="Delete"></i>
                                </el-button>
                            </hy-box>

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
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Performance",
  components: {},

  props: {
    client: {
      type: String
    }
  },

  data() {
    return {
      isLoading: false,
      currentPage: 1,
      pageSizesArr: [20, 50, 100],
      pageSize: 20,
      total: 0,

      brand: "",
      product: "",
      campaigns: "",
      date: [],
      status: "",
      keywords: "",

      brandOptions: [],
      productOptions: [],
      campaignOptions: [],

      tableData: [],

      checkedRows: []
    };
  },
  computed: {
    ...mapGetters("dataSource/dataList", ["permissionPerformance"]),

    isReadOnly() {
      if (this.permissionPerformance) {
        return this.permissionPerformance.isRead || false;
      } else {
        return false;
      }
    }
  },

  watch: {
    client() {
      this.fetch_table_list();
    }
  },

  methods: {
    ...mapActions("dataSource/dataList", [
      "fetch_performance_list",
      "fetch_elc_download",
      "fetch_elc_delete",
      "fetch_elc_template_download",
      "fetch_filter_list",
      "fetch_save_source_data"
    ]),

    /**下载模板 */
    handle_download_template() {
      this.fetch_elc_template_download()
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetch_table_list();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetch_table_list();
    },

    async fetch_brand_product_campaign_list(data) {
      let result = [];
      try {
        result = await this.fetch_filter_list(data);
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
      return result;
    },

    async fetch_table_list() {
      try {
        let params = {
          client_id: this.client,
          brand_id: this.brand,
          product_id: this.product,
          campaign: this.campaigns,
          status: this.status,
          start: this.date && this.date.length > 0 ? this.date[0] : "",
          end: this.date && this.date.length > 0 ? this.date[1] : "",
          source_data: this.keywords,
          perpage: this.pageSize,
          page: this.currentPage
        };
        this.isLoading = true;
        let res = await this.fetch_performance_list(params);
        this.tableData = res.list;
        this.total = Number(res.total);

        this.isLoading = false;
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    handle_detail(id) {
      this.$router.push({
        path: "data-list/performance-detail",
        query: { id: id }
      });
    },

    handle_download_batch(id, type) {
      let ids = [];
      if (type == "single") {
        ids = [id];
      } else if (type == "batch") {
        ids = this.checkedRows;
      }
      this.fetch_elc_download({ type: "1", id: ids })
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handle_delete(id, type) {
      let ids = [];
      if (type == "single") {
        ids = [id];
      } else if (type == "batch") {
        ids = this.checkedRows;
      }

      this.$confirm("Are you sure to delete this data source? Deleting it will affect the display content of the web interface.", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.fetch_elc_delete({ type: "1", id: ids })
              .then(res => {
                this.$message.success("Deleted successfully");
                this.fetch_table_list();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        }
      });
    },

    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (file.type != "application/vnd.ms-excel" && file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          this.$message.warning({
            message: "The uploaded file must be in xls format."
          });
          reject();
        } else {
          resolve();
        }
      });
    },

    handleSuccess(response, file, fileList) {
      let isCovered = false;
      if (response.isexist != null || response.isexist != undefined) {
        if (response.isexist == 1) {
          this.$confirm("Duplicate data be found. Do you want it to be covered?", "Tips", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            closeOnClickModal: false,
            type: "warning",
            callback: action => {
              if (action == "confirm") {
                isCovered = true;
                this.handle_save(response, isCovered);
              }
              if (action == "cancel") {
                isCovered = false;
              }
            }
          });
        }
      } else {
        this.isCovered = true;
        this.handle_save(response, isCovered);
      }
    },
    handleError(err, file, fileList) {
      this.$message.error(err.message);
    },

    handle_section_change(val) {
      this.checkedRows = val.map(item => item.id);
      this.$emit("section-change", this.checkedRows);
    },

    handle_brand_change() {
      this.currentPage = 1;

      this.fetch_brand_product_campaign_list({ type: "brand", id: this.brand })
        .then(res => {
          this.productOptions = res.data;
        })
        .catch(err => {
          this.$message.error(err.message);
        });

      this.product = "";
      this.campaigns = "";
      this.campaignOptions = [];

      this.fetch_table_list();
    },
    handle_product_change() {
      this.currentPage = 1;

      this.fetch_brand_product_campaign_list({ type: "product", id: this.product })
        .then(res => {
          this.campaignOptions = res.data;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
      this.campaigns = "";

      this.fetch_table_list();
    },
    handle_campaign_change() {
      this.currentPage = 1;

      this.fetch_table_list();
    },

    handle_status_change() {
      this.currentPage = 1;

      this.fetch_table_list();
    },

    handle_date_change() {
      this.currentPage = 1;

      this.fetch_table_list();
    },

    handle_keywords_change() {
      this.currentPage = 1;

      this.fetch_table_list();
    },

    handle_save(response, isCovered) {
      this.fetch_save_source_data({
        url: "/source/performance_save",
        params: { ...response, isCovered, brand_id: response.brand, product_id: response.product, client_id: this.client }
      })
        .then(res => {
          this.$message.success("Uploaded successfully");
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    formatStatus(status) {
      let result = {};
      switch (status) {
        case "1":
          result = {
            type: "warning",
            text: "Importing"
          };
          break;
        case "2":
          result = {
            type: "success",
            text: "Success"
          };
          break;
        case "3":
          result = {
            type: "error",
            text: "Failure"
          };
          break;
        default:
          result = {
            type: "info",
            text: "--"
          };
      }
      return result;
    }
  },

  async mounted() {
    this.isLoading = true;
    let res = await this.fetch_brand_product_campaign_list({ type: "" });
    this.brandOptions = res.data;
    await this.fetch_table_list();
  }
};
</script>

<style lang="scss">
#performance {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filter {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 5px;
    align-items: baseline;
  }
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
    }

    .operate {
      display: flex;
      line-height: 17px;
      justify-content: center;

      i {
        display: inline-block;
        width: 30px;
        font-size: 16px;
      }
    }

    .el-select {
      border: unset;
      width: 70px;
      .el-input {
        // border: unset;
        .el-input__inner {
          border: 0 !important;
          background-color: unset;
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
</style>
