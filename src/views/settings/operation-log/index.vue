<template>
    <div class="operation-log">
        <bread-crumb :values="data.breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="data.isLoading"
            element-loading-spinner="iconfont mas-loading">
            <div class="filter">
                <filter-select v-model="data.filter.userValue"
                    width="145px"
                    :options="data.userOptions"
                    :is-overlap-placeholder-color="true"
                    filterable
                    clearable
                    placeholder="All Users"
                    @change="handle_change_user"></filter-select>
                <filter-select v-model="data.filter.roleValue"
                    width="145px"
                    :options="data.roleOptions"
                    :is-overlap-placeholder-color="true"
                    filterable
                    clearable
                    placeholder="All Roles"
                    @change="handle_change_role"></filter-select>

                <filter-select v-model="data.filter.sectionValue"
                    width="145px"
                    :options="data.sectionOptions"
                    :is-overlap-placeholder-color="true"
                    filterable
                    clearable
                    placeholder="All Sections"
                    @change="handle_change_section"></filter-select>

                <filter-select v-model="data.filter.typeValue"
                    width="145px"
                    :options="data.typeOptions"
                    :is-overlap-placeholder-color="true"
                    filterable
                    clearable
                    placeholder="All Types"
                    @change="handle_change_type"></filter-select>

                <hy-box>
                    <el-date-picker size="mini"
                        style="width:200px"
                        v-model="data.filter.date"
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

                <hy-box>
                    <el-input size="mini"
                        style="width:210px"
                        placeholder="Please enter keywords"
                        @keyup.enter.native="handle_change_keywords"
                        v-model="data.filter.keywords">
                        <template v-slot:append>
                            <el-button icon="el-icon-search"
                                @click="handle_change_keywords"></el-button>
                        </template>
                    </el-input>
                </hy-box>

            </div>
            <div class="table-wrap">
                <el-table :data="data.tableList"
                    height="100px"
                    stripe
                    header-row-class-name="table-header-class"
                    style="min-height:100%;width: 100%">
                    <el-table-column prop="time"
                        align="center"
                        width="180"
                        label="Time">
                    </el-table-column>
                    <el-table-column prop="user"
                        align="center"
                        width="120"
                        :show-overflow-tooltip="true"
                        label="User">
                    </el-table-column>
                    <el-table-column prop="role"
                        width="120"
                        :show-overflow-tooltip="true"
                        align="center"
                        label="Role">
                    </el-table-column>
                    <el-table-column prop="section"
                        :show-overflow-tooltip="true"
                        align="center"
                        label="Section">
                    </el-table-column>
                    <el-table-column prop="object"
                        :show-overflow-tooltip="true"
                        align="center"
                        label="Object">
                    </el-table-column>
                    <el-table-column prop="type"
                        width="90"
                        align="center"
                        label="Type">
                    </el-table-column>
                    <el-table-column label="Detail"
                        width="200"
                        align="center">
                        <template v-slot="scope">

                            <el-popover placement="right"
                                popper-class="log-detail"
                                width="500"
                                ref="popover"
                                trigger="hover">
                                <el-table :data="scope.row.detail"
                                    border
                                    max-height="300">
                                    <el-table-column width="120"
                                        align="center"
                                        prop="item"
                                        label="Changed Item"></el-table-column>
                                    <el-table-column align="center"
                                        prop="before"
                                        label="Before"></el-table-column>
                                    <el-table-column align="center"
                                        prop="after"
                                        label="After"></el-table-column>
                                </el-table>
                                <i slot="reference"
                                    class="el-icon-document"
                                    style="font-size:16px;"></i>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="pagination-area">
                <el-pagination background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="data.currentPage"
                    :page-sizes="data.pageSizesArr"
                    :page-size="data.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="data.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  computed,
  toRefs,
  watch,
  provide,
  inject,
  set,
  onMounted,
  onUpdated,
  onUnmounted,
  onActivated
} from "@vue/composition-api";
import { Message } from "element-ui";
import store from "@/store";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";

