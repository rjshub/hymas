<template>
    <div class="custom-report">
        <bread-crumb :values="breadCrumbList"></bread-crumb>
        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <div class="tools">
                <div>
                    <el-select v-model="filter.client"
                        size="mini"
                        filterable
                        placeholder="Select Client"
                        style="width:150px;margin-right:5px"
                        @change="get_card_list">
                        <el-option v-for="(item,index) in clientOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>

                    <el-date-picker size="mini"
                        style="width:220px"
                        v-model="filter.date"
                        type="daterange"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="Start Date"
                        end-placeholder="End Date"
                        @change="get_card_list">
                    </el-date-picker>
                </div>

                <el-input size="mini"
                    style="width:250px"
                    placeholder="Please enter Keywords"
                    @keyup.enter.native="get_card_list"
                    v-model="filter.keywords">
                    <template v-slot:append>
                        <el-button icon="el-icon-search"
                            @click="get_card_list"></el-button>
                    </template>
                </el-input>
            </div>
            <div class="cards">
                <report-card v-for="(item,index) in cards"
                    :key="index"
                    @refresh="handle_refresh"
                    :client="filter.client"
                    :clientOptions="clientOptions"
                    :value="item"></report-card>
            </div>
        </div>

        <!-- 回到顶部 -->
        <el-backtop target=".cards"
            :bottom="5">
            <div class="backtop-arrow">
                <i class="iconfont mas-up"></i>
            </div>
        </el-backtop>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import reportCard from "./report-card";

export default {
  name: "Custom-Report",
  components: { breadCrumb, reportCard },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [{ path: "/report-center", name: "Report Center" }, { path: "", name: "Custom Report" }],

      filter: {
        date: [],
        client: "",
        keywords: ""
      },
      clientOptions: [],

      cards: []
    };
  },
  computed: {},

  methods: {
    ...mapActions("reportCenter", ["fetch_custom_report_list"]),
    ...mapActions("home", ["fetch_filter_list"]),

    async get_card_list() {
      try {
        let param = {
          client_id: this.filter.client,
          start: this.filter.date && this.filter.date.length > 0 ? this.filter.date[0] : "",
          end: this.filter.date && this.filter.date.length > 0 ? this.filter.date[1] : "",
          keywords: this.filter.keywords
        };
        this.isLoading = true;

        let data = await this.fetch_custom_report_list(param);
        data.push({ type: "add" });
        this.cards = data;
        this.isLoading = false;
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    async get_client_list() {
      try {
        this.clientOptions = await this.fetch_filter_list({ type: "client", value: "" });
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    handle_refresh() {
      this.get_card_list();
    }
  },

  mounted() {
    this.get_client_list();
    this.filter.client = "1"; //默认为elc

    this.get_card_list();
  }
};
</script>
<style lang="scss" scoped>
.custom-report {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    .tools {
      display: flex;
      justify-content: space-between;
      text-align: right;
      * {
        vertical-align: middle;
      }
    }

    .cards {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow: auto;
      margin-top: 10px;
    }
  }
}
</style>