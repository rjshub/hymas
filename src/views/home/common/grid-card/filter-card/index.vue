<template>
    <div class="filter-card"
        @click.stop="handle_click">
        <div class="title">Drop List</div>
        <div class="cards-grid">
            <template v-for="(item,index) in allOptions">
                <filterSelect :key="index"
                    v-model="selects[item.name]"
                    style="margin-bottom:5px"
                    width="150px"
                    :options="item.options"
                    filterable
                    clearable
                    :multiple="!!item.isMultiple"
                    :prop="{ value: 'id', label: 'label' }"
                    :is-overlap-placeholder-color="true"
                    :placeholder="getplaceholder(item.name)"
                    @change="handle_change_drop(item)">
                </filterSelect>
            </template>
        </div>

        <div v-if="status!='view'"
            class="close-btn"
            @click.stop="handle_close_grid">
            <i class="el-icon-delete-solid"></i>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import uuidv4 from "uuid/v4";
import filterSelect from "@/components/common/filter-select";
// import card from "./card";

export default {
  name: "FilterCard",
  components: { filterSelect },

  props: {
    value: {
      type: [Object, Array],
      required: true
    },
    status: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      selects: {},
      allOptions: [],
      allOptionsClone: []
    };
  },

  computed: {
    ...mapState("common", ["yearTypeList"])
  },

  watch: {
    value: {
      handler: function(val) {
        // this.layout = this.value.childLayout;
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("home", ["fetch_card_data"]),

    async init() {
      this.allOptions = await this.get_card_data();
      this.allOptionsClone = _.cloneDeep(await this.get_card_data());

      for (let item of this.allOptions) {
        if (item.isMultiple) {
          this.$set(this.selects, item.name, []);
        } else {
          this.$set(this.selects, item.name, "");
        }
      }
    },

    //获取数据
    async get_card_data() {
      let toolData = this.value.toolData;
      let params = { type: toolData.chartType, data_source: toolData.dataSource, value: toolData.chartValue, ...this.extra };

      let result = [
        {
          name: "year",
          options: [
            {
              id: 1,
              label: "2019"
            },
            {
              id: 2,
              label: "2018"
            }
          ],
          isMultiple: 1,
          relate: {
            // condition: {
            //   id: 1,
            //   field: "year"
            // },
            condition: null,
            destination: {
              field: "quarter"
            }
          }
        },
        {
          name: "quarter",
          options: [
            {
              id: 1,
              label: "Q1"
            },
            {
              id: 2,
              label: "Q2"
            }
          ],
          relate: {
            condition: null,
            destination: {
              field: "month"
            }
          }
        },
        {
          name: "month",
          options: [
            {
              id: 1,
              label: "Jan"
            },
            {
              id: 2,
              label: "Feb"
            }
          ],
          relate: {
            condition: null,
            destination: {
              field: "brand"
            }
          }
        },
        {
          name: "brand",
          options: [
            {
              id: 1,
              label: "lancome"
            },
            {
              id: 2,
              label: "sk2"
            }
          ],
          relate: {
            condition: null,
            destination: {
              field: "product"
            }
          }
        },
        {
          name: "product",
          options: [
            {
              id: 1,
              label: "lancome21"
            },
            {
              id: 2,
              label: "sk2 -2"
            }
          ]
        }
      ];

      //判断是否有年，如果有，则自动假如财年和自然年得选择
      let hasYear = result.find(item => {
        return item.name == "year";
      });
      if (hasYear) {
        let yearType = {
          name: "yearType",
          options: this.yearTypeList,
          isMultiple: 0,
          relate: {
            condition: null,
            destination: {
              field: "year"
            }
          }
        };
        result.unshift(yearType);
      }

      // let result = await this.fetch_card_data(params);

      return result;
    },

    getplaceholder(name) {
      return "All " + name;
    },
    handle_change_drop(item) {
      if (item.relate && item.relate.condition) {
        let condition = item.relate.condition;
        let destination = item.relate.destination;
        if (this.selects[condition.field] == this.selects[condition.id]) {
          //请求数据，并重置当前关联的项
          let result = this.get_relate_data();
          this.allOptions = this.allOptions.map(jtem => {
            if (jtem.name == destination.field) {
              return { ...jtem, options: result };
            } else {
              return jtem;
            }
          });

          //重置当前relate的 select 值
          this.resetSelectsValue(destination.field);

          //重置其他
          this.reset_others_options(destination.field);
        }
      } else {
        if (item.relate && item.relate.destination) {
          let destination = item.relate.destination;
          //请求数据，并重置当前关联的项
          let result = this.get_relate_data();
          this.allOptions = this.allOptions.map(jtem => {
            if (jtem.name == destination.field) {
              return { ...jtem, options: result };
            } else {
              return jtem;
            }
          });

          //重置当前relate的 select 值
          this.resetSelectsValue(destination.field);

          //重置其他
          this.reset_others_options(destination.field);
        }
      }
    },

    reset_others_options(field) {
      let loop = field => {
        //重置field的 select 值
        this.resetSelectsValue(field);

        //恢复 options
        this.allOptions = this.allOptions.map(item => {
          if (item.name == field) {
            let options = this.allOptionsClone.find(jtem => jtem.name == field).options;
            return { ...item, options };
          } else {
            return item;
          }
        });

        //寻找下一个relate
        let option = this.getOption(field);
        if (option.relate) {
          loop(option.relate.destination.field);
        }
      };

      let option = this.getOption(field);
      if (option.relate) {
        let startField = option.relate.destination.field;
        //每次找到
        loop(startField);
      }
    },

    get_relate_data() {
      let result = [
        {
          id: 3,
          label: "Q3"
        },
        {
          id: 4,
          label: "Q4"
        }
      ];
      return result;
    },

    resetSelectsValue(field) {
      let option = this.getOption(field);

      if (option.isMultiple) {
        this.selects[field] = [];
      } else {
        this.selects[field] = "";
      }
    },

    getOption(field) {
      let option = this.allOptions.find(item => {
        return item.name == field;
      });

      return option;
    },

    handle_click() {
      this.$emit("select", this.value);
    },

    handle_close_grid() {
      this.$emit("delete", this.value);
    }
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.filter-card {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }

  .title {
    height: 30px;
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }

  .cards-grid {
    flex: 1;
    overflow: auto;

    ::placeholder {
      color: #606266;
    }
  }

  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer !important;
    }

    i {
      font-size: 20px;
      color: gray;
    }
  }
}
</style> 