import filterSelect from "@/components/common/filter-select";
export default {
  name: "Operation-Log",
  components: { breadCrumb, filterSelect },

  setup(props, context) {
    const data = reactive({
      isLoading: false,
      breadCrumbList: [{ path: "/settings/operation-log", name: "Settings" }, { path: "", name: "Operation Log Management" }],
      filter: {
        userValue: "",
        roleValue: "",
        sectionValue: "",
        typeValue: "",
        date: "",
        keywords: ""
      },

      userOptions: [],
      roleOptions: [],
      sectionOptions: [],
      typeOptions: [],
      tableList: [],

      currentPage: 1,
      pageSizesArr: [20, 50, 100],
      pageSize: 20,
      total: 0
    });

    //加载store action
    const fetch_log_filter_options = param => {
      return store.dispatch("settings/fetch_log_filter_options", param);
    };

    const fetch_log_list = param => {
      return store.dispatch("settings/fetch_log_list", param);
    };

    //methods
    const get_filter_options = async () => {
      data.isLoading = true;

      try {
        let [res_user, res_role, res_section, res_type, res_date] = await Promise.all([
          fetch_log_filter_options({ type: "user" }),
          fetch_log_filter_options({ type: "role", value: data.filter.userValue }),
          fetch_log_filter_options({ type: "section" }),
          fetch_log_filter_options({ type: "type" }),
          fetch_log_filter_options({ type: "date" })
        ]);

        data.userOptions = res_user;
        data.roleOptions = res_role;
        data.sectionOptions = res_section;
        data.typeOptions = res_type;

        data.filter.date = [res_date.start, res_date.end];

        await get_log_list();
      } catch (err) {
        Message.error(err.message);
      }
    };

    const get_log_list = async () => {
      try {
        data.isLoading = true;

        let res = await fetch_log_list({
          user: data.filter.userValue,
          role: data.filter.roleValue,
          section: data.filter.sectionValue,
          type: data.filter.typeValue,
          start: data.filter.date && data.filter.date.length > 0 ? data.filter.date[0] : "",
          end: data.filter.date && data.filter.date.length > 0 ? data.filter.date[1] : "",
          keywords: data.filter.keywords,
          perpage: data.pageSize,
          page: data.currentPage
        });

        data.tableList = res.list;
        data.total = Number(res.total);

        data.isLoading = false;
      } catch (err) {
        data.isLoading = false;
        Message.error(err.message);
      }
    };

    const handle_change_user = () => {
      data.filter.roleValue = "";
      fetch_log_filter_options({ type: "role", value: data.filter.userValue }).then(res => {
        data.roleOptions = res;
      });

      data.currentPage = 1;
      get_log_list();
    };

    const handle_change_role = () => {
      data.currentPage = 1;
      get_log_list();
    };

    const handle_change_section = () => {
      data.currentPage = 1;
      get_log_list();
    };

    const handle_change_type = () => {
      data.currentPage = 1;
      get_log_list();
    };

    const handle_change_date = () => {
      data.currentPage = 1;
      get_log_list();
    };

    const handle_change_keywords = () => {
      data.currentPage = 1;
      get_log_list();
    };

    const handleSizeChange = val => {
      data.pageSize = val;
      data.currentPage = 1;
      get_log_list();
    };

    const handleCurrentChange = val => {
      data.currentPage = val;
      get_log_list();
    };

    onMounted(() => {
      get_filter_options();
    });

    return {
      data,
      handle_change_user,
      handle_change_role,
      handle_change_section,
      handle_change_type,
      handle_change_date,
      handle_change_keywords,
      handleSizeChange,
      handleCurrentChange
    };
  }
};
</script>
<style lang="scss" scoped>
.operation-log {
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
    background-color: transparent;
    padding: 10px;

    .filter {
      padding: 10px 0;
      * {
        vertical-align: middle;
      }
    }

    .table-wrap {
      flex: 1;
      contain: strict;

      ::v-deep .el-table {
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