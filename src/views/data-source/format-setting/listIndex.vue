<template>
  <div class="format-list" v-loading.fullscreen="isloading">
    <div class="collapse-item" v-for="(item, index) in format_list" :key="index">
      <header>
        <div class="format-message">
          <div>
            <span :class="item.status === 1? 'turn_on':item.status === 0? 'turn_off':''"></span>
            {{item.number}}
          </div>
          <label>{{item.label}}</label>
          <div>
            <span>Updated on {{item.updateTime}}</span>
            <span>Select Range: {{item.select_range}} except {{item.except_range}}</span>
          </div>
        </div>
        <div class="format-handle">
          <span
            class="iconfont"
            :class="active === index? 'mas-up2':'mas-down2'"
            @click="change_active(index)"
          ></span>
          <HandlePopover :data="item"></HandlePopover>
        </div>
      </header>
      <main :class="active === index? 'is-active':''">
        <div class="collapse-main">
          <div class="list">
            <div class="field-item" v-for="(field, index) in item.list" :key="index">
              <span :class="field.type === 'normal'? 'normal_field':'special_field'">
                {{field.location}}
                <i
                  :class="get_special_field_icon(field.type)"
                  :title="field.formula"
                ></i>
              </span>
              <span>{{field.label}}</span>
              <span :class="get_field_icon(field.field_type)"></span>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div
      class="list-empty"
      v-show="format_list.length === 0"
    >Pleace click the button to create your first data source format!</div>
  </div>
</template>

<script type="text/javascript">
import fetch from '@/services/fetch'
import { mapActions, mapState } from "vuex";
import HandlePopover from "./components/handle-popover";

export default {
  name: "containerName",
  components: { HandlePopover },
  data() {
    return {
      isloading: false,
      active: 0,
      format_list: [],
      list: [
        {
          id: 1,
          status: 0,
          number: "1-111",
          label: "format-1",
          updateTime: "2019-01-01",
          select_range: "ALL",
          except_range: "ELC",
          list: [
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
              field_type: "Float",
              label: "test3",
              createTime: 1577778118026,
              type: "formula",
              location: "",
              formula: "test1 * test2",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Year",
              label: "test4",
              type: "extract",
              extract: "Year",
              from_extract: "test1",
              createTime: 1577778118027,
              formula: "From: test1",
              location: "",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            },
            {
              field_type: "Text",
              type: "connect",
              label: "test5",
              connect_field: "test2",
              connect_table_by: "表格1",
              connect_field_by: "字段1",
              connect_target_field: "字段2",
              location: "",
              createTime: 1577778118028,
              formula: "Connect: Mapping table 表格1",
              required: false,
              to_report_form: true
            }
          ]
        },
        {
          id: 1,
          status: 1,
          number: "1-111",
          label: "format-1",
          updateTime: "2019-01-01",
          select_range: "ALL",
          except_range: "ELC",
          list: [
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
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState("dataSource/formatSetting", ["field_type_list"])
  },
  methods: {
    ...mapActions("dataSource/formatSetting", ["update_format_create"]),
    change_active(index) {
      if (this.active === index) {
        this.active = "";
      } else {
        this.active = index;
      }
    },
    async get_format_list() {
      // const data = this.fetchCore(url, '', true)
      this.format_list = this.list;
      // this.format_list = []
      this.format_list.forEach(item => {
        item.list = this.format_form_fields(item.list);
      });
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
      return fields;
    },
    get_field_icon(type) {
      const index = this.field_type_list.findIndex(obj => {
        return obj.type === type;
      });

      return `iconfont ${this.field_type_list[index].icon}`;
    },
    get_special_field_icon(type) {
      let icon = "";
      if (type === "formula") {
        icon = "mas-function";
      } else if (type === "extract") {
        icon = "mas-calander";
      } else if (type === "connect") {
        icon = "mas-relate";
      }
      return `iconfont ${icon}`;
    },
    async fetchCore(url, data, hasLoading = false) {
      hasLoading && (this.isloading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        hasLoading && (this.isloading = false);
      }
    },
  },
  mounted() {
    this.get_format_list();
    this.update_format_create(false);
  }
};
</script>

<style lang="scss">
.format-list {
  .collapse-item {
    margin-bottom: 20px;
    background: #fff;
    border-radius: 10px;
    font-size: 14px;
    header {
      height: 70px;
      padding: 10px 20px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      .format-message {
        width: 50%;
        line-height: 16px;
        color: #666;
        div:nth-child(1) {
          span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #f1b657;
          }
          .turn_off {
            background: #f1b657;
          }
          .turn_on {
            background: #00a8e5;
          }
        }
        label {
          color: #000;
          font-size: 26px;
          font-weight: 500;
          line-height: 36px;
        }
      }
      .format-handle {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        span {
          display: inline-block;
          width: 30px;
          font-size: 16px;
        }
      }
    }
    main {
      background: #fff;
      padding: 0 20px;
      transition: all 0.3s;
      // height: 120px;
      height: 0;
      overflow-y: hidden;
      .collapse-main {
        transition: all 0.3s;
        height: 0;
        border: 10px solid #f6f6f6;
        border-bottom: 0;
        background: #f6f6f6;
        overflow-x: auto;
        .list {
          display: inline-flex;
          flex-flow: row;
          overflow: hidden;
        }
        .field-item {
          width: 120px;
          height: 100px;
          background: #fff;
          display: flex;
          flex-flow: column;
          border: 1px solid #666;
          border-left: 0;
          line-height: 33px;
          span {
            display: inline-block;
            flex: 1;
            text-align: center;
          }
          .normal_field {
            color: #fff;
            background: #3895c5;
          }
          .special_field {
            color: #ff6600;
            background: #fbf1db;
          }
          span:nth-child(1) {
            padding: 0 15px;
            position: relative;
            i {
              font-size: 18px;
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translate(0, -50%);
            }
          }
          span:nth-child(2) {
            border-top: 1px solid #666;
            border-bottom: 1px solid #666;
          }
        }
        .field-item:nth-child(1) {
          border-left: 1px solid #666;
        }
      }
    }
    .is-active {
      height: 145px;
      overflow: unset;
      border-radius: 10px;
      .collapse-main {
        height: 120px;
      }
    }
  }
  .list-empty {
    width: 100%;
    height: 60px;
    text-align: center;
    color: #d9001b;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
