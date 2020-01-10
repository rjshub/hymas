<template>
    <div class="users">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <div class="tools">
                <span class="add">
                    <el-button :disabled="isUsersReadable"
                        type="primary"
                        size="mini"
                        @click="handle_add_user">
                        <i class="el-icon-plus"></i>Add User
                    </el-button>
                </span>
                <span class="search">
                    <el-select v-model="role"
                        size="mini"
                        filterable
                        placeholder="Select Role"
                        style="width:150px;margin-right:10px"
                        @change="get_user_list">
                        <el-option label="All Roles"
                            value="">
                        </el-option>
                        <el-option v-for="(item,index) in roleList"
                            :class="{level1: item.level==1, level2: item.level==2}"
                            :key="index"
                            :label="item.role_name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-input size="mini"
                        placeholder="Please enter keywords"
                        style="width:250px"
                        @keyup.enter.native="get_user_list"
                        v-model="keywords">
                        <template v-slot:append>
                            <el-button icon="el-icon-search"
                                @click="get_user_list"></el-button>
                        </template>
                    </el-input>
                </span>
            </div>
            <div v-if="cards && cards.length>0"
                class="cards-wrap">
                <user-card-list :values="cards"
                    :is-read-only="isUsersReadable"
                    @edit="handle_card_list_edit"
                    @detail="handle_card_list_detail"
                    @add="handle_card_list_add"
                    @turn-on="handle_card_list_turn_on"
                    @turn-off="handle_card_list_turn_off"></user-card-list>
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
import userCardList from "@/views/settings/common/user-card-list";
export default {
  name: "Users",
  components: { breadCrumb, userCardList },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [{ path: "/settings/users", name: "Settings" }, { path: "", name: "Users" }],

      cards: [],
      role: "",
      keywords: "",
      blankTips: "",

      roleList: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    }),
    ...mapGetters("settings", ["isUsersReadable"])
  },

  methods: {
    ...mapActions("settings", ["fetch_user_list", "fetch_user_role_list", "fetch_update_user_state"]),

    async get_role_list() {
      try {
        this.roleList = await this.fetch_user_role_list({ id: this.userId });
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async get_user_list() {
      try {
        this.isLoading = true;
        this.get_role_list();
        this.cards = await this.fetch_user_list({ pid: this.role, keywords: this.keywords });

        if (this.cards && this.cards.length > 0) {
          this.blankTips = "";
        } else {
          if (this.role == "" && this.keywords == "") {
            this.blankTips = "Please Create your first User.";
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

    handle_add_user() {
      this.$router.push({
        path: "users/edit-or-create",
        query: { type: "add" }
      });
    },
    handle_card_list_edit(data) {
      this.$router.push({
        path: "users/edit-or-create",
        query: { type: "edit", id: data.id }
      });
    },
    handle_card_list_detail(data) {
      this.$router.push({
        path: "users/edit-or-create",
        query: { type: "detail", id: data.id }
      });
    },

    handle_card_list_add(data) {
      this.$router.push({
        path: "users/edit-or-create",
        query: { type: "add", id: data.id }
      });
    },
    async handle_card_list_turn_on(data) {
      try {
        await this.fetch_update_user_state({ id: data.id, state: 1 });
        await this.get_user_list();
        this.$message.success("Enable");
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async handle_card_list_turn_off(data) {
      try {
        await this.fetch_update_user_state({ id: data.id, state: 0 });
        await this.get_user_list();
        this.$message.success("Disable");
      } catch (err) {
        this.$message.error(err.message);
      }
    }
  },

  mounted() {
    this.get_user_list();
  }
};
</script>
<style lang="scss" scoped>
.users {
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

      .search {
        display: flex;
      }
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
