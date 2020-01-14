<template>
  <div class="format-create" v-loading.fullscreen="isloading">
    <el-form
      ref="format_form"
      :model="form"
      label-width="80px"
      label-position="top"
      :rules="rules"
      :inline="true"
      size="mini"
    >
      <el-form-item class="formItem" prop="name">
        <label>Format Name:</label>
        <el-input v-model="form.name" style="width: 240px" placeholder="format name"></el-input>
      </el-form-item>
      <el-form-item class="formItem" style="width:310px" prop="client">
        <label>Select Range:</label>
        <el-select
          v-model="form_client_label"
          filterable
          multiple
          @remove-tag="handle_remove_tag"
          placeholder="select client"
           style="width: 240px"
        >
          <el-option value :disabled="true">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >All Clients</el-checkbox>
          </el-option>
          <!-- 下拉复选，区分全部和个别 -->
          <el-checkbox-group v-model="form.client" @change="handleCheckedClientChange">
            <el-option
              v-for="(item,index) in clientOptions"
              :key="index"
              :disabled="true"
              :label="item.label"
              :value="item.value"
            >
              <el-checkbox :label="item.value">{{item.label}}</el-checkbox>
            </el-option>
          </el-checkbox-group>
        </el-select>
        <span style="margin: 0 10px;">except</span>
      </el-form-item>
      <el-form-item class="formItem" style="width:310px">
        <label style="visibility:hidden">except</label>
        <el-select
          v-model="form.except_client"
          filterable
          :disabled="!checkAll"
          @change="handle_change_except_client"
          placeholder="select except client"
           style="width: 240px"
        >
          <el-option
            v-for="(item,index) in clientOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            <el-radio v-model="form.except_client" :label="item.value">{{item.label}}</el-radio>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="create-format formItem">
        <label>Create Format:</label>
        <div class="tools">
          <el-button type="primary" icon="iconfont mas-add" plain @click="handle_add_normal_field"></el-button>
          <el-button
            type="primary"
            icon="iconfont mas-function"
            plain
            @click="handle_add_formula_field"
          ></el-button>
          <el-button
            type="primary"
            icon="iconfont mas-calander"
            plain
            @click="handle_add_extract_field"
          ></el-button>
          <el-button
            type="primary"
            icon="iconfont mas-relate"
            plain
            @click="handle_add_connect_field"
          ></el-button>

          <el-upload
            class="upload-demo"
            style="float: right"
            :show-file-list="false"
            action="api/source/competitors_spending_upload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            @on-success="handle_upload_success" 
            @before-upload="handle_before_upload">
            <el-button
              type="primary"
              title="upload format"
              icon="iconfont mas-upload"
              plain
            ></el-button>
          </el-upload>
        </div>
        <div class="field-warp">
          <draggable
            style="height:100%"
            class="grag-warp"
            v-model="form.fields"
            v-bind="dragOptions"
            @change="drag_change"
            @start="isDrag = true"
            @end="isDrag = false"
          >
            <FormatField
              v-for="item in form_fields_list"
              :key="item.id"
              :data="item"
              @update_field="drag_update_field"
              @change-label="drag_change_field_label"
              @change-type="drag_change_field_type"
              @change-required="drag_change_field_required"
              @change-reportForm="drag_change_field_reportForm"
              @first="drag_move_first"
              @prev="drag_move_prev"
              @next="drag_move_next"
              @last="drag_move_last"
              @delete="drag_delete_field"
            ></FormatField>
          </draggable>
        </div>
      </el-form-item>

      <el-form-item class="linkage-relation formItem">
        <label>Hierarchical Structure:</label>
        <main v-if="form.relations.length > 0">
          <div v-for="(item, index) in form.relations" :key="index" class="relation-container">
            <RelationContent :data="item" @update_relation="update_relation"></RelationContent>
            <span
              class="iconfont mas-add"
              v-show="index === form.relations.length - 1"
              @click="handle_add_relation"
            ></span>
          </div>
        </main>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-checkbox v-model="form.auto_number">The system auto matically numbers the table line.</el-checkbox>
      </el-form-item>

      <el-form-item class="formItem">
        <el-button type="primary" @click="onSubmit_form('format_form')">Submit</el-button>
        <el-button @click="handle_cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
    <FormulaDialog ref="formula_dialog" @add_formula_field="add_formula_field"></FormulaDialog>
    <ExtractDialog ref="extract_dialog" @add_extract_field="add_extract_field"></ExtractDialog>
    <ConnectDialog ref="connect_dialog" @add_connect_field="add_connect_field"></ConnectDialog>
  </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import draggable from "vuedraggable";
