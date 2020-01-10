<template>
    <div class="table-maintain">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main">
            <div class="info-area">
                <div class="text">Verified fields</div>
                <div class="time">Updated time: {{info.update_time}}</div>
                <div class="btn">
                    <el-button type="primary"
                        plain
                        size="mini"
                        @click="handle_download">
                        <i class="iconfont mas-download"></i>
                    </el-button>

                    <el-button type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        @click="handle_add">
                        Add Tab
                    </el-button>
                </div>
            </div>
            <div v-loading="isLoading"
                element-loading-spinner="iconfont mas-loading"
                class="tab-area">

                <el-tabs v-if="tabData && tabData.length>0"
                    v-model="activeName"
                    type="border-card"
                    @tab-click="handleClick">

                    <template v-for="(item,index) in tabData ">
                        <el-tab-pane :key="index"
                            :label="getTabTitle(item)"
                            :name="item.id">
                            <!-- list start -->
                            <template>
                                <!-- 顶部按钮 -->
                                <div v-if="item.relate.child"
                                    class="add-row">
                                    <!-- 有父有子 -->
                                    <div class="parent">
                                        <span class="text">
                                            {{item.relate.parent.name}}
                                        </span>
                                        <span class="status"
                                            :class="{active:item.relate.parent.status}"
                                            @click="handle_change_status(item.relate.parent)">
                                        </span>
                                        <span @click="handle_card_list_add({level:1}, item)"><i class="el-icon-plus"></i></span>
                                    </div>
                                    <div class="child">
                                        <span class="text">
                                            {{item.relate.child.name}}
                                        </span>
                                        <span class="status"
                                            :class="{active:item.relate.child.status}"
                                            @click="handle_change_status(item.relate.child)"></span>
                                    </div>
                                </div>
                                <div v-else
                                    class="add-row">
                                    <!-- 只有父，无子 -->
                                    <div class="only-parent">
                                        <span class="text">
                                            {{item.relate.parent.name}}
                                        </span>
                                        <span class="status"
                                            :class="{active:item.relate.parent.status}"
                                            @click="handle_change_status(item.relate.parent)"></span>
                                        <span @click="handle_card_list_add({level:1}, item)"><i class="el-icon-plus"></i></span>
                                    </div>
                                </div>
                            </template>

                            <template>
                                <!-- 列表区域 -->
                                <verified-card-list-has-child v-if="!!item.relate.child"
                                    :values="item.list"
                                    @delete="handle_card_list_delete($event, item)"
                                    @add="handle_card_list_add($event, item)">
                                </verified-card-list-has-child>
                                <verified-card-list-no-child v-else
                                    :values="item.list"
                                    @delete="handle_card_list_delete($event, item)">
                                </verified-card-list-no-child>
                            </template>
                            <!-- list start -->
                        </el-tab-pane>
                    </template>

                </el-tabs>

                <div v-else
                    class="no-data">
                    <span>No Results Found.</span>
                    <span> Please set up the 'source data format' before configuring the 'Verified fields' table</span>
                </div>
            </div>
        </div>

        <!-- 给tab中的list 新增 内容 -->
        <el-dialog :title="dialogTitle"
            class="clients__add-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="addDialogVisible"
            width="450px"
            @close="handle_dialog_close">
            <el-form ref="addForm"
                :model="addForm"
                :rules="rules"
                size="mini">
                <el-form-item prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>

            <template v-slot:footer>
                <el-button size="mini"
                    @click="handle_dialog_close">Cancel</el-button>
                <el-button size="mini"
                    type="primary"
                    @click="handle_dialog_submit">Save</el-button>
            </template>
        </el-dialog>

        <AddField v-if="isAddField"
            @close="isAddField=false"
            @save="handle_add_tab">
        </AddField>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";
import VerifiedCardListHasChild from "@/views/settings/common/verified-card-list/has-child";
import VerifiedCardListNoChild from "@/views/settings/common/verified-card-list/no-child";
import AddField from "./add-field";

