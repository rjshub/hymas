

<template>
    <el-dialog title="Add Tab"
        class="add-field"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="true"
        width="500px"
        @close="handle_close">
        <el-button type="primary"
            size="mini"
            style="align-self: flex-start;"
            icon="el-icon-plus"
            @click="handle_add">
        </el-button>
        <div class="relate-area">
            <div v-for="(relate,index) in relates"
                :key="index"
                class="row">
                <div class="parent">
                    <el-select v-model="relate.parent"
                        style="width:200px"
                        size="mini"
                        placeholder="">
                        <el-option v-for="item in allFields"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="relate">
                    <i class="iconfont mas-relate"
                        @click="handle_add_relate(index)"></i>
                </div>
                <div v-if="relate.child!=undefined"
                    class="child">
                    <el-select v-model="relate.child"
                        size="mini"
                        style="width:200px"
                        placeholder="">
                        <el-option v-for="item in allFields"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </div>

        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button size="mini"
                    @click="handle_close">Cancel</el-button>
                <el-button size="mini"
                    type="primary"
                    @click="handle_submit">Save</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "AddField",
  components: {},
  props: {},
  data() {
    return {
      allFields: [],
      relates: [
        {
          parent: ""
          // child: ""
        }
      ]
    };
  },

  methods: {
    handle_close() {
      this.$emit("close");
    },

    handle_submit() {
      let hasParents = this.relates.filter(item => {
        return item.parent != "";
      });

      let result = hasParents.map(item => {
        if (item.child) {
          return item;
        } else {
          return { parent: item.parent };
        }
      });

      this.fetch_add_fields(result)
        .then(res => {
          this.$emit("save", result);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handle_add() {
      this.relates.push({ parent: "" });
    },

    fetch_data_source_all_fields(data) {
      return new Promise((resolve, reject) => {
        let result = [];
        result = [{ id: 1, name: "group" }, { id: 2, name: "brand" }, { id: 3, name: "product" }];

        resolve(result);
        return;

        fetch
          .post("/source/all_fields", data)
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    fetch_add_fields(data) {
      return new Promise((resolve, reject) => {
        // resolve();
        // return;

        fetch
          .post("/maintenance/verified_tab_add", {relates:data})
          .then(res => {
            if (res.ret == 0) {
              resolve(res.data);
            } else {
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    handle_add_relate(index) {
      let relate = this.relates[index];
      this.$set(this.relates, index, { ...relate, child: "" });
    }
  },

  async mounted() {
    this.allFields = await this.fetch_data_source_all_fields();
  }
};
</script>
<style lang="scss" scoped>
.add-field {
  /deep/ .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    height: 200px;
    display: flex;
    flex-direction: column;

    .relate-area {
      flex: 1;
      margin-top: 10px;
      overflow: auto;

      .row {
        display: flex;
        align-items: center;
        margin-bottom: 5px;

        .relate {
          text-align: center;
          width: 50px;
          cursor: pointer;

          i {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>