import FormatField from "./components/format-field";
import FormulaDialog from "./components/formula-dialog";
import ExtractDialog from "./components/extract-dialog";
import ConnectDialog from "./components/connect-dialog";
import RelationContent from "./components/relation-content";

export default {
  name: "containerName",
  components: {
    draggable,
    FormatField,
    FormulaDialog,
    ExtractDialog,
    ConnectDialog,
    RelationContent
  },
  data() {
    return {
      isloading: false,
      form: {
        name: "",
        client: [],
        except_client: "",
        fields: [
          {
            createTime: 1577778114672,
            label: "test1",
            location: "",
            field_type: "Text",
            type: "normal",
            required: false,
            to_report_form: true
          },
          {
            createTime: 1577778118025,
            label: "test2",
            location: "",
            field_type: "Date&Time",
            type: "normal",
            required: false,
            to_report_form: true
          },
          {
            createTime: 1577778120122,
            label: "test3",
            location: "",
            field_type: "Year",
            type: "normal",
            required: false,
            to_report_form: true
          }
        ],
        relations: [
          {
            value: "",
            label: '',
            result: [],
            createTime: new Date().getTime()
          }
        ],
        auto_number: true
      },
      rules: {
        name: [{ required: true, message: "", trigger: "blur" }],
        client: [{ required: true, message: "", trigger: "blur" }]
      },
      form_client_label: [],
      form_except_client_label: [],
      clientOptions: [],
      isIndeterminate: false,
      checkAll: false,

      dragOptions: {
        animation: 500,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      isDrag: false
    };
  },
  computed: {
    ...mapState("dataSource/formatSetting", [
      "field_type_list",
      "form_fields_list"
    ])
  },
  methods: {
    ...mapActions("home", ["fetch_filter_list"]),
    ...mapActions("dataSource/formatSetting", [
      "update_form_fields_list",
      "update_format_create"
    ]),
    handle_change_except_client(value) {
      console.log(this.form, 11);
    },

    handleCheckAllChange(val) {
      if (val && this.clientOptions.length > 0) {
        this.clientOptions.forEach(item => {
          if (this.form.client.indexOf(item.value) < 0) {
            this.form.client.push(item.value);
            this.form_client_label.push(item.label);
          }
        });
      } else {
        this.form.client = [];
        this.form_client_label = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedClientChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.clientOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.clientOptions.length;

      if (checkedCount) {
        this.form_client_label = [];
        value.forEach(valueItem => {
          this.clientOptions.forEach(clientItem => {
            if (valueItem == clientItem.value) {
              this.form_client_label.push(clientItem.label);
            }
          });
        });
      } else {
        this.form_client_label = [];
      }
    },
    handle_remove_tag(param) {
      const index = this.clientOptions.findIndex(obj => {
        return obj.label === param;
      });
      const value = this.clientOptions[index].value;
      const clientIndex = this.form.client.findIndex(client => {
        return (client = value);
      });
      this.form.client.splice(index, 1);
      this.handleCheckedClientChange(this.form.client);
    },
    //   新建field
    handle_add_normal_field() {
      const param = {
        createTime: new Date().getTime(),
        label: "field label",
        location: "",
        field_type: "Text",
        type: "normal",
        required: false,
        to_report_form: true
      };
      this.form.fields.push(param);
      this.drag_change();
    },
    handle_add_formula_field() {
      //   console.log('新建函数关系field')
      this.$refs.formula_dialog.dialog_show();
    },
    handle_add_extract_field() {
      //   console.log('新建提取关系field')
      this.$refs.extract_dialog.dialog_show();
    },
    handle_add_connect_field() {
      //   console.log('新建映射关系field')
      this.$refs.connect_dialog.dialog_show();
    },
    handle_upload_success(res, fiels) {
      this.isloading = false
      console.log(field, 11)
    },
    handle_before_upload() {
      this.isloading = true
      console.log(field,22)
    },

    add_formula_field(param) {
      this.form.fields.push(param);
      this.drag_change();
    },
    add_extract_field(param) {
      this.form.fields.push(param);
      this.drag_change();
    },
    add_connect_field(param) {
      this.form.fields.push(param);
      this.drag_change();
    },
    //   移动排序
    drag_change() {
      const fields = _.cloneDeep(this.form.fields);
      this.format_form_fields(fields);
    },
    format_form_fields(fields) {
      let count = 65;
      for (let i = 0; i < fields.length; i++) {
        let x = i / 26;
        if (x >= 1) {
          x = Math.floor(x);
          fields[i].location = String.fromCharCode(x + 64, i - x * 26 + 65);
        } else {
          fields[i].location = String.fromCharCode(65 + i);
        }
      }
      this.form.fields = fields;
      this.update_form_fields_list(_.cloneDeep(this.form.fields));
    },
    //   formula-field操作
    find_index(time) {
      const index = this.form.fields.findIndex(obj => {
        return obj.createTime === time;
      });
      return index;
    },
    drag_update_field(param) {
      const index = this.find_index(param.createTime);

      if (index >= 0) {
        this.form.fields[index] = param;
      }
      this.update_form_fields_list(_.cloneDeep(this.form.fields));
    },
    drag_change_field_label(param) {
      const index = this.find_index(param.createTime);
      if (index >= 0) {
        this.form.fields[index].label = param.label;
      }

      this.update_form_fields_list(_.cloneDeep(this.form.fields));
    },
    drag_change_field_type(param) {
      const index = this.find_index(param.createTime);
      if (index >= 0) {
        this.form.fields[index].field_type = param.field_type;
      }

      this.update_form_fields_list(_.cloneDeep(this.form.fields));
    },
    drag_change_field_required(param) {
      const index = this.find_index(param.createTime);
      if (index >= 0) {
        this.form.fields[index].required = param.required;
      }

      this.update_form_fields_list(_.cloneDeep(this.form.fields));
    },
    drag_change_field_reportForm(param) {
      const index = this.find_index(param.createTime);
      if (index >= 0) {
        this.form.fields[index].to_report_form = param.to_report_form;
      }

      this.update_form_fields_list(_.cloneDeep(this.form.fields));
    },
    drag_move_first(time) {
      const index = this.find_index(time);
      if (index > 0) {
        const tmpField = this.form.fields[index];
        this.form.fields.splice(index, 1);
        this.form.fields.unshift(tmpField);
        this.drag_change();
      }
    },
    drag_move_prev(time) {
      const index = this.find_index(time);
      if (index > 0) {
        const tmpField = this.form.fields[index - 1];
        this.form.fields.splice(index - 1, 1);
        this.form.fields.splice(index, 0, tmpField);
        this.drag_change();
      }
    },
    drag_move_next(time) {
      const index = this.find_index(time);
      if (index < this.form.fields.length - 1) {
        const tmpField = this.form.fields[index + 1];
        this.form.fields.splice(index + 1, 1);
        this.form.fields.splice(index, 0, tmpField);
        this.drag_change();
      }
    },
    drag_move_last(time) {
      const index = this.find_index(time);
      if (index < this.form.fields.length - 1) {
        const tmpField = this.form.fields[index];
        this.form.fields.splice(index, 1);
        this.form.fields.push(tmpField);
        this.drag_change();
      }
    },
    drag_delete_field(time) {
      this.$confirm("Are you sure to Delete?", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        closeOnClickModal: false,
        type: "warning",
        callback: action => {
          if (action == "confirm") {
            this.form.fields = this.form.fields.filter(item => {
              return item.createTime != time;
            });

            this.drag_change();
          }
        }
      });
    },
    // relation
    handle_add_relation() {
      const param = {
        value: "",
        label: "",
        result: [],
        createTime: new Date().getTime()
      };
      this.form.relations.push(param);
    },
    update_relation(param) {
      const index = this.form.relations.findIndex(obj => {
        return obj.createTime === param.createTime;
      });

      if (index >= 0) {
        this.form.relations[index] = param;
      }
    },
    validate(text) {
      const reg = /^[A-Z]+[A-Z\>]+[A-Z]+$/;
      return reg.test(text);
    },
    // 表单提交、取消

    onSubmit_form(formName) {
      let result = [];
      this.form.relations.forEach(item => {
        // 判断关联是否为空且正确
        if (item.value && item.value.length > 0 && this.validate(item.value)) {
          result.push(item);
        }
      });

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isloading = true;
          setTimeout(() => {
            this.isloading = false;
          }, 1000);
          this.form.relations = result;
          // this.$router.push({path: 'list'})
        }
      });

      if (this.form.relations.length === 0) {
        this.form.relations.push({
          value: "",
          result: [],
          createTime: new Date().getTime()
        });
      }
    },
    handle_cancel() {
      this.$confirm(
        "Are you Sure to abandon the data source template configuration?",
        "Tips",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          closeOnClickModal: false,
          type: "warning",
          callback: action => {
            if (action == "confirm") {
              this.$router.push({ path: "list" });
            }
          }
        }
      );
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$confirm(
  //     "Are you Sure to abandon the data source template configuration?",
  //     "Tips",
  //     {
  //       confirmButtonText: "Yes",
  //       cancelButtonText: "No",
  //       closeOnClickModal: false,
  //       type: "warning",
  //       callback: action => {
  //         if (action == "confirm") {
  //           next()
  //         } else {
  //           next(false)
  //         }
  //       }
  //     }
  //   );
  // },
  mounted() {
    // 更新format新建状态
    this.update_format_create(true);
    this.fetch_filter_list({ type: "client", value: "" })
      .then(res => {
        this.clientOptions = res;
      })
      .catch(err => {});
    //  新建为空，编辑为接口请求后的数据
    this.update_form_fields_list(_.cloneDeep(this.form.fields));
  }
};
</script>

