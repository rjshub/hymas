<template>
    <div v-loading="isLoading"
        element-loading-spinner="iconfont mas-loading"
        class="add-step">
        <div class="step-area">
            <span :class="{active:activeStep>=1}">STEP1:Report Configuration</span>
            <i :class="{active:activeStep>=2}"
                class="el-icon-arrow-right"></i>
            <span :class="{active:activeStep>=2}">STEP2:Template Configuration</span>
        </div>
        <div class="configuration-area">
            <template v-if="activeStep==1">
                <report-configuration :values="reportData.step1"
                    @step-two="handle_goto_step_two"
                    @preview="handle_preview"
                    @save-report="handle_save_report"></report-configuration>
            </template>
            <template v-if="activeStep==2">
                <template-configuration :values="reportData.step2"
                    :depend-data="step2dependData"
                    @step-one="handle_goto_step_one"
                    @save-report="handle_save_report"></template-configuration>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import reportConfiguration from "./report-configuration/index";
import templateConfiguration from "./template-configuration/index";

export default {
  name: "AddStep",
  components: { reportConfiguration, templateConfiguration },

  data() {
    return {
      isLoading: false,
      activeStep: "",
      //保存 定制报表时发往 后端的 参数
      reportData: {
        step1: {},
        step2: {}
      },

      step2dependData: {
        cycle: [],
        dataSourceRadio: ""
      }
    };
  },

  computed: {},

  watch: {},

  methods: {
    ...mapActions("reportCenter", ["fetch_custome_report_save_report_step", "fetch_custome_report_get_report_step"]),

    init() {},

    handle_preview({ step1 }) {
      let params = _.cloneDeep(step1);
      params.start_date = step1.date.start;
      params.end_date = step1.date.end ? step1.date.end : "Today";

      delete params.date;

      this.$emit("preview", params);
    },

    handle_goto_step_two({ step1 }) {
      this.reportData.step1 = step1;

      this.step2dependData = {
        cycle: step1.date,
        dataSourceRadio: step1.dataSourceRadio
      };
      this.activeStep = 2;
    },
    handle_goto_step_one({ step2 }) {
      this.activeStep = 1;
      this.reportData.step2 = step2;
    },

    handle_save_report({ step1, step2, type }) {
      if (step1) {
        this.reportData.step1 = step1;
      }
      if (step2) {
        this.reportData.step2 = step2;
      }

      let params = _.cloneDeep(this.reportData);
      params.step1.start_date = params.step1.date.start;
      params.step1.end_date = params.step1.date.end ? params.step1.date.end : "Today";
      params.step1.client_id = params.step1.client;

      delete params.step1.date; //删除
      delete params.step1.client;

      let requestType = "";
      if (this.$route.query.type == "add") {
        requestType = "add";
      } else {
        requestType = type == "save" ? "edit" : "saveAs";
      }

      this.fetch_custome_report_save_report_step({ type: requestType, id: this.$route.query.id, data: params })
        .then(res => {
          this.$router.push({
            name: "customReport"
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  },

  mounted() {
    //开始请求所有的数据
    if (this.$route.query.type != "add") {
      this.isLoading = true;
      this.fetch_custome_report_get_report_step({ id: this.$route.query.id })
        .then(res => {
          if (this.$route.query.step == 2) {
            this.activeStep = 2;
          } else {
            this.activeStep = 1;
          }

          this.reportData.step1 = {
            dataSourceRadio: res.step1.dataSourceRadio,
            date: { start: res.step1.start_date, end: res.step1.end_date == "Today" ? "" : res.step1.end_date },
            fields: res.step1.fields,
            client: res.step1.client_id
          };

          this.reportData.step2 = {
            name: res.step2.name,
            cycle: [res.step1.start_date, res.step1.end_date],
            cycleType: Number(res.step2.cycleType),
            cycleDays: res.step2.cycleDays,
            rangeValue: Number(res.step2.rangeValue),
            logic: Number(res.step2.logic),
            rangeUsers: res.step2.rangeUsers
          };

          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message);
        });
    } else {
      this.activeStep = 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.add-step {
  display: flex;
  flex-direction: column;
  flex: 1;

  .step-area {
    height: 50px;
    line-height: 50px;
    font-weight: bold;

    i {
      display: inline-block;
      font-weight: bold;
      width: 50px;
      text-align: center;
    }

    span,
    i {
      color: #999999;
      &.active {
        color: #0c569d;
      }
    }
  }

  .configuration-area {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>