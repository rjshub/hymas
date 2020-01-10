<template>
    <div id="formula-container">
        <el-dialog
            title="Formula"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="dialog_close"
            width="600px">
            <el-form :rules="rule" :model="form" ref="form" class="demo-form-inline" size='mini'>
                <el-row :gutter="10" style="width:100%;">
                    <el-col :span="5">
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
                    <el-col :span="19">
                        <el-form-item style="width: 100%" prop="label">
                            <el-input v-model="form.label" placeholder="field name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10" style="width: 100%">
                    <el-col :span="5">
                        <el-row :gutter="33" style="margin-bottom: 15px">
                            <el-col :span="12">
                                <el-button size="small" @click="formulaSymbol('+',1)">+</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button size="small" @click="formulaSymbol('-',1)">-</el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="33" style="margin-bottom: 15px">
                            <el-col :span="12">
                                <el-button size="small" @click="formulaSymbol('*',1)">*</el-button>
                            </el-col>
                            <el-col :span=12>
                                <el-button size="small" @click="formulaSymbol('/',1)">/</el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="33" style="margin-bottom: 15px">
                            <el-col :span="12">
                                <el-button size="small" @click="formulaSymbol('(',2)">(</el-button>
                            </el-col>
                            <el-col :span=12>
                                <el-button size="small" @click="formulaSymbol(')',2)">)</el-button>
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 15px">
                            <el-col>
                                <el-button size="small" @click="formulaField()">field</el-button>
                            </el-col>
                        </el-row>

                    </el-col>
                    <el-col :span="19">
                        <div class="formula_tag_box">
                            <div class="main">
                                <div v-for="tag in tags" :key="tag.times" class="formula_tag_item">
                                    <el-tag v-if="tag.label === '='" color="unset" style="border: unset">{{tag.label}}</el-tag>
                                    <el-tag v-else class="formulaTag" :class="tag.field? 'isFieldTag':''" 
                                        closable type="primary" @close="handleClose(tag)">
                                        <el-select v-model="tag.name" filterable placeholder="field" v-if="tag.field"> 
                                            <el-option
                                                v-for="item in form_fields_list"
                                                :key="item.location"
                                                :label="item.location"
                                                :value="item.label">
                                            </el-option>
                                        </el-select>
                                        <span v-else>{{tag.label}}</span>
                                    </el-tag>
                                </div>
                            </div>
                            <div class="footer">
                                <el-button size="small" :disabled="tags.length === 1" @click="clear_tags">Clear</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="submit_form('form')">Submit</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'

