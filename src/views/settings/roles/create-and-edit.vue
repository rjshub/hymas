<template>
    <div class="role-create-and-edit">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="main">
            <el-form ref="form"
                :model="form"
                :rules="rules"
                size="mini"
                label-width="120px"
                class="create-and-edit-form">
                <el-form-item label="Role Name:"
                    prop="name">
                    <el-input v-model="form.name"
                        :disabled="pageType=='detail'"
                        style="width:400px"></el-input>
                </el-form-item>
                <el-form-item label="Parent Level:"
                    prop="level">
                    <el-select v-model="form.level"
                        filterable
                        style="width:300px"
                        :disabled="pageType!='add'"
                        placeholder="Select Level"
                        @change="change_parent_level">
                        <el-option v-for="(item,index) in levelList"
                            :key="index"
                            :class="{level1: item.level==1, level2: item.level==2}"
                            :label="item.role_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Client:"
                    prop="client">
                    <el-select v-model="form.client"
                        filterable
                        multiple
                        style="width:300px"
                        :disabled="pageType=='detail'"
                        placeholder="Select Client"
                        @change="change_client">
                        <el-option v-for="(item,index) in clientOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Right Profile:"
                    class="permission-form-item"
                    prop="permission">

                    <HyRadioGroup :value="clientTabValue"
                        :options="clientTabOptions"
                        @change="handle_change_tab"></HyRadioGroup>

                    <role-tree v-if="isShowTree && treeList.menu && treeList.product"
                        v-loading="isLoadingTree"
                        element-loading-spinner="iconfont mas-loading"
                        :default-id="defaultPermissionId"
                        :values="get_permission_by_tab_id()"
                        :disabled="pageType=='detail'"
                        :tree-data="treeList"
                        @add="handle_add_permission"
                        @delete="handle_delete_permission"></role-tree>
                </el-form-item>
                <el-form-item>
                    <span v-if="pageType!='add'"
                        class="create-time">Updated on {{form.updatedTime}}</span>
                    <span v-if="pageType!='add'"
                        class="update-time">Uploaded on {{form.createdTime}}</span>
                </el-form-item>
            </el-form>
            <div>
                <el-button v-if="pageType!='detail'"
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
import HyRadioGroup from "@/components/common/hy-radio-group";
import roleTree from "./role-tree";
import mixins from "./mixins";

