<template>
    <div class="report-card">
        <template v-if="value.type=='spd'">
            <div class="name"
                @click="handle_detail()">
                <i class="el-icon-document-copy"></i>
                <span style="">{{value.name}}</span>

            </div>
            <div class="info">
                <div class="time">Client: {{clientName}}</div>
                <div class="time">Cycle: {{value.cycle.begin}}~{{value.cycle.end}}</div>
                <div class="creator"
                    :title="value.creator">Creator: {{value.creator}}</div>
                <div class="creator"
                    :title="value.creator">Update time:{{value.update_time}}</div>

                <div class="status">
                    <div class="more-permission">
                        <div class="permission"
                            v-if="value.permission==0">
                            <i class="iconfont mas-earth"></i>
                            <hy-box>
                                <span>{{permissionMap[0].label}}</span>
                            </hy-box>
                        </div>
                        <div class="permission"
                            v-if="value.permission==1">
                            <i class="iconfont mas-lock"></i>
                            <hy-box>
                                <span>{{permissionMap[1].label}}</span>
                            </hy-box>
                        </div>
                        <div class="permission"
                            v-if="value.permission==2">
                            <i class="iconfont mas-user"></i>
                            <hy-box>
                                <span>{{permissionMap[2].label}}</span>
                            </hy-box>
                        </div>
                    </div>
                    <div class="more-btn">
                        <div class="btn">
                            <i class="el-icon-document"
                                title="Detail"
                                @click="handle_detail()"></i>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="value.type=='custom'">
            <div class="name"
                @click="handle_change_operate('detail')">
                <i class="el-icon-document-copy"></i>
                <div v-hover
                    class="text">
                    <span style="">{{value.name}}</span>
                </div>
            </div>
            <div class="info">
                <div class="time">Client: {{clientName}}</div>
                <div class="time">Cycle: {{value.cycle.begin}}~{{value.cycle.end}}</div>
                <div class="creator"
                    :title="value.creator">Creator: {{value.creator}}</div>
                <div class="creator"
                    :title="value.creator">Update time:{{value.update_time}}</div>
                <div class="status">
                    <div class="more-permission">
                        <span class="permission"
                            v-if="value.permission==0">
                            <i class="iconfont mas-earth"></i>
                            <hy-box>{{permissionMap[0].label}}</hy-box>
                        </span>
                        <span class="permission"
                            v-if="value.permission==1">
                            <i class="iconfont mas-lock"></i>
                            <hy-box>{{permissionMap[1].label}}</hy-box>
                        </span>
                        <span class="permission"
                            v-if="value.permission==2">
                            <i class="iconfont mas-user"></i>
                            <hy-box>{{permissionMap[2].label}}</hy-box>
                        </span>
                        <span class="arrow">
                            <el-popover placement="bottom"
                                width="150"
                                v-model="permissionPopver"
                                popper-class="operate-popver"
                                trigger="click">
                                <div>
                                    <hy-box class="popver-item"
                                        :gap="false"
                                        :disabled="isReadOnly"
                                        @click="handle_change_permission(0)">
                                        <i class="iconfont mas-earth"></i> {{permissionMap[0].label}}
                                    </hy-box>
                                    <hy-box class="popver-item"
                                        :gap="false"
                                        :disabled="isReadOnly"
                                        @click="handle_change_permission(1)">
                                        <i class="iconfont mas-lock"></i> {{permissionMap[1].label}}
                                    </hy-box>
                                    <hy-box class="popver-item"
                                        :gap="false"
                                        :disabled="isReadOnly"
                                        @click="handle_change_permission(2)">
                                        <i class="iconfont mas-user"></i> {{permissionMap[2].label}}
                                    </hy-box>
                                </div>
                                <i slot="reference"
                                    class="iconfont mas-arrow-down"></i>
                            </el-popover>

                        </span>
                    </div>

                    <div class="more-btn">
                        <el-popover placement="bottom"
                            width="100"
                            v-model="btnPopver"
                            popper-class="operate-popver"
                            trigger="click">
                            <div>
                                <hy-box class="popver-item"
                                    :gap="false"
                                    @click="handle_change_operate('detail')">
                                    <i class="el-icon-document"></i> Detail
                                </hy-box>

                                <hy-box class="popver-item"
                                    :gap="false"
                                    :disabled="isReadOnly"
                                    @click="handle_change_operate('copy')">
                                    <i class="iconfont mas-copy"></i> Copy
                                </hy-box>
                                <hy-box class="popver-item"
                                    :gap="false"
                                    :disabled="isReadOnly"
                                    @click="handle_change_operate('edit')">
                                    <i class="iconfont mas-edit"></i> Edit
                                </hy-box>
                                <hy-box v-if="value.is_edit==1"
                                    :gap="false"
                                    :disabled="isReadOnly"
                                    class="popver-item"
                                    @click="handle_change_operate('delete')">
                                    <i class="el-icon-delete"></i> Delete
                                </hy-box>
                            </div>
                            <i slot="reference"
                                class="iconfont mas-more1-vertical"></i>
                        </el-popover>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="value.type=='add'">
            <hy-box class="add"
                :gap="false"
                :disabled="isReadOnly"
                @click="handle_add_report">
                <i class="el-icon-plus"></i>
                <div class="text">Add Report</div>
            </hy-box>
        </template>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "Report-Card",
  components: {},
  props: {
    value: {
      type: [Object]
    },
    client: {
      type: [String, Number]
    },
    clientOptions: {
      type: [Array, Object],
      default: () => {
        [];
      }
    }
  },

  data() {
    return {
      permissionPopver: false,
      btnPopver: false
    };
  },
  computed: {
    ...mapState("reportCenter", ["permissionMap"]),
    ...mapGetters("reportCenter", ["permissionSpdReport"]),
    ...mapGetters("dataSource/dataList", ["permissionPerformance", "permissionCompetitorsSpending"]),

    clientName() {
      let result = this.clientOptions.find(item => {
        return item.value == this.value.client_id;
      });

      if (result) {
        return result.label;
      } else {
        return "";
      }
    },

    isReadOnly() {
      //只有在SpdReport勾选，writable， data-source中至少一个勾选，并且为writable，才能操作
      let hasSpdReport = !!this.permissionSpdReport;
      let hasDataSourceReport = !!this.permissionPerformance || !!this.permissionCompetitorsSpending;

      if (hasSpdReport && hasDataSourceReport) {
        //spd 和data source 都勾选
        if (!this.permissionSpdReport.isRead) {
          //spd writable
          if (
            (this.permissionPerformance && !this.permissionPerformance.isRead) ||
            (this.permissionCompetitorsSpending && !this.permissionCompetitorsSpending.isRead)
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  },

  methods: {
    ...mapActions("reportCenter", ["fetch_custom_report_modify_permission", "fetch_custom_report_delete", "fetch_custom_report_copy"]),

    handle_detail(item) {
      this.$router.push({
        path: "custom-report/spd-detail",
        query: { id: this.value.id, name: this.value.name, cycle: this.value.cycle, permission: this.value.permission }
      });
    },

    handle_change_permission(type) {
      this.permissionPopver = false;
      let text = type == 0 ? "Public" : type == 2 ? "Private" : "";
      if (type == 0 || type == 2) {
        this.$confirm(`Are you sure to switch to ${text}?`, "Tips", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          closeOnClickModal: false,
          type: "warning",
          callback: action => {
            if (action == "confirm") {
              //发送请求
              this.fetch_custom_report_modify_permission({ id: this.value.id, permission: type })
                .then(res => {
                  this.value.permission = type;
                })
                .catch(err => {
                  this.$message.error(err.message);
                });
            }
          }
        });
      } else {
        //等于1时
        this.$router.push({
          path: "custom-report/add-report",
          query: { type: "edit", step: 2, id: this.value.id, client: this.client }
        });
      }
    },

    handle_change_operate(type) {
      this.btnPopver = false;

      if (type == "detail") {
        this.$router.push({
          path: "custom-report/add-report-detail",
          query: {
            id: this.value.id,
            name: this.value.name,
            begin: this.value.cycle.begin,
            end: this.value.cycle.end,
            client: this.client
          }
        });
      }

      if (type == "copy") {
        this.fetch_custom_report_copy({ id: this.value.id })
          .then(res => {
            this.$emit("refresh");
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }

      if (type == "edit") {
        this.$router.push({
          path: "custom-report/add-report",
          query: { type: "edit", id: this.value.id, client: this.client, name: this.value.name }
        });
      }

      if (type == "delete") {
        this.$confirm(`Are you sure to Delete Report?`, "Tips", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          closeOnClickModal: false,
          type: "warning",
          callback: action => {
            if (action == "confirm") {
              //发送请求删除
              this.fetch_custom_report_delete({ id: this.value.id })
                .then(res => {
                  this.$emit("refresh");
                })
                .catch(err => {
                  this.$message.error(err.message);
                });
            }
          }
        });
      }
    },

    handle_add_report() {
      this.$router.push({
        path: "custom-report/add-report",
        query: { type: "add", client: this.client }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.report-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 260px;
  height: 180px;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #e2e2e2;
  border-radius: 5px;

  .add {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    background-color: white;
    border-radius: 5px;
    cursor: pointer;

    i {
      font-size: 50px;
      color: #999999;
    }
    div {
      color: #999999;
    }
  }

  .name {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #768696;
    font-size: 24px;
    color: white;
    padding: 5px;
    cursor: pointer;

    .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 30px;
      max-width: 190px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    flex: 2;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #ffffff;
    padding: 5px 15px;

    .time {
      display: flex;
      align-items: center;
      flex: 1;
      color: #999999;
      font-size: 13px;
    }

    .creator {
      display: flex;
      align-items: center;
      flex: 1;
      color: #999999;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;

      .more-permission {
        display: flex;
        align-items: center;
        flex: 3;
        line-height: 1;

        .permission {
          color: #999999;
          font-size: 14px;
        }

        .arrow {
          color: #999999;
          margin-left: 5px;
          cursor: pointer;
        }
      }

      .more-btn {
        cursor: pointer;
        color: #999999;
        font-size: 16px;
      }
    }
  }
}
</style>
