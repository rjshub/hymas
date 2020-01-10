<template>
    <div class="role-create-and-edit">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <el-form :model="form"
                :rules="rules"
                size="mini"
                ref="form"
                label-width="120px"
                class="create-and-edit-form">
                <el-form-item label="Role Name:"
                    prop="name">
                    <el-input v-model="form.name"
                        :disabled="operateType=='detail'"
                        style="width:400px"></el-input>
                </el-form-item>
                <el-form-item label="Parent Level:"
                    prop="level">
                    <el-select v-model="form.level"
                        filterable
                        style="width:300px"
                        :disabled="operateType!='add'"
                        @change="change_parent_level"
                        placeholder="Select Level">
                        <el-option v-for="(item,index) in levelList"
                            :class="{level1: item.level==1, level2: item.level==2}"
                            :key="index"
                            :label="item.role_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Right Profile:"
                    class="permission-form-item"
                    prop="permission">
                    <role-tree v-if="isShowTree && treeList.menu && treeList.product"
                        :values="form.permission"
                        :disabled="operateType=='detail'"
                        :tree-data="treeList"
                        @add="handle_add_permission"
                        @delete="handle_delete_permission"></role-tree>
                </el-form-item>
                <el-form-item>
                    <span class="create-time"
                        v-if="operateType!='add'">Updated on {{form.updatedTime}}</span>
                    <span class="update-time"
                        v-if="operateType!='add'">Uploaded on {{form.createdTime}}</span>
                </el-form-item>
            </el-form>
            <div>
                <el-button v-if="operateType!='detail'"
                    type="primary"
                    size="mini"
                    @click="handle_submit">Submit</el-button>
                <el-button size="mini"
                    @click="handle_cancel">Cancel</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import uuidv1 from "uuid/v1";
import fetch from "@/services/fetch";
import breadCrumb from "@/components/common/bread-crumb";
import roleTree from "./role-tree";

const regx = {
  name: /^[a-zA-Z][\w-——]{1,19}$/
};

