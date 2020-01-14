<template>
  <div id="formatTable">
    <div class="filter">
      <div style="line-height: 2.5;">
        <hy-box>
          <el-button
            type="primary"
            plain
            size="mini"
            icon="iconfont mas-download"
            title="Download the templates"
            @click="handle_download_template"
          >Format</el-button>
        </hy-box>

        <hy-box>
          <el-date-picker
            size="mini"
            style="width:220px"
            v-model="date"
            type="daterange"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            @change="handle_change_date"
          ></el-date-picker>
        </hy-box>

        <hy-box>
          <el-select
            size="mini"
            style="width:120px;"
            v-model="status"
            filterable
            placeholder="Select Status"
            @change="handle_change_status"
          >
            <el-option label="Importing" value="1"></el-option>
            <el-option label="Success" value="2"></el-option>
            <el-option label="Failure" value="3"></el-option>
          </el-select>
        </hy-box>

        <hy-box>
          <el-input
            size="mini"
            style="width:250px"
            placeholder="Please enter keywords"
            @keyup.enter.native="handle_change_keywords"
            v-model="keywords"
          >
            <template v-slot:append>
              <el-button icon="el-icon-search" @click="handle_change_keywords"></el-button>
            </template>
          </el-input>
        </hy-box>
      </div>
    </div>

    <div class="table-wrap" v-loading="isLoading" element-loading-spinner="iconfont mas-loading">
      <el-table
        :data="tableData"
        height="100px"
        stripe
        @selection-change="handle_section_change"
        header-row-class-name="table-header-class"
        style="min-height:100%;width: 100%"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>

        <!-- <el-table-column prop="source_data"
                    align="center"
                    :show-overflow-tooltip="true"
                    label="Source Data">
        </el-table-column>-->

        <el-table-column label="Operating" width="250" align="center">
          <template v-slot="scope">
            <div class="operate">
              <hy-box>
                <el-button type="text" @click="handle_detail(scope.row.id)">
                  <i class="el-icon-document" title="Detail"></i>
                </el-button>
              </hy-box>

              <hy-box>
                <el-button type="text" @click="handle_download_batch(scope.row.id,'single')">
                  <i class="iconfont mas-download" title="Download"></i>
                </el-button>
              </hy-box>

              <el-upload
                class="upload-demo"
                ref="upload"
                :disabled="scope.row.permission==2 || isReadOnly"
                action="/source/competitors_spending_upload"
                :data="{client_id:client}"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
                :http-request="$uploadHttpRequest"
              >
                <template v-slot:trigger>
                  <el-button type="text" :disabled="scope.row.permission==2 || isReadOnly">
                    <i class="iconfont mas-upload" title="re-upload"></i>
                  </el-button>
                </template>
              </el-upload>

              <hy-box>
                <el-button
                  type="text"
                  :disabled="scope.row.permission==2 || isReadOnly"
                  @click="handle_delete(scope.row.id, 'single')"
                >
                  <i class="el-icon-delete" title="Delete"></i>
                </el-button>
              </hy-box>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-area">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizesArr"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "containerName",
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

      date: [],
      status: "",
      keywords: "",

      tableData: [
        {
          id: 1
        }
      ],
      checkedRows: []
    };
  },
  computed: {
    ...mapGetters("dataSource/dataList", ["permissionCompetitorsSpending"]),

    isReadOnly() {
      if (this.permissionCompetitorsSpending) {
        return this.permissionCompetitorsSpending.isRead || false;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions("dataSource/dataList", [
      "fetch_competitors_list",
      "fetch_elc_download",
      "fetch_elc_delete",
      "fetch_elc_template_download",
      "fetch_save_source_data"
    ]),
    handle_download_template() {
      this.fetch_elc_template_download()
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // select 选择器
    handle_change_date() {
      this.currentPage = 1;
      this.fetch_table_list();
    },

    handle_change_status() {
      this.currentPage = 1;
      this.fetch_table_list();
    },

    handle_change_keywords() {
      this.currentPage = 1;
      this.fetch_table_list();
    },
    // tableData
    fetch_table_list() {
      console.log("get list");
    },
    // 表格操作
    handle_section_change(val) {
      this.checkedRows = val.map(item => item.id);
      this.$emit("section-change", this.checkedRows);
    },
    handle_detail(id) {
      console.log("chakan xiangqing");
    },
    handle_download_batch(id, type) {
      console.log("xiazai");
    },
    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (
          file.type != "application/vnd.ms-excel" &&
          file.type !=
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
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
          this.$confirm(
            "Duplicate data be found. Do you want it to be covered?",
            "Tips",
            {
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
            }
          );
        }
      } else {
        this.isCovered = true;
        this.handle_save(response, isCovered);
      }
    },
    handleError(err, file, fileList) {
      this.$message.error(err.message);
    },
    handle_delete(id, type) {
      console.log("shanchu");
    },
    // 分页器
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>

<style lang="scss">
#formatTable {
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

    /deep/ .table-header-class {
      background-color: #f6f6f6 !important;
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