export default {
  name: "formula-dialog",
  data() {
    return {
        dialogVisible: false,
        type_list: [
            {
                type: 'Float',
                icon: 'mas-decimal'
            },
            {
                type: 'Int',
                icon: 'mas-integer'
            },
            {
                type: 'Percent',
                icon: 'mas-percent'
            }
        ],
        form: {
            field_type: 'Float',
            label: '',
            createTime: '',
            type: 'formula',
            location: '',
            formula: '',
            required: false,
            to_report_form: true
        },
        rule: {
            label: [
                { required: true, message: "", trigger: 'blur' }
            ],
            field_type: [
                { required: true, message: "", trigger: 'blur' }
            ]
        },
        isCreate: true,

        tags: [
            {
                label: '=',
                name: '=',
                time: new Date().getTime()
            }
        ],
        dBExpress:[],
        uIExpress:[],
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
      }
  },
  methods: {
      dialog_show() {
          this.dialogVisible = true
          this.isCreate = true
      },
      update_formula_field(param) {
          this.dialogVisible = true
          this.isCreate = false
          this.form = Object.assign({}, param)
          this.tags = this.tags.concat(this.format_formula_toArray(this.form.formula))
      },
      format_formula_toArray(param) {
          const sybols = ['+','-','*','/']
          let tmp = param.split('=')
          let tmpTags = tmp[1].trim().split(' ')
          let result = []
          tmpTags.forEach((item, index) => {
            // this.dBExpress.push(item)
            if (sybols.indexOf(item) >= 0) {
              result.push(
                {
                  label: item,
                  name: item,
                  field: false,
                  type: 1,
                  times: new Date().getTime() + index
                }
              )
            } else if (item === '(' || item === ')') {
              result.push(
                {
                  label: item,
                  name: item,
                  field: false,
                  tyoe: 2,
                  times: new Date().getTime() + index
                }
              )
            } else {
              result.push(
                {
                  name: item, 
                  field: true,
                  times: new Date().getTime() + index
                }
              )
            }
          })
          return result
      },
      dialog_close() {
          this.tags = [
              {
                  label: '=',
                  name: '=',
                  time: new Date().getTime()
              }
          ]
          this.form = {
            field_type: 'Float',
            label: '',
            createTime: '',
            type: 'formula',
            location: '',
            formula: '',
            required: false,
            to_report_form: true
          }
      },
      submit_form(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.validateFormula()) {
              this.form.formula = this.format_formula_toString()
              this.dialogVisible = false
              if (this.isCreate) {
                this.form.createTime = new Date().getTime()
                this.$emit('add_formula_field', this.form)
              } else {
                this.$emit('update_formula_field', this.form)
              }
              
          } else {
              return false
          }
        })
      },
      format_formula_toString() {
          let formula = this.form.label
          this.tags.forEach(item => {
              formula += ' ' + item.name
          })

          return formula
      },
      clear_tags() {
          this.$confirm("Are you sure to delete all settings?", "Tips", {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              closeOnClickModal: false,
              type: "warning",
              callback: action => {
                if (action == "confirm") {
                    this.dialog_close()
                }
              }
          })
      },
    //   编辑公式
      formulaSymbol(param,type){
          if (type===1){ //现在是符号上一个不能是符号
            if (this.tags.length === 1) { //第一个就是符号
              this.$message.warning({
                message: 'Rules do not meet the requirements!'
              })
              return
            }else {
             let tagType = this.tags[this.tags.length-1].type
                if (type === tagType){
                  this.$message.warning({
                    message: 'Rules do not meet the requirements!'
                  })
                  return
                }
            }
          }
  
          let  tag={
            label:param,
            name:param,
            field: false,
            type:type,
            times:new Date().getTime()
          }
          this.tags.push(tag)  //tab标签显示
      },
      formulaField () {
        if (this.tags[this.tags.length - 1].field) {
          this.$message.warning({
            message: 'Rules do not meet the requirements!'
          })
        } else {
          let tag={
            name:'',
            field: true,
            times:new Date().getTime()
          }
          this.tags.push(tag)  //tab标签显示
        }
      },
      //验证公式是否符合规则
      validateFormula () {
        // debugger
        let dbStr = this.format_formula_toString()
        let result = this.fondamentalJudge(dbStr)
        if (!result){
          this.$message.warning({
            message:'Rules do not meet the requirements!'
          })
        }else{
          this.$message.success({
            message:'Correct rules!'
          })
        }
        return result
      },
      handleClose (tag) {
        // debugger
        this.tags.splice(this.tags.indexOf(tag), 1);
      },
      //判断四则运算的函数
      fondamentalJudge (str) {
        // 剔除空白符
        let string = str.split('=')[1].replace(/\s/g, '')

        // 错误情况，空字符串
        if ('' === string) {
          return false
        }
        // 错误情况，运算符连续
        if (/[\+\-\*\/]{2,}/.test(string)) {
          return false
        }
        // 空括号
        if (/\(\)/.test(string)) {
          return false
        }
        // 最后一个符号是加、减、乘、除符号
        if (/[\+\-\*\/]$/.test(string)) {
          return false
        }
        // 错误情况，括号不配对
        var stack = []
        for (var i = 0, item; i < string.length; i++) {
          item = string.charAt(i)
          if ('(' === item) {
            stack.push('(')
          } else if (')' === item) {
            if (stack.length > 0) {
              stack.pop()
            } else {
              return false
            }
          }
        }
        if (0 !== stack.length) {
          return false
        }
        // 错误情况，(后面是运算符
        if (/\([\+\-\*\/]/.test(string)) {
          return false
        }
        // 错误情况，)前面是运算符
        if (/[\+\-\*\/]\)/.test(string)) {
          return false
        }
        // 错误情况，(前面不是运算符
        if (/[^\+\-\*\/]\(/.test(string)) {
          return false
        }
        // 错误情况，)后面不是运算符
        if (/\)[^\+\-\*\/]/.test(string)) {
          return false
        }

        // **错误情况最后一个字符是**+-*/
        if (/\*[\+\-\*\/]$/.test(string)) {
          return false
        }
        return true
      }
  }
}
</script>

<style lang="scss">
    #formula-container {
        .demo-form-inline {
            .el-form-item__content {
                width: 100%;
            }
        }
        .el-row {
            .el-col {
                .formula_tag_box {
                    min-height: 143px;
                    padding: 15px;
                    background: rgba(242, 242, 242, 1);
                    display: flex;
                    flex-flow: column;
                    .main {
                        flex: 1;
                        .formula_tag_item {
                            float: left;
                            margin: 0 10px 10px 0;
                            span {
                                background: #fff;
                                text-align: center;
                                .el-icon-close {
                                    top: -14px;
                                    right: -18px;
                                    background: red;
                                    color: #fff;
                                }
                            }
                        }
                        .isFieldTag {
                            width: 80px;
                            position: relative;
                            .el-input__inner {
                                border: unset;
                                height: 30px;
                                padding-left: 0;
                                text-align: center;
                            }
                            .el-input__suffix {
                                height: 30px;
                                line-height: 30px;
                                .el-input__icon {
                                    line-height: 30px;
                                }
                            }
                            .el-icon-close {
                                top: -20px !important;
                                right: 0 !important;
                            }
                        }
                    }
                    .footer {
                        .el-button {
                            float: right;
                        }
                    }
                }
            }
        }
    }
</style>

