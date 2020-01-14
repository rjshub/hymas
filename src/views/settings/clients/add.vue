<template>
    <el-dialog :title="title"
        class="clients__add-dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :visible="true"
        width="720px"
        @close="handle_close">
        <el-form :model="addForm"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            :rules="rules"
            ref="addForm"
            size="mini">
            <el-form-item prop="name">
                <div>Name</div>
                <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="industry">
                <div>Please select the industry of the client</div>
                <el-select v-model="addForm.industry"
                    size="mini"
                    filterable
                    placeholder="Select Industry"
                    style="width:100%">
                    <el-option v-for="(item,index) in industryOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="deadline">
                <div>Please select the customer's fiscal year deadline</div>
                <el-select v-model="addForm.deadline"
                    size="mini"
                    filterable
                    placeholder="Select Deadline"
                    style="width:100%">
                    <el-option v-for="(item,index) in deadlineOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="roles">
                <div> Please select Roles who has this client permission</div>
                <role-select-tree class="role-select-tree"
                    :has-filter="true"
                    :values="rolesTreeData"
                    :default-selected-values="rolesTreeData"
                    :default-props="{children:'children', label:'name'}"
                    :default-selected-keys="selectedKeys"
                    width="300px"
                    height="300px"
                    @update:add="treeUpdateAdd"
                    @update:remove="treeUpdateRemove"
                    @update:clear="treeUpdateClear">
                </role-select-tree>

                <div class="dialog-tag">
                    <el-tag v-for="(item,index) in addForm.users"
                        :key="index"
                        type="">
                        {{item.name}}
                    </el-tag>
                </div>

            </el-form-item>
        </el-form>

        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button size="mini"
                    @click="handle_close">Cancel</el-button>
                <el-button size="mini"
                    type="primary"
                    @click="handle_submit">Submit</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import treeJs from "element-tree-js";
import fetch from "@/services/fetch";
import roleSelectTree from "@/components/common/select-tree";

