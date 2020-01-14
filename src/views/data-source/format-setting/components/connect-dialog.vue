<template>
  <div class="connct-container">
    <el-dialog
      title="Connect"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="dialog_close"
      width="800px"
    >
      <el-form :rules="rules" :model="form" ref="connectForm" class="demo-form-inline" size="mini">
        <el-row :gutter="10" style="width:100%;">
          <el-col :span="4">
            <el-form-item style="margin-right: 0" prop="field_type">
              <el-select v-model="form.field_type">
                <div slot="prefix" style="color:#606266">
                  <i :class="icon_class"></i>
                </div>
                <el-option
                  v-for="item in field_type_list"
                  :key="item.type"
                  :label="item.type"
                  :value="item.type"
                >
                  <span style="float:left;margin-right:5px;font-size:18px">
                    <i class="iconfont" :class="item.icon"></i>
                  </span>
                  <span style="float:right">{{item.type}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item style="width: 100%" prop="label">
              <el-input v-model="form.label" placeholder="field name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="display:flex;align-items:center">
            <span style="margin: 0 5px 18px 0">=</span>
            <el-form-item style="margin-right: 0;flex:1" prop="connect_field">
              <el-select v-model="form.connect_field" placeholder="Field">
                <el-option
                  v-for="item in form_fields_list"
                  :key="item.location"
                  :label="item.location"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <i style="margin: 0 0 18px 5px" class="iconfont mas-type-connect">(</i>
          </el-col>
          <el-col :span="4">
            <el-form-item
              style="margin-right: 0"
              prop="connect_table_by"
              :title="form.connect_table_by"
            >
              <el-select v-model="form.connect_table_by" placeholder="Field">
                <el-option
                  v-for="item in connect_table"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="display:flex;align-items:center">
            <el-form-item
              style="margin-right: 0;flex:1"
              prop="connect_field_by"
              :title="form.connect_field_by"
            >
              <el-select v-model="form.connect_field_by" placeholder="Field">
                <el-option
                  v-for="item in connect_field"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <span style="margin: 0 0 18px 5px">get</span>
          </el-col>
          <el-col :span="4" style="display:flex;align-items:center">
            <el-form-item
              style="margin-right: 0;flex:1"
              prop="connect_target_field"
              :title="form.connect_field_by"
            >
              <el-select v-model="form.connect_target_field" placeholder="Field">
                <el-option
                  v-for="item in connect_field"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <span style="margin: 0 0 18px 5px">)</span>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submit_form('connectForm')">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from "vuex";

export default {
  name: "connect-dialog",
  data() {
    return {
      dialogVisible: false,
      isCreate: true,

      form: {
        field_type: "Text",
        type: "connect",
        label: "",
        connect_field: "",
        connect_table_by: "",
        connect_field_by: "",
        connect_target_field: "",
        location: "",
        createTime: "",
        formula: "",
        required: false,
        to_report_form: true
      },
      rules: {
        label: [{ required: true, message: "", trigger: "blur" }],
        field_type: [{ required: true, message: "", trigger: "blur" }],
        connect_field: [{ required: true, message: "", trigger: "blur" }],
        connect_table_by: [{ required: true, message: "", trigger: "blur" }],
        connect_field_by: [{ required: true, message: "", trigger: "blur" }],
        connect_target_field: [{ required: true, message: "", trigger: "blur" }]
      },
      connect_table: [
        {
          id: 1,
          label: "表格1"
        },
        {
          id: 2,
          label: "表格2"
        }
      ],
      connect_field: [
        {
          id: 1,
          label: "字段名称1"
        },
        {
          id: 2,
          label: "字段名称2"
        }
      ]
    };
  },
  computed: {
    ...mapState("dataSource/formatSetting", [
      "field_type_list",
      "form_fields_list"
    ]),
    icon_class() {
      const index = this.field_type_list.findIndex(obj => {
        return obj.type === this.form.field_type;
      });
      return `iconfont ${this.field_type_list[index].icon}`;
    }
  },
  methods: {
    dialog_show() {
      this.dialogVisible = true;
      this.isCreate = true;
    },
    update_connect_field(param) {
      this.form = Object.assign({}, param);
      this.dialogVisible = true;
      this.isCreate = false;
    },
    dialog_close() {
      this.form = {
        field_type: "Text",
        type: "connect",
        label: "",
        connect_field: "",
        connect_table_by: "",
        connect_field_by: "",
        connect_target_field: "",
        location: "",
        createTime: "",
        formula: "",
        required: false,
        to_report_form: true
      };
    },
    submit_form(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.form.formula = `Connect: Mapping table ${this.form.connect_table_by}`;
          if (this.isCreate) {
            this.form.createTime = new Date().getTime();
            this.$emit("add_connect_field", this.form);
          } else {
            this.$emit("update_connect_field", this.form);
          }
          this.dialog_close();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
