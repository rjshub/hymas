<template>
    <div class="table-maintain">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <div class="info-area">
                <div class="text">{{info.name}}</div>
                <div class="time">{{info.update_time}}</div>
                <div class="btn">
                    <el-button type="primary"
                        plain
                        size="mini"
                        @click="handle_download">
                        <i class="iconfont mas-download"></i>
                    </el-button>

                    <el-upload style="display: inline-block;"
                        :action="info.upload_url"
                        :show-file-list="false"
                        :before-upload="handleBeforeUpload"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :http-request="$uploadHttpRequest">
                        <el-button size="mini"
                            type="primary"
                            plain
                            class="iconfont mas-upload"></el-button>
                    </el-upload>

                </div>
            </div>
            <div class="table-area">
                <div class="operate">
                    <el-button type="primary"
                        size="mini"
                        @click="handle_add">
                        <i class="el-icon-plus"> Add Data</i>
                    </el-button>
                    <el-button type="primary"
                        :disabled="selections.length==0"
                        plain
                        size="mini"
                        @click="handle_delete">
                        <i class="el-icon-delete"></i>
                    </el-button>

                </div>
                <div class="table-wrap"
                    v-loading="isLoading"
                    element-loading-spinner="iconfont mas-loading">
                    <el-table :data="tableData"
                        height="100px"
                        stripe
                        @selection-change="handle_section_change"
                        header-row-class-name="table-header-class"
                        style="min-height:100%;width: 100%">
                        <el-table-column type="selection"
                            :selectable="isSelectable"
                            align="center"
                            width="50">
                        </el-table-column>
                        <el-table-column prop="id"
                            align="center"
                            width="100"
                            label="媒体编号">
                            <template v-slot="scope">
                                <span v-if="scope.row.operate=='edit'">
                                    <el-input v-model="scope.row.id"
                                        size="mini"></el-input>
                                </span>
                                <span v-else-if="scope.row.operate=='add'">
                                    <el-input v-model="scope.row.id"
                                        size="mini"></el-input>
                                </span>
                                <span v-else>
                                    {{scope.row.id}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code_level_1"
                            align="center"
                            :show-overflow-tooltip="true"
                            label="位置编码一级">
                            <template v-slot="scope">
                                <span v-if="scope.row.operate=='edit'">
                                    <el-input v-model="scope.row.code_level_1"
                                        size="mini"></el-input>
                                </span>
                                <span v-else-if="scope.row.operate=='add'">
                                    <el-input v-model="scope.row.code_level_1"
                                        size="mini"></el-input>
                                </span>
                                <span v-else>
                                    {{scope.row.code_level_1}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code_level_2"
                            width="160"
                            align="center"
                            label="位置编码二级">
                            <template v-slot="scope">
                                <span v-if="scope.row.operate=='edit'">
                                    <el-input v-model="scope.row.code_level_2"
                                        size="mini"></el-input>
                                </span>
                                <span v-else-if="scope.row.operate=='add'">
                                    <el-input v-model="scope.row.code_level_2"
                                        size="mini"></el-input>
                                </span>
                                <span v-else>
                                    {{scope.row.code_level_2}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="update_time"
                            width="160"
                            align="center"
                            label="广告位置编号">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="媒体集团">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="媒体(英)">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="媒体(中)">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="频道">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="广告位置名称">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="位置备注">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="Platform">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="City（中文）">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="购买单位">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="轮播所占份数">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="刊例单价">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="刊例版本">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="刊例开始日期">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="刊例结束日期">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="广告位置创建日期">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="广告位置最近更新日期">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="备注">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="Media Type(大类别)">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="Media Type(小类别)">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="Format Label 1">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="Format Label 2">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="Format Label 3">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="问题">
                        </el-table-column>
                        <el-table-column prop="status"
                            width="90"
                            align="center"
                            label="排期广告位">
                        </el-table-column>
                        <el-table-column label="Operating"
                            fixed="right"
                            width="250"
                            align="center">
                            <template v-slot="scope">
                                <div class="table-operate-column">
                                    <i v-if="!scope.row.operate"
                                        class="iconfont mas-edit"
                                        title="Edit"
                                        @click="handle_edit(scope.row,scope.column)"></i>
                                    <i v-else
                                        class="el-icon-check"
                                        style="color:#009900"
                                        title="Submit"
                                        @click="handle_submit(scope.row,scope.column)"></i>
                                    <i v-if="!scope.row.operate"
                                        class="el-icon-delete"
                                        title="Delete"
                                        @click="handle_delete(scope.row)"></i>
                                    <i v-else
                                        class="el-icon-close"
                                        style="color:red"
                                        title="Cancel"
                                        @click="handle_cancel(scope.row)"></i>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";
import uuidv1 from "uuid/v1";

export default {
  name: "Table-maintain",
  components: { breadCrumb },

  data() {
    let validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Name is required, 并且使用逗号分隔"));
      } else {
        return callback();
      }
    };

    return {
      isLoading: false,
      breadCrumbList: [
        { path: "/settings/table-maintain", name: "Settings" },
        { path: "/settings/table-maintain", name: "Table Maintenance" },
        { path: "", name: "Code Table" }
      ],

      info: {
        update_time: "",
        upload_url: "",
        download_url: ""
      },
      selections: [],
      tableData: []
    };
  },
  computed: {},

  methods: {
    ...mapActions("settings", ["fetch_code_table_list", "fetch_code_table_add", "fetch_code_table_edit", "fetch_code_table_delete"]),
    isSelectable(row, index) {
      if (row.operate == "add") {
        return false;
      } else {
        return true;
      }
    },
    async get_code_table_list() {
      try {
        this.isLoading = true;

        let res = await this.fetch_code_table_list();
        this.tableData = res.map(item => {
          return { ...item, operate: "" };
        });
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    handle_download() {
      this.$downloadFile(this.info.download_url);
    },

    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (file.type != "application/vnd.ms-excel" && file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          //xls 和 xlsx
          this.$message.warning({
            message: "The uploaded file must be in xls format."
          });
          reject();
        } else {
          resolve();
        }
      });
    },

    handleSuccess() {
      this.$message.success("Uploaded successfully.");
    },

    handleError(err, file, fileList) {
      this.$message.error(err.message);
    },

    handle_section_change(val) {
      this.selections = val.map(item => item.id);
      // this.$emit("section-change", this.checkedRows);
    },

    handle_add(row, column) {
      this.tableData.unshift({
        id: uuidv1(),
        code_level_1: "",
        code_level_2: "",
        operate: "add"
      });
    },

    handle_edit(row) {
      row.operate = "edit";
    },

    handle_cancel(row) {
      if (row.operate == "add") {
        this.tableData = this.tableData.filter(item => {
          return item.id != row.id;
        });
      }
      row.operate = "";
    },

    handle_submit(row, column) {
      //提交前的校验
      console.log("row,", row, column);
      let validate = true;
      for (let item in row) {
        if (String(row[item]).trim() == "") {
          this.$message.warning("不能有空值");
          validate = false;
          break;
        }
      }

      if (validate) {
        if (row.operate == "add") {
          let addData = [row];
          this.fetch_code_table_add(addData)
            .then(res => {
              row.operate = "";
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else if (row.operate == "edit") {
          let editData = [row];
          this.fetch_code_table_edit(editData)
            .then(res => {
              row.operate = "";
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      }
    },
    handle_delete() {
      this.$confirm("Are you sure to delete?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.fetch_code_table_delete(this.selections)
              .then(res => {
                this.$message.success("Delete successfully");
                this.get_code_table_list();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        }
      });
    }
  },

  mounted() {
    this.info = {
      id: this.$route.query.id,
      name: this.$route.query.name,
      update_time: this.$route.query.update_time,
      upload_url: this.$route.query.upload_url,
      download_url: this.$route.query.download_url
    };

    this.get_code_table_list();
  }
};
</script>
<style lang="scss" scoped>
.table-maintain {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;

    .info-area {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 20px;
      height: 130px;
      background-color: white;
      margin-bottom: 10px;
      .text {
        flex: 1;
        font-size: 24px;
        color: #333333;
        font-weight: bold;
      }
      .time {
        font-size: 12px;
        color: #666666;
        line-height: 30px;
      }
    }
    .table-area {
      display: flex;
      flex-direction: column;
      flex: 1;
      background-color: white;
      padding: 10px;

      .operate {
        margin-bottom: 10px;
      }

      .table-wrap {
        flex: 1;
        contain: strict;

        .table-operate-column {
          i {
            font-size: 18px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>