export default {
  name: "add",
  components: { roleSelectTree },

  props: {
    isEdit: {
      // 是否编辑
      type: Boolean,
      require: true
    },
    ids: {
      // {currentId   parentId}
      type: Object,
      require: true
    },
    type: {
      // client，brand，product
      type: String,
      require: true
    },
    industryOptions: {
      type: Array,
      require: true
    }
  },

  data() {
    let validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Name is required"));
      } else {
        callback();
      }
    };
    let validateRole = (rule, value, callback) => {
      if (this.addForm.roles.length == 0) {
        callback(new Error("Role is required"));
      } else {
        callback();
      }
    };

    return {
      isLoading: false,
      title: "",

      addForm: {
        id: "",
        name: "",
        industry: "",
        deadline: "",
        roles: [],
        users: [],
        parent_id: "0"
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        industry: [{ required: true, message: "Industry is required", trigger: "change" }],
        deadline: [{ required: true, message: "Deadline is required", trigger: "change" }],
        roles: [{ validator: validateRole, trigger: "blur" }]
      },

      deadlineOptions: [],
      rolesTreeData: [],
      selectedKeys: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    })
  },

  methods: {
    ...mapActions("settings", ["fetch_users_by_roles", "fetch_user_role_list_self"]),

    async init() {
      //设置title
      if (!this.isEdit) {
        this.title = "Add ";
      } else {
        this.title = "Edit ";
      }
      this.title += _.capitalize(this.type);

      try {
        this.isLoading = true;

        await Promise.all([this.get_roles_list(), this.get_deadline_list()]);

        if (this.isEdit) {
          this.addForm.id = this.ids.currentId;
          await this.get_form_detail();
        } else {
          if (this.type != "client") {
            this.addForm.parent_id = this.ids.parentId;
          }
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },
    async get_roles_list() {
      try {
        let res = await this.fetch_user_role_list_self({ id: this.userId });
        let result = [];
        let child = {};
        for (let item of res) {
          if (item.level == 1) {
            child = { ...item, name: item.role_name, key: item.id + "level1", children: [] };
            result.push(child);
          } else {
            child.children.push({ ...item, name: item.role_name, key: item.id + "level2" });
          }
        }

        this.rolesTreeData = result;
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async get_deadline_list() {
      let data = [{ id: 1, name: "The end of Jan" }, { id: 2, name: "The end of Feb" }, { id: 3, name: "The end of Mar" }];

      try {
        // let { data } = await fetch.post("/maintenance/verified_list", params);
        this.deadlineOptions = data;
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async get_form_detail() {
      try {
        let { data } = await fetch.post("/user/clientdetail", { id: this.ids.currentId, type: this.type });
        this.addForm.id = data.id;
        this.addForm.name = data.name;
        this.addForm.industry = data.industry_id;
        this.addForm.deadline = data.deadline_id;
        this.addForm.roles = data.role_ids;
        this.selectedKeys = treeJs.getTreeDestList(this.rolesTreeData, "id", this.addForm.roles, "key");
        this.get_users_by_roles();
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    handle_submit() {
      this.$refs["addForm"].validate(async valid => {
        if (valid) {
          let param = {};
          if (this.isEdit) {
            param = {
              id: this.addForm.id,
              name: this.addForm.name,
              industry_id: this.addForm.industry,
              deadline_id: this.addForm.deadline,
              type: this.type,
              role_ids: this.addForm.roles
            };

            //编辑
            await fetch.post("/user/editclient", param).catch(err => {
              this.$message.error(err.message);
            });

            this.resetForm();
            this.$emit("submit");
          } else {
            param = {
              name: this.addForm.name,
              industry_id: this.addForm.industry,
              deadline_id: this.addForm.deadline,
              parent_id: this.addForm.parent_id,
              type: this.type,
              role_ids: this.addForm.roles
            };

            await fetch.post("/user/addclient", param).catch(err => {
              this.$message.error(err.message);
            });

            this.resetForm();
            this.$emit("submit");
          }
        } else {
          return false;
        }
      });
    },

    async get_users_by_roles() {
      let res = await this.fetch_users_by_roles({ id: this.addForm.roles.filter(item => item != undefined) }).catch(err => {
        this.$message.error(err.message);
      });

      this.addForm.users = res;
      this.$refs["addForm"].validateField("roles");
    },

    resetForm() {
      this.isLoading = false;
      this.title = "";
      this.addForm.id = "";
      this.addForm.name = "";
      this.addForm.roles = [];
      this.addForm.users = [];
      this.addForm.parent_id = "0";

      this.rolesTreeData = [];
      this.selectedKeys = [];

      this.$refs["addForm"].resetFields();
    },

    handle_close() {
      this.resetForm();
      this.$emit("close");
    },

    /**更新已选中的tree节点 */
    treeUpdateAdd(data) {
      this.selectedKeys = _.uniqWith(_.concat(this.selectedKeys, data.keys), _.isEqual);
      this.selectedKeys = [...this.selectedKeys];

      this.addForm.roles = _.uniqWith(_.concat(this.addForm.roles, data.ids), _.isEqual);

      if (this.addForm.roles.length == 0) {
        this.addForm.users = [];
      } else {
        this.get_users_by_roles();
      }

      this.$refs["addForm"].validateField("roles");
    },

    treeUpdateRemove(data) {
      let removedKey = data.keys[0];
      let removedId = data.ids[0];
      _.remove(this.selectedKeys, function(n) {
        return n == removedKey;
      });
      _.remove(this.addForm.roles, function(n) {
        return n == removedId;
      });
      this.selectedKeys = [...this.selectedKeys];

      if (this.addForm.roles.length == 0) {
        this.addForm.users = [];
      } else {
        this.get_users_by_roles();
      }

      this.$refs["addForm"].validateField("roles");
    },

    treeUpdateClear() {
      this.selectedKeys = [];
      this.addForm.roles = [];
      this.addForm.users = [];
      this.$refs["addForm"].validateField("roles");
    }
  },

  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.clients__add-dialog {
  ::v-deep .el-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;

    .el-dialog__body {
      padding-top: 10px;
      padding-bottom: 10px;
      height: 600px;
      overflow: auto;

      //滚动条大小
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      .el-form {
        .role-select-tree {
          height: 335px;
        }

        .dialog-tag {
          max-height: 150px;
          overflow: auto;

          .el-tag {
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 10px 20px 10px 20px;
    }
  }
}
</style>
