<template>
    <div class="table-maintain">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="main">
            <div class="info-area">
                <!-- <div class="text">{{info.name}}</div> -->
                <div class="text">Mapping Table-Code Table</div>
                <div class="time">Updated Time: {{info.update_time}}</div>
                <div class="btn">

                    <hy-box>
                        <el-button type="primary"
                            plain
                            size="mini"
                            @click="handle_download">
                            <i class="iconfont mas-download"></i>
                        </el-button>
                    </hy-box>

                    <hy-box>
                        <el-upload style="display: inline-block;"
                            :action="info.upload_url"
                            :data="{id: info.id}"
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
                    </hy-box>

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
                        @click="handle_delete({id:selections})">
                        <i class="el-icon-delete"></i>
                    </el-button>

                </div>
                <div v-loading="isLoading"
                    element-loading-spinner="iconfont mas-loading"
                    class="table-wrap">

                    <el-table v-if="tableData && tableData.length>0"
                        :data="tableData"
                        height="100px"
                        header-row-class-name="blue"
                        style="min-height:100%;width: 100%"
                        @selection-change="handle_section_change">

                        <el-table-column type="selection"
                            :selectable="isSelectable"
                            align="center"
                            width="50">
                        </el-table-column>

                        <template v-for="(item,index) in tableHeaders">
                            <el-table-column :key="item.prop"
                                :label="item.name"
                                :show-overflow-tooltip="true"
                                :prop="item.prop"
                                min-width="200"
                                align="center">
                                <template v-slot="{row, column}">
                                    <span v-if="row.operate=='edit'"
                                        :class="{validateError: item.required && !row.row[index].value}">
                                        <el-input v-model="row.row[index].value"
                                            size="mini"></el-input>
                                    </span>

                                    <span v-else-if="row.operate=='add'"
                                        :class="{validateError: item.required && !row.row[index].value}">
                                        <el-input v-model="row.row[index].value"
                                            size="mini"></el-input>
                                    </span>
                                    <span v-else>
                                        {{getColumnValue(row, column)}}
                                    </span>
                                </template>
                            </el-table-column>
                        </template>

                        <el-table-column label="Operating"
                            fixed="right"
                            width="150"
                            align="center">
                            <template v-slot="{row,column}">
                                <div class="table-operate-column">
                                    <i v-if="!row.operate"
                                        class="iconfont mas-edit"
                                        title="Edit"
                                        @click="handle_edit(row,column)"></i>
                                    <i v-else
                                        class="el-icon-check"
                                        style="font-size:18px;color:#009900;font-weight: bold;"
                                        title="Submit"
                                        @click="handle_submit(row,column)"></i>
                                    <i v-if="!row.operate"
                                        class="el-icon-delete"
                                        title="Delete"
                                        @click="handle_delete(row)"></i>
                                    <i v-else
                                        class="el-icon-close"
                                        style="font-size:18px;color:red;font-weight:bold;"
                                        title="Cancel"
                                        @click="handle_cancel(row)"></i>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-else
                        class="no-data">No Data</div>
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
      tableDataClone: [],
      tableData: [],

      tableHeaders: []
    };
  },
  computed: {},

  methods: {
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

        this.tableData = [];

        let data = [
          {
            id: 1,
            row: [
              { name: "时间", value: "2019-07-10", prop: "advertising_date", required: true },
              { name: "品牌", value: "lancome", prop: "brand", required: true },
              { name: "产品", value: "小黑瓶", prop: "product" },
              { name: "product1", value: "小黑瓶", prop: "product1" },
              { name: "product2", value: "小黑瓶", prop: "product2" },
              { name: "product3", value: "小黑瓶", prop: "product3" },
              { name: "product4", value: "小黑瓶", prop: "product4" }
            ]
          },
          {
            id: 2,
            row: [
              { name: "时间", value: "2019-07-10", prop: "advertising_date", required: true },
              { name: "品牌", value: "lancome", prop: "brand", required: true },
              { name: "产品", value: "小黑瓶", prop: "product" },
              { name: "product1", value: "小黑瓶", prop: "product1" },
              { name: "product2", value: "小黑瓶", prop: "product2" },
              { name: "product3", value: "小黑瓶", prop: "product3" },
              { name: "product4", value: "小黑瓶", prop: "product4" }
            ]
          }
        ];

        // let { data } = await fetch.post("/maintenance/mapping_table_list", { id: this.info.id });

        if (data.length > 0) {
          this.tableHeaders = data[0].row.map(item => {
            return { name: item.name, prop: item.prop, required: item.required };
          });
        }

        this.tableData = data.map(item => {
          return { ...item, operate: "" };
        });

        this.tableDataClone = _.cloneDeep(this.tableData);
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    handle_download() {
      this.$downloadFile({ url: this.info.download_url });
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
      this.get_code_table_list();
    },

    handleError(err, file, fileList) {
      this.$message.error(err.message);
    },

    handle_section_change(val) {
      this.selections = val.map(item => item.id);
      // this.$emit("section-change", this.checkedRows);
    },

    handle_add(row, column) {
      let newRow = this.tableHeaders.map(item => {
        return { name: item.name, prop: item.prop, value: "", required: item.required };
      });

      this.tableData.unshift({
        id: uuidv1(),
        row: newRow,
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
      } else {
        //编辑
        for (let item of this.tableData) {
          if (item.id == row.id) {
            item.row = this.tableDataClone.find(jtem => {
              return jtem.id == row.id;
            }).row;
          }
        }
        this.tableData;
      }
      row.operate = "";
    },

    async handle_submit(row, column) {
      //提交前的校验
      let validate = true;

      console.log("row===", row);

      for (let item of row.row) {
        if (item.required) {
          if (item.value.trim() == "") {
            this.$message.warning("不能有空值");
            validate = false;
            break;
          }
        }
      }

      if (validate) {
        try {
          if (row.operate == "add") {
            let addData = row.row;
            let { data } = await fetch.post("/maintenance/mapping_row_add", { row: addData });
            row.operate = "";
            row.id = data.id;
            this.tableDataClone = _.cloneDeep(this.tableData);
          } else if (row.operate == "edit") {
            let editData = row.row;

            let { data } = await fetch.post("/codeTable/edit", { row: editData });
            row.operate = "";
            this.tableDataClone = _.cloneDeep(this.tableData);
          }
        } catch (err) {
          this.$message.error(err.message);
        }
      }
    },
    handle_delete(row) {
      this.$confirm("Are you sure to delete?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: async action => {
          if (action == "confirm") {
            let params = Array.isArray(row.id) ? row.id : [row.id];

            try {
              await fetch.post("/codeTable/delete", { id: params });
              this.$message.success("Delete successfully");
              this.tableData = this.tableData.filter(item => {
                let has = params.find(jtem => {
                  return jtem == item.id;
                });
                return !has;
              });

              this.tableDataClone = _.cloneDeep(this.tableData);
            } catch (err) {
              this.$message.error(err.message);
            }
          }
        }
      });
    },

    getColumnValue(row, column) {
      let result = row.row.find(item => {
        return item.prop == column.property;
      });

      return result.value;
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
        display: flex;
        contain: strict;

        .table-operate-column {
          display: flex;
          justify-content: center;

          i {
            font-size: 16px;
            cursor: pointer;
            margin-right: 20px;

            &:last-child {
              margin-right: 0;
            }
          }
        }

        ::v-deep .el-table {
          th {
            padding: 2px;
          }

          td {
            padding: 0;
            background: #fafafa;
            .cell {
              padding: 5px;
            }
          }

          .validateError {
            input {
              border: 1px solid #f44336;
            }
          }
        }

        .no-data {
          flex: 1;
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
  }
}
</style>