<style lang="scss" scoped>
.format-create {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  .formItem {
    width: 100%;
    margin: 0;
    label {
      font-size: 14px;
      line-height: 30px;
      display: inline-block;
      width: 100%;
      font-weight: bold;
      color: #333333;
      margin-top: 5px;
    }
  }
  .create-format {
    .tools {
      margin-bottom: 15px;
    }
    .field-warp {
      height: 200px;
      width: 100%;
      background: rgba(242, 242, 242, 1);
      overflow: hidden;
      .ghost {
        opacity: 0.5;
        background: inherit;
      }
      .grag-warp {
        display: flex;
        flex-flow: row;
        align-items: center;
        overflow-x: auto;
        border: 20px solid rgba(242, 242, 242, 1);
        border-top: 0;
        border-bottom: 0;
      }
    }
  }

  .linkage-relation {
    main {
      min-height: 100px;
      background: rgba(242, 242, 242, 1);
      padding: 20px;
      display: flex;
      flex-flow: column;
      .relation-container {
        float: left;
        margin-bottom: 10px;
        span {
          display: inline-block;
          height: 100%;
          line-height: 28px;
          margin-left: 10px;
          color: #0c569d;
        }
        input {
          width: 100%;
        }
      }
    }
  }
}
/deep/.el-select-dropdown {
  .el-checkbox {
    width: 100% !important;
  }
}
/deep/.el-radio {
  .el-radio__inner {
    border-radius: 2px;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    transform: rotate(45deg) scaleY(1);
  }
  .el-radio__inner::after {
    content: "";
    width: 3px;
    height: 7px;
    border-radius: 0;
    background: #04407c;
    box-sizing: content-box;
    border: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    left: 4px;
    position: absolute;
    top: 1px;
  }
}
</style>
