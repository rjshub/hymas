<template>
    <div class="report-configuration"
        v-loading="isLoading"
        element-loading-spinner="iconfont mas-loading">
        <div class="form">
            <el-form ref="form"
                :model="form"
                :rules="rules"
                label-width="20px">
                <el-form-item prop="client">
                    <div class="item">
                        <label>Select Client:</label>
                        <el-select v-model="form.client"
                            size="mini"
                            filterable
                            placeholder="Select Client"
                            style="width:200px;margin-left:10px;">
                            <el-option v-for="(item,index) in clientOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>

                <el-form-item>
                    <div class="item">
                        <label>Select Data Source:</label>
                        <div>
                            <el-radio-group v-model="form.dataSourceRadio"
                                @change="handle_change_datasource">
                                <el-radio label="1"
                                    v-if="permissionPerformance">ELC Performance</el-radio>
                                <el-radio label="2"
                                    v-if="permissionCompetitorsSpending">ELC&amp;Competitors Spending</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item prop="date">
                    <div class="item">
                        <label>Data Cycle:</label>
                        <div>
                            <el-date-picker v-model="form.date.start"
                                align="right"
                                style="width:130px"
                                size="mini"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="Start Date"
                                @change="handle_change_start_date">
                            </el-date-picker>
                            To
                            <el-date-picker v-model="form.date.end"
                                class="end-date"
                                align="right"
                                style="width:130px"
                                type="date"
                                size="mini"
                                value-format="yyyy-MM-dd"
                                placeholder="Today"
                                @change="handle_change_end_date">
                            </el-date-picker>

                        </div>
                    </div>
                </el-form-item>

                <el-form-item prop="fields">
                    <div class="item">
                        <label>Select Report Fields:</label>
                        <div class="field-wrap">
                            <template v-if="form.fields && form.fields.length>0">
                                <draggable v-model="form.fields"
                                    style="height:100%"
                                    v-bind="dragOptions"
                                    @start="isDrag = true"
                                    @end="isDrag = false">
                                    <transition-group tag="div"
                                        class="transition-wrap"
                                        :name="!isDrag ? 'list' : null">
                                        <report-field v-for="(item) in form.fields"
                                            :key="item.id"
                                            :values="item"
                                            :data-source="form.dataSourceRadio"
                                            :cycle="form.date"
                                            @toggleSelect="hanle_toggle_select"
                                            @first="handle_first"
                                            @prev="handle_prev"
                                            @next="handle_next"
                                            @last="handle_last"
                                            @delete="handle_delete"></report-field>
                                        <div :key="getKey"
                                            class="add-when-have"
                                            @click="handle_add_field">
                                            <i class="el-icon-plus"></i>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </template>
                            <template v-else>
                                <div class="add-when-no"
                                    @click="handle_add_field">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </template>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div v-if="$route.query.type=='add'"
                        class="btn">
                        <el-button size="small"
                            @click="handle_preview">
                            Preview
                        </el-button>
                        <el-button size="small"
                            type="primary"
                            @click="handle_save_template">
                            Save As Template
                        </el-button>
                        <el-button size="small"
                            @click="handle_cancel">
                            Cancel
                        </el-button>
                    </div>
                    <div v-if="$route.query.type=='edit'"
                        class="btn">
                        <el-button size="small"
                            @click="handle_preview">
                            Preview
                        </el-button>
                        <el-button size="small"
                            type="primary"
                            @click="handle_direct_save">
                            Save
                        </el-button>
                        <el-button size="small"
                            type="primary"
                            @click="handle_save_template">
                            Next
                        </el-button>
                        <el-button size="small"
                            @click="handle_cancel">
                            Cancel
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>

        <el-dialog title="Please select report fields"
            class="report__add-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            v-if="addDialogVisible"
            :visible.sync="addDialogVisible"
            width="800px"
            @close="handle_dialog_close">

            <el-transfer v-model="dialogValue"
                :filterable="true"
                filter-placeholder="Enter Keywords"
                :filter-method="handle_transfer_filter"
                :titles="['Source', 'Target']"
                :props="{
                  key: 'id',
                  label: 'name',
                  disabled:'disabled'
                }"
                :data="fieldsOptions">
                <template v-slot="{option}">
                    <div v-hover
                        class="text">
                        <span>{{option.name}}</span>
                    </div>
                </template>
            </el-transfer>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button size="mini"
                        @click="handle_dialog_close">Cancel</el-button>
                    <el-button size="mini"
                        type="primary"
                        @click="handle_dialog_submit">Save</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import draggable from "vuedraggable";
