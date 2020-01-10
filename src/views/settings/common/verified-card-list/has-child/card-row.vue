<template>
    <div class="card-row">
        <div class="level-1-warp">
            <level-first v-if="values.name || values.operate"
                :values="values"
                :is-first-delete="isFirstDelete"
                :is-read-only="isReadOnly"></level-first>
        </div>
        <div ref="level2Ref"
            class="level-2-wrap">
            <level-second v-for="(item,index) in cardRowData"
                :key="index+'level2'"
                :is-read-only="isReadOnly"
                :values="item"></level-second>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import levelFirst from "./level-first";
import levelSecond from "./level-second";

export default {
  name: "Card-Row",
  componentName: "CardRow",
  components: { levelFirst, levelSecond },
  props: {
    values: {
      type: [Object, Array],
      require: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    showLevelOne: {
      type: Boolean,
      default: true
    },
    //第一层是否可以删除
    isFirstDelete: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      isSpreadLevelTwo: false, ////是否全部展开 level -2
      cardRowData: []
    };
  },
  computed: {},

  watch: {
    values: {
      handler: function(val) {
        if (this.isSpreadLevelTwo) {
          this.spreadMore();
        } else {
          this.justOneLine();
        }
      },
      deep: true
    }
  },

  methods: {
    justOneLine() {
      if (this.values.operate == undefined) {
        //表示不是展开，合并标识的那一项
        if (this.values.children && this.values.children.length > 0) {
          if (this.getNum() > this.values.children.length) {
            //一行可以完全放下cards
            this.cardRowData = _.cloneDeep(this.values.children);

            if (!this.isReadOnly) {
              this.cardRowData.unshift({ operate: "add", id: this.values.id });
            }
          } else {
            //一行放不下
            let num = this.getNum();
            this.cardRowData = this.values.children.filter((item, index) => {
              return index < num;
            });
            if (!this.isReadOnly) {
              this.cardRowData.unshift({ operate: "add", id: this.values.id });
            }

            this.cardRowData[this.cardRowData.length - 1] = { ...this.cardRowData[this.cardRowData.length - 1], operate: "down" }; //给一行的最末位设置 展开标识
            this.isSpreadLevelTwo = false;
          }
        } else {
          if (!this.isReadOnly) {
            this.cardRowData = [{ operate: "add", id: this.values.id }];
          }
        }
      } else {
        this.cardRowData = [];
      }
    },

    getNum() {
      let level2Width = jquery(this.$refs.level2Ref).width();

      if (!this.isReadOnly) {
        return Math.floor(level2Width / 210) - 1;
      } else {
        return Math.floor(level2Width / 210);
      }
    },

    /**
     * 展开，显示更多
     */
    spreadMore() {
      if (this.values.operate == undefined) {
        if (this.values.children && this.values.children.length > 0) {
          let values = _.cloneDeep(this.values);
          this.cardRowData = values.children;
          if (!this.isReadOnly) {
            this.cardRowData.unshift({ operate: "add", id: this.values.id });
          }
          this.cardRowData[this.cardRowData.length] = { operate: "up" };
          this.isSpreadLevelTwo = true;
        } else {
          if (!this.isReadOnly) {
            this.cardRowData = [{ operate: "add", id: this.values.id }];
          }
        }
      } else {
        this.cardRowData = [];
      }
    }
  },

  mounted() {
    //点击显示更多的事件监听
    this.$on("show-item-more", () => {
      this.spreadMore();
    });
    this.$on("hide-item-more", () => {
      this.justOneLine();
    });

    this.$detectDomResize(this.$refs.level2Ref, element => {
      if (!this.isSpreadLevelTwo) {
        this.justOneLine();
      }
    });

    this.justOneLine();
  },
  destroyed() {
    this.$off("show-item-more");
    this.$off("hide-item-more");
  }
};
</script>

<style lang="scss" scoped>
.card-row {
  display: flex;

  .level-2-wrap {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
}
</style>
