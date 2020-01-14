 
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import uuidv1 from "uuid/v1";

export default {
  name: "mixins",

  methods: {
    ...mapActions("settings", ["fetch_roles_permission_tree", "fetch_role_detail", "fetch_role_level", "fetch_add_role", "fetch_edit_role"]),

    setFormData(data) {
      if (data.role_name) {
        this.form.name = data.role_name;
      }

      if (data.pid) {
        this.form.level = data.pid;
      }

      if (data.client_id) {
        this.form.client = data.client_id;
      }

      if (data.updated_at) {
        this.form.updatedTime = data.updated_at;
      }

      if (data.created_at) {
        this.form.createdTime = data.created_at;
      }
    },

    /**设置默认的tab value和tab options */
    setClientTabDefaulValue() {
      this.clientTabOptions = this.clientOptions.filter(item => {
        if (this.form.client && this.form.client.length > 0) {
          let has = this.form.client.find(jtem => jtem == item.id);
          if (has) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });

      if (this.clientTabOptions && this.clientTabOptions.length > 0) {
        this.clientTabValue = this.clientTabOptions[0].id;
      } else {
        this.clientTabValue = "";
      }
    },

    /**
     * 通过已经得到的clientTabOptions创建permission
     */
    setPermission(auth_data) {
      debugger;
      if (auth_data) {
        //编辑
        this.form.permission = auth_data;
      } else {
        //新建
        this.form.permission = [];
        if (this.clientTabOptions.length > 0) {
          for (let item of this.clientTabOptions) {
            this.form.permission.push({
              tabId: item.id,
              values: [{ id: uuidv1(), state: 1, product: [], auth: { custom: [], fixed: [] }, type: 1 }]
            });
          }
        } else {
          this.form.permission.push({ tabId: "", values: [{ id: uuidv1(), state: 1, product: [], auth: { custom: [], fixed: [] }, type: 1 }] });
        }
      }
    },

    get_permission_by_tab_id() {
      let values = this.form.permission.find(item => {
        return item.tabId == this.clientTabValue;
      }).values;

      return values;
    },

    setPermissionDefaultId() {
      let values = this.get_permission_by_tab_id();
      this.defaultPermissionId = values[0].id;
    },

    /**
     * 获取detail、add、edit下分别应该发送的请求集合
     */
    getRequestArrays() {
      let arr = [];
      if (this.pageType == "edit") {
        //编辑
        this.breadCrumbList = [
          { path: "/settings/roles", name: "Settings" },
          { path: "/settings/roles", name: "Roles" },
          { path: "", name: "Edit Role" }
        ];

        arr = [this.fetch_role_detail({ id: this.roleId }), this.fetch_role_level({ id: this.userId })];
      }
      if (this.pageType == "detail") {
        //详情
        this.breadCrumbList = [
          { path: "/settings/roles", name: "Settings" },
          { path: "/settings/roles", name: "Roles" },
          { path: "", name: "Detail Role" }
        ];

        arr = [this.fetch_role_detail({ id: this.roleId }), this.fetch_role_level({ id: this.userId })];
      }

      if (this.pageType == "add") {
        //新建
        this.breadCrumbList = [
          { path: "/settings/roles", name: "Settings" },
          { path: "/settings/roles", name: "Roles" },
          { path: "", name: "Add Role" }
        ];

        arr = [null, this.fetch_role_level({ id: this.userId })];
      }

      return arr;
    }
  }
};
</script> 