export default {
  name: "CreateAndEdit",
  mixins: [mixins],
  components: { breadCrumb, HyRadioGroup, roleTree },

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
      isLoading: true,
      isLoadingTree: false,
      isShowTree: false,
      breadCrumbList: [],
      roleId: "",
      pageType: "",
      form: {
        name: "",
        level: "1",
        client: [],
        permission: [], //新建时默认里面有一个
        updatedTime: "",
        createdTime: ""
      },

      clientOptions: [],
      clientTabOptions: [],

      clientTabValue: "1",
      defaultPermissionId: "", //默认的左侧活动的permission

      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        client: [{ required: true, message: "client is required", trigger: "change" }]
      },
      treeList: { menu: { fixed: [], custom: [] }, product: [] }, //整棵树展示的列表

      levelList: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    })
  },
  methods: {
    ...mapActions("common", ["fetch_client_by_role"]),

    async init() {
      try {
        this.isLoading = true;
        this.isShowTree = false;

        let [res_detail, res_level] = await Promise.all(this.getRequestArrays()); //获取 角色详情，角色层级
        this.clientOptions = await this.fetch_client_by_role({ role_id: this.roleId }); //获取客户层级
        this.levelList = [...res_level];

        if (res_detail) {
          //编辑
          this.setFormData(res_detail);
          this.setClientTabDefaulValue();
          this.setPermission(res_detail.auth_data);
        } else {
          //新建时因为没有选择任何的tab id，所以给一个默认的tabid为空的项目
          this.setFormData({
            created_at: "",
            role_name: "",
            state: "1",
            pid: this.roleId,
            updated_at: ""
          });
          this.setClientTabDefaulValue();
          this.setPermission();
        }

        this.setPermissionDefaultId();

        //获取menu 列表
        let res_allMenu = await this.fetch_roles_permission_tree({ pid: this.form.level, tab_id: this.clientTabValue });
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

    /**改变 parent level */
    async change_parent_level() {
      this.roleId = this.form.level;

      this.isLoading = true;

      try {
        this.form.client = [];

        //获取客户列表和menu 列表
        this.clientOptions = await this.fetch_client_by_role({ role_id: this.roleId }); //获取客户层级

        this.setClientTabDefaulValue();
        this.setPermission();
        this.setPermissionDefaultId();

        let res_allMenu = await this.fetch_roles_permission_tree({ pid: this.form.level, tab_id: this.clientTabValue || "" });

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

    /**
     * 切换client
     */
    async change_client() {
      this.isLoadingTree = true;

      this.setClientTabDefaulValue();
      this.setPermission();
      this.setPermissionDefaultId();

      try {
        let res_allMenu = await this.fetch_roles_permission_tree({ pid: this.form.level, tab_id: this.clientTabValue || "" });

        this.treeList = res_allMenu;
        this.isShowTree = true;

        setTimeout(() => {
          this.isLoadingTree = false;
        }, 1000);
      } catch (err) {
        this.isShowTree = true;
        this.isLoadingTree = false;
        this.$message.error(err.message);
      }
    },

    /**
     * 切换client 下方的tab
     */
    async handle_change_tab(value) {
      this.isLoadingTree = true;

      this.clientTabValue = value;
      this.setPermissionDefaultId();

      try {
        let res_allMenu = await this.fetch_roles_permission_tree({ pid: this.form.level, tab_id: this.clientTabValue || "" });

        this.treeList = res_allMenu;
        this.isShowTree = true;

        setTimeout(() => {
          this.isLoadingTree = false;
        }, 1000);
      } catch (err) {
        this.isShowTree = true;
        this.isLoadingTree = false;
        this.$message.error(err.message);
      }
    },

    //增加一个permission
    handle_add_permission() {
      let permission = _.cloneDeep(this.form.permission);

      for (let item of permission) {
        if (item.tabId == this.clientTabValue) {
          item.values = [...item.values, { id: uuidv1(), state: 1, product: [], auth: { custom: [], fixed: [] }, type: 1 }];
        }
      }
      this.form.permission = permission;
    },

    //删除一个permission
    handle_delete_permission(id) {
      let permission = _.cloneDeep(this.form.permission);
      for (let item of permission) {
        if (item.tabId == this.clientTabValue) {
          item.values = item.values.filter(item => item.id != id);
        }
      }
      this.form.permission = permission;
    },

    send_request() {
      let param = {
        role_name: this.form.name,
        pid: this.form.level,
        client_id: this.form.client,
        auth_data: this.form.permission
      };

      if (this.pageType == "edit") {
        param.id = this.roleId;
        this.fetch_edit_role(param)
          .then(res => {
            this.$router.push({ name: "roles" });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
      if (this.pageType == "add") {
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

          for (let item of this.form.permission) {
            let values = item.values; //一个tab下的所有的权限

            let has = values.find(jtem => {
              return jtem.product.length == 0 || jtem.auth.custom.length == 0 || jtem.auth.fixed.length == 0;
            });

            if (has) {
              isNull = true;
              break;
            }
          }

          if (isNull) {
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
          } else {
            resolved();
          }
        }
      });
    },

    handle_submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.second_validate()
            .then(res => {
              this.send_request();
            })
            .catch(err => {});
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
    this.pageType = this.$route.query.type;
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

        ::v-deep .el-form-item__content {
          margin-left: 0 !important;
          flex: 1;
          display: flex;
          flex-direction: column;
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

    // ::v-deep .el-loading-mask {
    //   z-index: 5000 !important;
    // }
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