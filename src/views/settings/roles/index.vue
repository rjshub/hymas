<template>
    <div class="roles">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="main">
            <div class="tools">
                <span class="add">
                    <el-button :disabled="isRolesReadable"
                        type="primary"
                        size="mini"
                        @click="handle_add_role">
                        <i class="el-icon-plus"></i>Add Role
                    </el-button>
                </span>
                <span class="search">
                    <el-input size="mini"
                        placeholder="Please enter keywords"
                        style="width:250px"
                        @keyup.enter.native="get_role_list"
                        v-model="keywords">
                        <template v-slot:append>
                            <el-button icon="el-icon-search"
                                @click="get_role_list"></el-button>
                        </template>
                    </el-input>
                </span>
            </div>
            <div v-if="cards && cards.length>0"
                class="cards-wrap">
                <role-card-list :values="cards"
                    :is-read-only="isRolesReadable"
                    @edit="handle_card_list_edit"
                    @detail="handle_card_list_detail"
                    @add="handle_card_list_add"
                    @turn-on="handle_card_list_turn_on"
                    @turn-off="handle_card_list_turn_off"></role-card-list>
            </div>
            <div v-else
                class="blank_tips">
                {{blankTips}}
            </div>
        </div>

        <!-- 回到顶部 -->
        <el-backtop v-if="cards && cards.length>0"
            target=".cards-wrap"
            :bottom="5">
            <div class="backtop-arrow">
                <i class="iconfont mas-up"></i>
            </div>
        </el-backtop>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import roleCardList from "@/views/settings/common/role-card-list";
export default {
  name: "Roles",
  components: { breadCrumb, roleCardList },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [{ path: "/settings/roles", name: "Settings" }, { path: "", name: "Roles" }],

      cards: [],
      keywords: "",
      blankTips: ""
    };
  },
  computed: {
    ...mapState("user", ["role_id"]),
    ...mapGetters("settings", ["isRolesReadable"])
  },

  methods: {
    ...mapActions("settings", ["fetch_role_list", "fetch_update_role_state"]),

    async get_role_list() {
      try {
        this.isLoading = true;
        this.cards = await this.fetch_role_list({ keywords: this.keywords });
        if (this.cards && this.cards.length > 0) {
          this.blankTips = "";
        } else {
          if (this.keywords == "") {
            this.blankTips = "Please Create your first Role.";
          } else {
            this.blankTips = "No data Found..";
          }
        }

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },
    handle_add_role() {
      this.$router.push({
        path: "roles/edit-or-create",
        query: { type: "add", id: this.role_id }
      });
    },

    handle_card_list_edit(data) {
      this.$router.push({
        path: "roles/edit-or-create",
        query: { type: "edit", id: data.id }
      });
    },
    //查看，只在只读时可用
    handle_card_list_detail(data) {
      this.$router.push({
        path: "roles/edit-or-create",
        query: { type: "detail", id: data.id }
      });
    },

    handle_card_list_add(data) {
      this.$router.push({
        path: "roles/edit-or-create",
        query: { type: "add", id: data.id }
      });
    },
    async handle_card_list_turn_on(data) {
      try {
        await this.fetch_update_role_state({ id: data.id, state: 1 });
        await this.get_role_list();
        this.$message.success("Enable");
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async handle_card_list_turn_off(data) {
      try {
        await this.fetch_update_role_state({ id: data.id, state: 0 });
        await this.get_role_list();
        this.$message.success("Disable");
      } catch (err) {
        this.$message.error(err.message);
      }
    }
  },

  mounted() {
    this.get_role_list();
  }
};
</script>
<style lang="scss" scoped>
.roles {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;

    .tools {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      min-height: 28px;
    }
    .cards-wrap {
      overflow: auto;
    }
    .blank_tips {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      color: #b4b4b4;
      font-size: 20px;
    }
  }
}
</style>