export default {
  name: "TableMaintain",
  components: { breadCrumb, VerifiedCardListHasChild, VerifiedCardListNoChild, AddField },

  data() {
    let validateName = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.name;
      if (!value) {
        callback(new Error("Name is required."));
      } else {
        if (!nameRegx.firstPlace.regx.test(value)) {
          callback(new Error(nameRegx.firstPlace.message));
        } else if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
          callback(new Error(nameRegx.length.message));
        } else {
          callback();
        }
      }
    };

    return {
      isLoading: false,
      isAddField: false,
      breadCrumbList: [
        { path: "/settings/table-maintain", name: "Settings" },
        { path: "/settings/table-maintain", name: "Table Maintenance" },
        { path: "", name: "Fixed Table" }
      ],
      activeName: "group_brand",

      info: {
        update_time: "",
        download_url: ""
      },

      tabData: [],
      addForm: {
        fieldId: "", //  tab id
        id: "", //
        name: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },

      addDialogVisible: false,
      dialogTitle: ""
    };
  },
  computed: {},

  methods: {
    ...mapActions("settings", []),
    handleClick() {},

    getTabTitle(item) {
      let title = "";
      let relate = item.relate;
      if (relate.parent) {
        title += relate.parent.name;
      }

      if (relate.child) {
        title += "&" + relate.child.name;
      }
      return title;
    },

    async get_fixed_table_list() {
      try {
        this.isLoading = true;
        this.tabData = await this.fetch_verified_list();

        if (this.tabData[0]) {
          this.activeName = this.tabData[0].id;
        }

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    handle_add_tab(data) {
      this.isAddField = false;

      this.get_fixed_table_list();
    },

    handle_card_list_delete(event, item) {
      this.$confirm("Are you sure to delete?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: async action => {
          if (action == "confirm") {
            try {
              await this.fetch_verified_delete({ id: event.id, fieldId: item.id });
              this.tabData = await this.fetch_verified_list();
            } catch (err) {
              this.$message.error(err.message);
            }
          }
        }
      });
    },

    handle_card_list_add(event, item) {
      console.log("handle_card_list_add", event, item);

      if (event.level == 1) {
        this.dialogTitle = `Add ${item.relate.parent.name}`;
      } else {
        this.dialogTitle = `Add ${item.relate.child.name}`;
      }

      this.addForm.fieldId = item.id;
      this.addForm.id = event.id;

      this.addDialogVisible = true;
    },

    handle_change_status(relate) {
      this.fetch_verified_change_status({ status: Number(!relate.status) })
        .then(res => {
          relate.status = Number(!relate.status);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handle_dialog_close() {
      this.addDialogVisible = false;
      this.resetForm();
    },

    resetForm() {
      this.addForm.fieldId = "";
      this.addForm.id = "";
      this.addForm.name = "";
      this.dialogTitle = "";
      this.$refs["addForm"].resetFields();
    },

    handle_dialog_submit() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let param = _.cloneDeep(this.addForm);

          this.fetch_verified_add({ fieldId: param.fieldId, parentId: param.id, name: param.name })
            .then(res => {
              this.tabData = this.fetch_verified_list();
            })
            .catch(err => {
              this.$message.error(err.message);
            });

          this.addDialogVisible = false;
          this.resetForm();
        } else {
          return false;
        }
      });
    },

    handle_download() {
      this.$downloadFile({ url: this.info.download_url });
    },

    // fixed table 删除
    fetch_verified_change_status(data) {
      return new Promise((resolve, reject) => {
        fetch
          .post("/maintenance/verified_field_status", data)
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取 fixed table 列表
    fetch_verified_list(data) {
      let result = [
        {
          id: "1",
          relate: {
            parent: { name: "Group", id: "1", status: 1 },
            child: { name: "Brand", id: "2", status: 0 }
          },

          list: [
            {
              id: "56",
              name: "test_test_xx"
            },
            {
              id: "47",
              name: "libb_root",
              children: [
                {
                  id: "52",
                  name: "libb_child4"
                },
                {
                  id: "50",
                  name: "libb_child3"
                },
                {
                  id: "49",
                  name: "libb_child2"
                },
                {
                  id: "48",
                  name: "libb_child1"
                }
              ]
            }
          ]
        },
        {
          id: "2",
          relate: {
            parent: { name: "Product", id: "1", status: 0 }
          },

          list: [
            {
              id: "56",
              name: "test_test_xx"
            },
            {
              id: "47",
              name: "libb_root"
            },
            {
              id: "56",
              name: "test_test_xx"
            },
            {
              id: "47",
              name: "libb_root"
            },
            {
              id: "56",
              name: "test_test_xx"
            },
            {
              id: "47",
              name: "libb_root"
            }
          ]
        }
      ];

      return result;

      return new Promise((resolve, reject) => {
        fetch
          .post("/maintenance/verified_list", data)
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // fixed table 删除
    fetch_verified_delete(data) {
      return new Promise((resolve, reject) => {
        fetch
          .post("/maintenance/verified_delete", data)
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // fixed table 添加
    fetch_verified_add(data) {
      return new Promise((resolve, reject) => {
        fetch
          .post("/maintenance/verified_add", data)
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    handle_add() {
      this.isAddField = true;
    }
  },

  mounted() {
    this.info = {
      id: this.$route.query.id,
      name: this.$route.query.name,
      update_time: this.$route.query.update_time,
      download_url: this.$route.query.download_url
    };

    this.get_fixed_table_list();
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
    .tab-area {
      display: flex;
      flex-direction: column;
      flex: 1;
      background-color: white;

      /deep/ .el-tabs {
        display: flex;
        flex-direction: column;
        flex: 1;

        .el-tabs__header {
          background-color: #e5e6eb;
          margin-bottom: 0;

          .el-tabs__nav {
            .el-tabs__item {
              &#tab-group_brand {
                width: 120px;
                text-align: center;
              }
            }
          }
        }

        .el-tabs__content {
          flex: 1;
          overflow: auto;
          padding: 10px;

          .add-row {
            display: flex;
            .parent {
              box-sizing: border-box;
              display: flex;
              align-items: center;
              width: 200px;
              height: 40px;
              border-radius: 5px;
              margin-right: 10px;
              padding: 8px;
              margin-bottom: 10px;
              background-color: #e0e0e0;
              color: #333333;
              border: 1px solid #e5e5e5;
              justify-content: space-between;

              .text {
                font-size: 18px;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                height: 20px;
                font-weight: bold;
              }

              i {
                font-size: 20px;
                cursor: pointer;
              }
            }

            .only-parent {
              box-sizing: border-box;
              display: flex;
              align-items: center;
              width: 100%;
              height: 40px;
              border-radius: 5px;
              padding: 8px;
              margin-bottom: 10px;
              background-color: #e0e0e0;
              color: #333333;
              border: 1px solid #e5e5e5;
              justify-content: space-between;

              .text {
                font-size: 18px;
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                height: 20px;
                font-weight: bold;
              }

              i {
                font-size: 20px;
                cursor: pointer;
              }
            }

            .child {
              box-sizing: border-box;
              flex: 1;
              display: flex;
              align-items: center;
              height: 40px;
              border-radius: 5px;
              padding: 8px;
              margin-bottom: 10px;
              background-color: #e0e0e0;
              color: #333333;
              border: 1px solid #e5e5e5;

              .text {
                flex: 1;
                font-weight: bold;
              }
            }

            .status {
              width: 10px;
              height: 10px;
              background-color: #f2943a;
              border-radius: 50%;
              margin-right: 10px;
              cursor: pointer;

              &.active {
                background-color: #26acec;
              }
            }
          }
        }
      }

      .no-data {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #909399;
      }
    }
  }
}
</style>