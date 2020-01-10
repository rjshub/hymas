<template>
    <div class="extract-container">
        <el-dialog 
            title="Extract"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="dialog_close"
            width="700px">
            <el-form :rules="rules" :model="form" ref="extractForm" class="demo-form-inline" size='mini'>
                <el-row :gutter="10" style="width:100%;">
                    <el-col :span="4">
                        <el-form-item style="margin-right: 0" prop="field_type">
                            <el-select v-model="form.field_type">
                                <div slot="prefix" style="color:#606266"><i :class="icon_class"></i></div>
                                <el-option
                                    v-for="item in type_list"
                                    :key="item.type"
                                    :label="item.type"
                                    :value="item.type">
                                    <span style="float:left;margin-right:5px;font-size:18px"><i class="iconfont" :class="item.icon"></i></span>
                                    <span style="float:right">{{item.type}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item style="width: 100%" prop="label">
                            <el-input v-model="form.label" placeholder="field name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <span style="line-height: 28px">to extract</span>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item prop="extract">
                            <el-select v-model="form.extract" placeholder="Field">
                                <el-option
                                    v-for="item in extract_list"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <span style="line-height: 28px">from</span>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item style="margin-right: 0" prop="from_extract">
                            <el-select v-model="form.from_extract" placeholder="Field">
                                <el-option
                                    v-for="item in format_fields_list"
                                    :key="item.location"
                                    :label="item.location"
                                    :value="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submit_form('extractForm')">Submit</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'

export default {
  name: "extract-dialog",
  data() {
    return {
        dialogVisible: false,
        isCreate: true,
        rules: {
            label: [
                { required: true, message: "", trigger: 'blur' }
            ],
            field_type: [
                { required: true, message: "", trigger: 'blur' }
            ],
            extract: [
                { required: true, message: "", trigger: 'blur' }
            ],
            from_extract: [
                { required: true, message: "", trigger: 'blur' }
            ]
        },
        form: {
            field_type: 'Year',
            label: '',
            type: 'extract',
            extract: '',
            from_extract: '',
            createTime: '',
            formula: '',
            location: '',
            required: false,
            to_report_form: true
        },
        type_list: [
            {
                type: 'Year',
                icon: 'mas-year'
            },
            {
                type: 'Month',
                icon: 'mas-month'
            },
            {
                type: 'Date',
                icon: 'mas-date'
            },
            {
                type: 'Time',
                icon: 'mas-time'
            }
        ],
        extract_list: [
            'Year',
            'Month',
            'Date',
            'Time'
        ]
    }
  },
  computed: {
      ...mapState('dataSource/formatSetting',[
        'form_fields_list'
      ]),
      icon_class() {
          const index = this.type_list.findIndex(obj => {
              return obj.type === this.form.field_type
          })
          return `iconfont ${this.type_list[index].icon}`
      },
      format_fields_list() { // 只需Date和Date&Time
          let result = []
          const types = ['Date', 'Date&Time']
          this.form_fields_list.forEach(item => {
              if (types.indexOf(item.field_type) >= 0) {
                  result.push(item)
              }
          })

          return result
      }
  },
  methods: {
      dialog_show() {
          this.dialogVisible = true
          this.isCreate = true
      },
      update_extract_field(param) {
          this.form = Object.assign({}, param)
          this.dialogVisible = true
          this.isCreate = false
      },
      dialog_close() {
          this.form = {
            field_type: 'Year',
            label: '',
            type: 'extract',
            extract: '',
            from_extract: '',
            createTime: '',
            formula: '',
            location: '',
            required: false,
            to_report_form: true
          }
      },
      submit_form(formName) {
          this.$refs[formName].validate((valid) => {
          if (valid) {
              this.dialogVisible = false
              this.form.formula = `From : ${this.form.from_extract}`
              if (this.isCreate) {
                this.form.createTime = new Date().getTime()
                this.$emit('add_extract_field', this.form)
              } else {
                this.$emit('update_extract_field', this.form)
              }
              this.dialog_close()
          } else {
              return false
          }
        })
      }
  }
}
</script>

<style lang="scss" scoped>
</style>
