<template>
    <div class="card-row">
        <div class="level-2-warp">
            <level-second :values="values"
                :is-read-only="isReadOnly"></level-second>
        </div>
        <div ref="level3Ref"
            class="level-3-wrap">
            <level-third v-for="(item,index) in cardRowData"
                :is-read-only="isReadOnly"
                :key="index+'level3'"
                :values="item"></level-third>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import levelSecond from "./level-second";
import levelThird from "./level-third";

export default {
  name: "Card-Row",
  componentName: "CardRow",
  components: { levelSecond, levelThird },
  props: {
    values: {
      type: [Object, Array],
      require: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isSpreadLevelThird: false, ////是否全部展开 level -3
      cardRowData: []
    };
  },

  watch: {
    values: {
      handler: function(val) {
        if (this.isSpreadLevelThird) {
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
        if (this.values.children && this.values.children.length > 0) {
          //表示不是展开，合并标识的那一项
          let level3Width = jquery(this.$refs.level3Ref).width();

          if (level3Width / 250 > this.values.children.length) {
            //一行可以完全放下cards
            this.cardRowData = this.values.children;
          } else {
            //一行放不下
            let num = Math.floor(level3Width / 250);
            this.cardRowData = this.values.children.filter((item, index) => {
              return index < num;
            });
            this.cardRowData[this.cardRowData.length - 1] = { ...this.cardRowData[this.cardRowData.length - 1], operate: "down" }; //给一行的最末位设置 展开标识
            this.isSpreadLevelThird = false;
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

    /**
     * 展开，显示更多
     */
    spreadMore() {
      if (this.values.operate == undefined) {
        if (this.values.children && this.values.children.length > 0) {
          let values = _.cloneDeep(this.values);
          this.cardRowData = values.children;
          this.cardRowData[this.cardRowData.length] = { operate: "up" };
          this.isSpreadLevelThird = true;
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

    this.$detectDomResize(this.$refs.level3Ref, element => {
      if (!this.isSpreadLevelThird) {
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

  .level-3-wrap {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
}
</style>
