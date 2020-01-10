<template>
    <div class="format-field">
        <header :class="field_data.type === 'normal'? '':'special'">
            {{field_data.location}}
            <i :class="`iconfont ${get_field_header_icon}`" 
                :title="field_data.formula" 
                @click="handle_show_dialog(field_data.type)" 
                style="cursor: pointer"></i>
        </header>
        <main>
            <el-input style="width: 90%;margin-left:5px" :title="field_label" v-model="field_label" @change="handle_change_field_label"></el-input>
        </main>
        <footer>
            <div class="field_type" :title="field_data.type">
                <el-select v-model="field_type" @change="handle_change_type">
                    <el-option
                        v-for="item in field_type_list"
                        :key="item.type"
                        :label="item.type"
                        :value="item.type">
                        <span style="float:left;margin-right:5px;font-size:18px"><i class="iconfont" :class="item.icon"></i></span>
                        <span style="float:right">{{item.type}}</span>
                    </el-option>
                </el-select>
                <i :class="get_field_type_icon"></i>
            </div>
            <div class="field_attribute">
                <div :class="field_data.required? 'mas-is-required':'mas-no-required'" 
                    @click="handle_change_field_required"></div>
                <div :class="field_data.to_report_form? 'mas-to-reportForm':'mas-no-reportForm'" 
                    @click="handle_change_field_reportForm"></div>
            </div>
            <div class="sort-field">
                <span class="iconfont mas-arrow-left-end"
                    title="First"
                    @click="handle_first"></span>
                <span class="iconfont mas-arrow-left"
                    title="Prev"
                    @click="handle_prev"></span>
                <span class="iconfont mas-arrow-right"
                    title="Next"
                    @click="handle_next"></span>
                <span class="iconfont mas-arrow-right-end"
                    title="Last"
                    @click="handle_last"></span>
            </div>
            <div class="delete"
                @click="handle_delete_field"
                title="Delete">
                <i class="el-icon-delete"></i>
            </div>
        </footer>
        <FormulaDialog ref="formulaDialog" @update_formula_field="update_formula_field"></FormulaDialog>
        <ExtractDialog ref="extarctDialog" @update_extract_field="update_extract_field"></ExtractDialog>
        <ConnectDialog ref="connectDialog" @update_connect_field="update_connect_field"></ConnectDialog>
    </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import FormulaDialog from './formula-dialog'
import ExtractDialog from './extract-dialog'
import ConnectDialog from './connect-dialog'

export default {
  name: "containerName",
  components: { FormulaDialog, ExtractDialog, ConnectDialog },
  props: ['data'],
  data() {
    const THIS = this
    return {
        field_data: this.data,
        field_type: this.data.field_type,
        field_label: this.data.label
    }
  },
  watch: {
      data: {
          handler: function(val) {
              this.field_data = val
              this.field_type = val.field_type
              this.field_label = val.label
          }
      }
  },
  computed: {
      ...mapState('dataSource/formatSetting',['field_type_list']),
      get_field_type_icon() {
          const index = this.field_type_list.findIndex(obj => {
              return obj.type === this.field_data.field_type
          })

          return `iconfont ${this.field_type_list[index].icon}`
      },
      get_field_header_icon() {
          let icon = ''
          if (this.field_data.type === 'formula') {
              icon = 'mas-function'
          } else if (this.field_data.type === 'extract') {
              icon = 'mas-calander'
          } else if (this.field_data.type === 'connect') {
              icon = 'mas-relate'
          }
          return icon
      }
  },
  methods: {
      handle_change_field_label() {
          if (this.field_label.trim() && this.field_label.trim().length > 0) {
              this.field_data.label = this.field_label
              this.$emit('change-label', {createTime: this.field_data.createTime, label: this.field_data.label})
          } else {
              this.$message.error('format name can not be empty!')
              this.field_label = this.field_data.label
          }
      },
      handle_change_type() {
          this.field_data.field_type = this.field_type
          this.$emit('change-type', {createTime: this.field_data.createTime, field_type: this.field_type})
      },
      handle_change_field_required () {
          this.field_data.required = !this.field_data.required
          this.$emit('change-required', this.field_data)
      },
      handle_change_field_reportForm() {
          this.field_data.to_report_form = !this.field_data.to_report_form
          this.$emit('change-reportForm', this.field_data)
      },
      handle_first() {
          this.$emit('first', this.field_data.createTime)
      },
      handle_prev() {
          this.$emit('prev', this.field_data.createTime)
      },
      handle_next() {
          this.$emit('next', this.field_data.createTime)
      },
      handle_last() {
          this.$emit('last', this.field_data.createTime)
      },
      handle_delete_field() {
          this.$emit('delete', this.field_data.createTime)
      },
      handle_show_dialog(type) {
          if (type === 'formula') {
              this.$refs.formulaDialog.update_formula_field(this.field_data)
          } else if (type === 'extract') {
              this.$refs.extarctDialog.update_extract_field(this.field_data)
          } else if (type === 'connect') {
              this.$refs.connectDialog.update_connect_field(this.field_data)
          }
      },
      update_formula_field(param) {
          this.field_data = param
          this.$emit('update_field', param)
      },
      update_extract_field(param) {
          this.field_data = param
          this.$emit('update_field', param)
      },
      update_connect_field(param) {
          this.field_data = param
          this.$emit('update_field', param)
      }
  }
}
</script>

<style lang="scss">
    .format-field {
        width: 160px;
        height: 160px;
        display: flex;
        flex-flow: column;
        flex: none;
        background: #fff;
        margin-right: 5px;
        border: 1px solid #000;
        header {
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid #000;
            position: relative;
            color: #fff;
            background: #3895C5;
            i {
                font-size: 18px;
                display: none;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translate(0, -50%);
            }
        }
        .special {
            color: #ff6600;
            background: #FBF1DB;
            i {
                display: block;
                transition: 0.5s;
            }
        }
        main {
            flex: 1;
            display: flex;
            align-items: center;
            div:nth-child(1) {
                width: 110px;
                height: 30px;
                input {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        footer {
            height: 40px;
            display: inline-flex;
            padding: 0 10px;
            border-top: 1px solid #000;
            .field_attribute {
                width: 40px;
                height: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: space-around;
                div {
                    height: 16px;
                    width: 16px;
                    background: red;
                }
                .mas-is-required {
                    background: url('~@/assets/images/data_source/required_true.png') no-repeat center center;
                    background-size: cover;
                }
                .mas-no-required {
                    background: url('~@/assets/images/data_source/required_false.png') no-repeat center center;
                    background-size: cover;
                }
                .mas-to-reportForm {
                    background: url('~@/assets/images/data_source/reportForm_true.png') no-repeat center center;
                    background-size: cover;
                }
                .mas-no-reportForm {
                    background: url('~@/assets/images/data_source/reportForm_false.png') no-repeat center center;
                    background-size: cover;
                }
            }
            .sort-field {
                flex: 1;
                justify-content: space-around;
                display: inline-flex;
                align-items: center;
                height: 100%;
                cursor: pointer;
            }
            .field_type, .delete {
                display: inline-flex;
                align-items: center;
                width: 20px;
                height: 100%;
                cursor: pointer;
                i {
                    font-size: 16px;
                }
            }
            .delete {
                justify-content: flex-end;
            }
            .field_type {
                .el-select {
                    width: 0;
                    .el-input__inner {
                        width: 20px;
                        padding: 0;
                        border: 0;
                        opacity: 0;
                    }
                    .el-input__suffix {
                        display: none;
                    }
                }   
            }
        }
    }
</style>