export default {
  name: "Create-And-Edit",
  components: { breadCrumb, roleTree },

  props: {},

  data() {
    //角色名称校验
    let validateName = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.name;
      if (!value) {
        callback(new Error("Role Name is required."));
      } else {
        if (!nameRegx.firstPlace.regx.test(value)) {
          callback(new Error(nameRegx.firstPlace.message));
        } else if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
          callback(new Error(nameRegx.length.message));
        } else {
          callback();
        }
      }
    };

    return {
      breadCrumbList: [],
      isLoading: true,
      isShowTree: false,
      operateType: false,
      form: {
        name: "",
        level: "1",
        permission: [], //新建时默认里面有一个
        updatedTime: "",
        createdTime: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      treeList: { menu: [], product: [] }, //整棵树展示的列表

      levelList: [],

      roleId: ""
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    })
  },
  methods: {
    ...mapActions("settings", ["fetch_roles_permission_tree", "fetch_role_detail", "fetch_role_level", "fetch_add_role", "fetch_edit_role"]),
    handle_close() {
      this.$emit("close");
    },

    setFormData(data) {
      debugger;
      if (data.role_name) {
        this.form.name = data.role_name;
      }

      if (data.pid) {
        this.form.level = data.pid;
      }

      if (data.auth_data && data.auth_data.length > 0) {
        this.form.permission = data.auth_data.map(item => {
          return { ...item, id: uuidv1() };
        });
      } else {
        this.form.permission = [{ state: 1, product: [], auth: [], type: 1, id: uuidv1() }];
      }

      if (data.updated_at) {
        this.form.updatedTime = data.updated_at;
      }

      if (data.created_at) {
        this.form.createdTime = data.created_at;
      }
    },

    handle_add_permission() {
      let index = this.form.permission.length;
      this.form.permission = [...this.form.permission, { id: uuidv1(), state: 1, product: [], auth: [], type: 1 }];
    },

    handle_delete_permission(id) {
      this.form.permission = this.form.permission.filter(item => item.id != id);
    },

    change_parent_level() {
      this.roleId = this.form.level;
      this.init();
    },

    async init() {
      let arr = [];
      if (this.$route.query.type == "edit") {
        //编辑
        this.breadCrumbList = [
          { path: "/settings/roles", name: "Settings" },
          { path: "/settings/roles", name: "Roles" },
          { path: "", name: "Edit Role" }
        ];

        this.operateType = "edit";
        arr = [this.fetch_role_detail({ id: this.roleId }), this.fetch_role_level({ id: this.userId })];
      }
      if (this.$route.query.type == "detail") {
        //详情
        this.breadCrumbList = [
          { path: "/settings/roles", name: "Settings" },
          { path: "/settings/roles", name: "Roles" },
          { path: "", name: "Detail Role" }
        ];

        this.operateType = "detail";
        arr = [this.fetch_role_detail({ id: this.roleId }), this.fetch_role_level({ id: this.userId })];
      }
      if (this.$route.query.type == "add") {
        //新建
        this.breadCrumbList = [
          { path: "/settings/roles", name: "Settings" },
          { path: "/settings/roles", name: "Roles" },
          { path: "", name: "Add Role" }
        ];

        this.operateType = "add";
        //根据父 level，新建 子level
        if (this.roleId) {
          this.form.level = this.roleId;
        }
        arr = [null, this.fetch_role_level({ id: this.userId })];
      }

      try {
        this.isLoading = true;
        let [res_detail, res_level] = await Promise.all(arr);
        if (res_detail) {
          this.setFormData(res_detail);
        } else {
          this.setFormData({
            auth_data: [],
            created_at: "",
            role_name: "",
            state: "1",
            updated_at: ""
          });
        }
        this.levelList = [...res_level];

        let res_allMenu = await this.fetch_roles_permission_tree({ pid: this.form.level });
        this.treeList = res_allMenu;
        this.isShowTree = true;

        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      } catch (err) {
        this.isShowTree = true;
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    send_request() {
      let param = {
        role_name: this.form.name,
        pid: this.form.level,
        auth_data: this.form.permission
      };

      if (this.operateType == "edit") {
        param.id = this.roleId;
        this.fetch_edit_role(param)
          .then(res => {
            this.$router.push({ name: "roles" });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
      if (this.operateType == "add") {
        this.fetch_add_role(param)
          .then(res => {
            this.$router.push({ name: "roles" });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },

    second_validate() {
      return new Promise((resolved, reject) => {
        //判断是否有客户
        if (!this.treeList.product[0] || this.treeList.product[0].children.length == 0) {
          this.$confirm(
            "The Client list hasn't been created yet. Please create your clients,brands and products on the client management page",
            "Tips",
            {
              confirmButtonText: "Confirm",
              cancelButtonText: "Cancel",
              closeOnClickModal: false,
              type: "warning",
              callback: action => {
                if (action == "confirm") {
                  this.$router.push({ name: "clients" });
                  reject();
                } else {
                  reject();
                }
              }
            }
          );
        } else {
          //判断是否有空权限
          let isNull = false;

          for (let item in this.form.permission) {
            if (this.form.permission[item].product.length == 0 || this.form.permission[item].auth.length == 0) {
              isNull = true;
              this.$confirm(`Find empty permissions. Do you want to ignore and continue saving?`, "Tips", {
                confirmButtonText: "Continue",
                cancelButtonText: "Cancel",
                closeOnClickModal: false,
                type: "warning",
                callback: action => {
                  if (action == "confirm") {
                    resolved();
                  } else {
                    reject();
                  }
                }
              });
              break;
            }
          }

          if (!isNull) {
            resolved();
          }
        }
      });
    },

    handle_submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.second_validate().then(res => {
            this.send_request();
          });
        } else {
          return false;
        }
      });
    },

    handle_cancel() {
      this.$router.push({ name: "roles" });
    }
  },

  mounted() {
    this.roleId = this.$route.query.id;
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.role-create-and-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 15px;
    background-color: white;

    .create-and-edit-form {
      display: flex;
      flex-direction: column;
      flex: 1;

      .permission-form-item {
        flex: 1;
        overflow: hidden;
        display: flex;

        /deep/ .el-form-item__content {
          margin-left: 0 !important;
          flex: 1;
        }
      }

      .create-time {
        margin-right: 50px;
        font-size: 12px;
        color: #959595;
      }

      .update-time {
        font-size: 12px;
        color: #959595;
      }
    }
  }
}
</style>
<style lang="scss">
.el-select-dropdown {
  .el-select-dropdown__item {
    &.level2 {
      padding-left: 40px;
    }
  }
}
</style>