<template>
    <div class="template-configuration">
        <el-form ref="form"
            :model="form"
            :rules="rules"
            label-width="20px">
            <el-form-item prop="name">
                <div class="item">
                    <label>Template Name:</label>
                    <div>
                        <el-input v-model="form.name"
                            size="mini"
                            style="width:400px"
                            placeholder=""></el-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item prop="cycleType">
                <div class="item">
                    <label>Cycle Confirguration: <span style="color: #606266;font-weight: normal;"></span></label>
                    <div>
                        <div class="sub-title">Data Cycle: {{getDate}}</div>
                        <div>
                            <div class="sub-title">Display cycle:</div>
                            <el-radio-group v-model="form.cycleType">
                                <el-radio :label="0">Deselect</el-radio>
                                <el-radio v-if="dependData.dataSourceRadio==1"
                                    :label="1">Nearly a Weekly</el-radio>
                                <el-radio :label="2">Nearly a Monthly</el-radio>
                                <el-radio :label="3">Nearly 3 Months</el-radio>
                                <el-radio :label="4">Nearly a Half Year</el-radio>
                                <el-radio v-if="dependData.dataSourceRadio==1"
                                    :label="5">Customise In
                                    <el-input v-model="form.cycleDays"
                                        style="width:80px"
                                        size="mini"></el-input> Days</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item prop="rangeValue">
                <div class="item">
                    <label>Select Sharing Range</label>
                    <div>
                        <el-radio-group v-model="form.rangeValue">
                            <el-radio :label="item.id"
                                v-for="item in permissionMap"
                                @change="handle_change_rangeValue"
                                :key="item.id">{{item.label}}</el-radio>
                        </el-radio-group>
                    </div>

                    <div v-if="form.rangeValue==1">
                        <div class="user-area">
                            <span class="sub-title"
                                style="display: inline-block;width:100px;">Select Users:</span>

                            <div style="display:inline-block;">
                                <div>
                                    <el-radio-group v-model="form.logic"
                                        @change="handle_change_logic">
                                        <el-radio :label="1">In</el-radio>
                                        <el-radio :label="0">Not in</el-radio>
                                    </el-radio-group>
                                </div>
                                <el-select v-model="form.rangeUsers"
                                    style="width:250px;"
                                    multiple
                                    collapse-tags
                                    filterable
                                    size="mini"
                                    placeholder="">
                                    <el-option v-for="item in userOptions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <div style="max-height: 120px;max-width: 80%; overflow: auto;">
                                    <el-tag v-for="(userId,index) in form.rangeUsers"
                                        :key="index"
                                        closable
                                        @close="handle_close_tag(userId)"
                                        type="">
                                        {{getTagName(userId)}}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>

            <el-form-item>
                <div class="btn">
                    <el-button size="small"
                        @click="handle_back()">
                        Back
                    </el-button>
                    <el-button size="small"
                        type="primary"
                        @click="handle_save">
                        Save
                    </el-button>
                    <el-button v-if="operateType=='edit'"
                        size="small"
                        type="primary"
                        @click="handle_save_as">
                        Save As
                    </el-button>
                    <el-button size="small"
                        @click="handle_cancel">
                        Cancel
                    </el-button>
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "Remplate-Configuration",
  components: {},
  props: {
    params: {
      type: Object
      //   require: true
    },
    values: {
      type: Object
    },
    dependData: {
      type: Object
    }
  },

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
    let validateCycleType = (rule, value, callback) => {
      if (value == 5) {
        if (!this.form.cycleDays) {
          callback(new Error("Please Enter Days"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    let validateRangeValue = (rule, value, callback) => {
      if (this.form.rangeValue == 1) {
        if (this.form.rangeUsers.length > 0) {
          callback();
        } else {
          callback(new Error("Please Select Users"));
        }
      } else {
        callback();
      }
    };

    return {
      form: {
        name: "",
        cycleType: 0,
        cycleDays: "",
        logic: 1, // 1 in  0 not in
        rangeValue: 1,
        rangeUsers: []
      },

      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        cycleType: [{ validator: validateCycleType, trigger: "change" }],
        rangeValue: [{ validator: validateRangeValue, trigger: "change" }]
      },
      userOptions: [],

      operateType: ""
    };
  },

  computed: {
    ...mapState("reportCenter", ["permissionMap"]),
    rangeValue() {
      return this.form.rangeValue;
    },

    getDate() {
      let start = `${moment(this.dependData.cycle.start).format("YYYY/MM/DD")}`;

      let end = this.dependData.cycle.end ? `${moment(this.dependData.cycle.end).format("YYYY/MM/DD")}` : "Today";
      return start + "~" + end;
    }
  },

  watch: {
    rangeValue(val) {
      if (val == 2) {
        this.getUsers();
      }
    }
  },

  methods: {
    ...mapActions("reportCenter", ["fetch_custome_report_save_template_configuration", "fetch_custome_report_template_users"]),

    init() {
      this.form.name = this.values.name || "";
      this.form.cycleType = this.values.cycleType || 0;
      this.form.cycleDays = this.values.cycleDays || "";

      this.form.rangeValue = this.values.rangeValue != undefined ? this.values.rangeValue : this.permissionMap[2].id; //Only MySelf
      this.form.logic = this.values.logic != undefined ? this.values.logic : this.form.logic;
      this.form.rangeUsers = this.values.rangeUsers || [];

      if (this.$route.query.type == "edit") {
        this.operateType = "edit";
      } else if (this.$route.query.type == "add") {
        this.operateType = "add";
      }

      //通过dataSourceRadio判断，cycleType的值
      if (this.dependData.dataSourceRadio == 2) {
        //如果之前选中的1里，切换到2后，没有那个选项了，则需要清空选定的值
        if (this.form.cycleType == "1" || this.form.cycleType == "5") {
          this.form.cycleType = 0;
          this.form.cycleDays = "";
        }
      }

      if (this.form.rangeValue == 1) {
        this.getUsers();
      }
    },

    getUsers() {
      //获取 users的 列表
      this.fetch_custome_report_template_users()
        .then(res => {
          this.userOptions = res;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handle_change_rangeValue() {
      this.userOptions = [];
      this.form.rangeUsers = [];
      if (this.form.rangeValue == 1) {
        this.form.rangeValue = 1;
        this.getUsers();
      }
    },
    handle_change_logic() {
      this.form.rangeUsers = [];
      this.userOptions = [];
      this.getUsers();
    },

    getTagName(id) {
      let result = this.userOptions.find(item => {
        return item.id == id;
      });

      if (result) {
        return result.name;
      } else {
        return "";
      }
    },
    handle_close_tag(id) {
      this.form.rangeUsers = this.form.rangeUsers.filter(item => {
        return item != id;
      });
    },

    handle_clear_cycle() {
      this.form.cycleType = "";
      this.form.cycleDays = "";
    },

    handle_back() {
      let params = _.cloneDeep(this.form);
      this.$emit("step-one", { step2: params });
    },
    handle_save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.form);
          this.$emit("save-report", { step2: params, type: "save" });
        }
      });
    },
    handle_save_as() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.form);
          this.$emit("save-report", { step2: params, type: "saveAs" });
        }
      });
    },

    handle_cancel() {
      this.$confirm("Are you sure to abandon this report configuration?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.$router.push({
              name: "customReport"
            });
          }
        }
      });
    }
  },

  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.template-configuration {
  display: flex;
  flex-direction: column;

  flex: 1;
  .item {
    & > label {
      font-weight: bold;
      color: #333333;
    }
    line-height: 25px;

    & ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    .user-area {
      display: flex;
    }

    .sub-title {
      color: #606266;
      font-size: 14px;
    }

    .el-tag {
      margin: 5px 10px 5px 5px;
    }
  }

  .el-form {
    flex: 1;
  }
}

.list-move {
  transition: all 0.5s;
}
</style>