import fetch from "@/services/fetch";
import uuidv4 from "uuid/v4";
import reportField from "./report-field";

export default {
  name: "Report-Configuration",
  components: { reportField, draggable },

  props: {
    values: {
      type: Object
    }
  },

  data() {
    let validateDate = (rule, value, callback) => {
      if (!this.form.date.start) {
        callback(new Error("Please Select Start Date"));
        return;
      }

      if (moment(this.form.date.start).isAfter(new Date())) {
        callback(new Error("Start Date cannot be after End Date"));
        return;
      }

      callback();
    };
    let validateFields = (rule, value, callback) => {
      if (value && value.length > 0) {
        callback();
      } else {
        callback(new Error("Please Add Field"));
      }
    };

    return {
      isDrag: false,

      dragOptions: {
        animation: 500,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },

      isLoading: false,
      addDialogVisible: false,

      maxSelectSize: 12,

      dialogValue: [], //dialog中选中的值

      fieldsOptionsClone: [], //添加 field的 列表
      fieldsOptions: [], //添加 field的 列表

      dataSourceRadioPrev: "",
      form: {
        client: "",
        dataSourceRadio: "",
        date: { start: "", end: "" },
        fields: []
      },
      rules: {
        date: [{ validator: validateDate, trigger: "blur" }],
        fields: [{ validator: validateFields, trigger: "blur" }]
      },

      clientOptions: []
    };
  },
  computed: {
    ...mapGetters("dataSource/dataList", ["permissionPerformance", "permissionCompetitorsSpending"]),

    getKey() {
      return new Date().getTime();
    }
  },

  methods: {
    ...mapActions("reportCenter", ["fetch_custome_report_field_list", "fetch_custome_report_save_report_configuration"]),
    ...mapActions("home", ["fetch_filter_list"]),

    async init() {
      try {
        this.isLoading = true;

        //获取client，不需要同步
        this.get_client_list();
        this.form.client = this.$route.query.client || "1";

        if (!this.permissionPerformance) {
          this.form.dataSourceRadio = "2";
          this.dataSourceRadioPrev = "2";
        } else if (!this.permissionCompetitorsSpending) {
          this.form.dataSourceRadio = "1";
          this.dataSourceRadioPrev = "1";
        } else {
          this.form.dataSourceRadio = this.values.dataSourceRadio || "1";
          this.dataSourceRadioPrev = this.values.dataSourceRadio || "1";
        }

        //设置 时间
        this.form.date = this.values.date || this.form.date;

        await this.get_report_field_list();

        if (this.values.fields && this.values.fields.length > 0) {
          this.form.fields = this.values.fields.map(item => {
            let has = this.fieldsOptionsClone.find(i => {
              return i.id == item.field_id;
            });
            if (has) {
              return { ...item, id: has.cache_id };
            } else {
              return { ...item };
            }
          });
        }

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
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

    async get_report_field_list() {
      let res_fields = await this.fetch_custome_report_field_list({ type: this.form.dataSourceRadio });
      this.fieldsOptions = res_fields;
      //此处的cache_id在添加完 field后，成为了field面板的id，不能再添加的时候设置id的原因是，因为在select选择后，和之前的合并时uuidv4()值会变。
      this.fieldsOptionsClone = res_fields.map(item => {
        return { ...item, cache_id: uuidv4() };
      });
    },

    handle_change_datasource(value) {
      let cache = this.dataSourceRadioPrev;
      this.form.dataSourceRadio = cache;

      if (this.dataSourceRadioPrev != value) {
        if (this.form.fields.length != 0) {
          this.$confirm("Are you sure to switch the data source?Your fields configuration will be cleared.", "Tips", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            closeOnClickModal: false,
            type: "warning",
            callback: action => {
              if (action == "confirm") {
                this.dataSourceRadioPrev = value;
                this.form.dataSourceRadio = value;
                this.form.fields = [];
                this.get_report_field_list();
              }
            }
          });
        } else {
          this.dataSourceRadioPrev = value;
          this.form.dataSourceRadio = value;
          this.form.fields = [];
          this.get_report_field_list();
        }
      }
    },

    handle_change_start_date() {
      this.$refs["form"].validateField("date");
    },
    handle_change_end_date() {
      this.$refs["form"].validateField("date");
    },

    handle_add_field() {
      this.addDialogVisible = true;

      //当删除面板时，会重新计算已经勾选的select 选项并更新
      this.dialogValue = this.form.fields.map(item => {
        return item.field_id;
      });

      this.fieldsOptions = this.fieldsOptionsClone.map(item => {
        let result = this.form.fields.filter(i => {
          return i.field_id == item.id;
        });
        if (result.length == 0) {
          return { ...item, disabled: false };
        } else {
          return { ...item, disabled: true };
        }
      });
    },

    handle_dialog_close() {
      this.addDialogVisible = false;
    },
    handle_dialog_submit() {
      //新增的元素
      let add_list = this.fieldsOptions
        .filter(item => {
          let has = this.dialogValue.find(i => {
            return i == item.id;
          });

          if (has) {
            return true;
          } else {
            return false;
          }
        })
        .map(item => {
          //此时 cache_id成为了 field面板的id
          return {
            id: item.cache_id,
            field_id: item.id,
            field_name: item.name,
            list: [],
            sort: "desc",
            isSelect: item.isSelect,
            isTotal: item.isTotal,
            hasSubordinate: item.hasSubordinate
          };
        });

      //合并去重
      this.form.fields = _.uniqBy(_.concat(this.form.fields, add_list), "id"); //按照id字段去重
      this.$refs["form"].validateField("fields");

      this.addDialogVisible = false;
    },

    hanle_toggle_select(id) {
      let selectedSize = 0;

      let selectedItems = this.form.fields.filter(item => {
        return item.isSelect == "1";
      });

      if (selectedItems) {
        selectedSize = selectedItems.length;
      }

      for (let item of this.form.fields) {
        if (item.id == id) {
          if (item.isSelect == 1) {
            item.isSelect = 0;
          } else {
            if (selectedSize < this.maxSelectSize) {
              item.isSelect = 1;
            } else {
              this.$message.warning("No more than 12 Select box.");
            }
          }
        }
      }
    },

    //排序到第一个
    handle_first(id) {
      let index = 0;
      for (let i in this.form.fields) {
        if (this.form.fields[i].id == id) {
          index = Number(i);
        }
      }

      if (index > 0) {
        let jtem = this.form.fields[index]; //先取出目标
        this.form.fields.splice(index, 1); //在index 位置删除一个
        this.form.fields.unshift(jtem); //插入至头部
      }
    },
    handle_prev(id) {
      let index = 0;
      for (let i in this.form.fields) {
        if (this.form.fields[i].id == id) {
          index = Number(i);
        }
      }

      if (index > 0) {
        let jtem = this.form.fields[index - 1]; //先取出前目标
        this.form.fields.splice(index - 1, 1); //在index-1 位置删除一个
        this.form.fields.splice(index, 0, jtem); //在index-1 位置添加一个
      }
    },
    handle_next(id) {
      let index = 0;
      for (let i in this.form.fields) {
        if (this.form.fields[i].id == id) {
          index = Number(i);
        }
      }

      if (index + 1 < this.form.fields.length) {
        let jtem = this.form.fields[index + 1]; //先取出前目标
        this.form.fields.splice(index + 1, 1); //在index+1 位置删除一个
        this.form.fields.splice(index, 0, jtem); //在index-1 位置添加一个
      }
    },
    handle_last(id) {
      let index = 0;
      for (let i in this.form.fields) {
        if (this.form.fields[i].id == id) {
          index = Number(i);
        }
      }

      if (index + 1 < this.form.fields.length) {
        let jtem = this.form.fields[index]; //先取出目标
        this.form.fields.splice(index, 1); //在index 位置删除一个
        this.form.fields.push(jtem); //插入至头部
      }
    },

    handle_delete(id) {
      this.$confirm("Are you sure to Delete?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.form.fields = this.form.fields.filter(item => {
              return item.id != id;
            });

            this.$refs["form"].validateField("fields");
          }
        }
      });
    },
    //验证 第二层的list是否为空选项
    validateSecondary() {
      let result = this.form.fields.filter(item => {
        return item.list.length == 0;
      });

      if (result && result.length == 0) {
        //全部都有值
        return { hasEmpty: false };
      } else {
        //有一部分没值
        return { hasEmpty: true };
      }
    },

    handle_preview() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.form);

          if (this.validateSecondary().hasEmpty) {
            this.$confirm("You have not select secondary fields,the system will select them all by default", "Tips", {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              closeOnClickModal: false,
              type: "warning",
              callback: action => {
                if (action == "confirm") {
                  this.$emit("preview", { step1: params });
                }
              }
            });
          } else {
            this.$emit("preview", { step1: params });
          }
        }
      });
    },

    handle_save_template() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.form);

          if (this.validateSecondary().hasEmpty) {
            this.$confirm("You have not select secondary fields,the system will select them all by default", "Tips", {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              closeOnClickModal: false,
              type: "warning",
              callback: action => {
                if (action == "confirm") {
                  this.$emit("step-two", { step1: params });
                }
              }
            });
          } else {
            this.$emit("step-two", { step1: params });
          }
        }
      });
    },

    handle_direct_save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.form);

          if (this.validateSecondary().hasEmpty) {
            this.$confirm("You have not select secondary fields,the system will select them all by default", "Tips", {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              closeOnClickModal: false,
              type: "warning",
              callback: action => {
                if (action == "confirm") {
                  this.$emit("save-report", { step1: params, type: "save" });
                }
              }
            });
          } else {
            this.$emit("save-report", { step1: params });
          }
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
          if (action == "cancel") {
            this.isCovered = false;
          }
        }
      });
    },

    handle_transfer_filter(query, item) {
      let name = item.name.toUpperCase();
      let keyword = query.toUpperCase();
      return name.indexOf(keyword) > -1;
    }
  },

  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.report-configuration {
  display: flex;
  flex-direction: column;

  flex: 1;
  .item {
    & > label {
      font-weight: bold;
      color: #333333;
    }
    line-height: 20px;

    & ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::v-deep .end-date {
      input::placeholder {
        color: #606266;
      }
    }

    .transition-wrap {
      height: 100%;
    }
    .field-wrap {
      box-sizing: border-box;
      padding: 10px;
      background-color: #f3f3f3;
      height: 350px;
      overflow: auto;
      overflow-y: hidden;
      white-space: nowrap;

      .add-when-no {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 190px;
        min-width: 190px;
        background-color: white;
        color: #757575;
        text-align: center;
        border: 1px solid #dfdfdf;
        font-size: 49px;
        cursor: pointer;
      }
      .add-when-have {
        position: relative;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        width: 45px;
        min-width: 45px;
        border: 1px solid #dfdfdf;
        background-color: white;
        color: #757575;
        text-align: center;
        margin-right: 10px;
        cursor: pointer;
        vertical-align: top;
      }
    }
  }
  .form {
    flex: 1;
  }

  .report__add-dialog {
    ::v-deep .el-dialog__body {
      .el-transfer {
        .el-transfer-panel {
          width: 330px;

          .el-transfer-panel__item {
            box-sizing: border-box;
            width: 100%;
            margin: 0;

            .text {
              font-size: 14px;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}

.list-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.5;
  background: inherit;
}

.sortable-chosen {
  cursor: move !important;
}
</style>