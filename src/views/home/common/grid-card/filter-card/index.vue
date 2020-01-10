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
                    :prop="{ value: 'id', label: 'label' }"
                    :is-overlap-placeholder-color="true"
                    :placeholder="getplaceholder(item.name)"
                    @change="handle_change_drop">
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
      // layout: []
      selects: {},
      allOptions: []
    };
  },

  watch: {
    msg() {
      console.log("msg is changed");
    },
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

      for (let item of this.allOptions) {
        this.$set(this.selects, item.name, "");
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
          ]
          // relate:'quarter'   如果要关联加个relate
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
          ]
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
          ]
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
          ]
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

      // let result = await this.fetch_card_data(params);
      return result;
    },

    getplaceholder(name) {
      return "All " + name;
    },
    handle_change_drop() {},
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
    console.log("value", this.value);
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