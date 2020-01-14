<template>
    <div class="clients">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="main">
            <div class="tools">
                <span class="add">
                    <el-button :disabled="isClientsReadable"
                        type="primary"
                        size="mini"
                        @click="handle_add_client">
                        <i class="el-icon-plus"></i>Add Client
                    </el-button>
                </span>
                <span class="search">
                    <el-select v-model="industry"
                        size="mini"
                        filterable
                        placeholder="Select Industry"
                        style="width:150px;margin-right:5px"
                        @change="handle_change_industry">
                        <el-option label="All Industries"
                            value="">
                        </el-option>
                        <el-option v-for="(item,index) in industryList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="client"
                        size="mini"
                        filterable
                        placeholder="Select Client"
                        style="width:150px;margin-right:5px"
                        @change="handle_change_client">
                        <el-option label="All Clients"
                            value="">
                        </el-option>
                        <el-option v-for="(item,index) in clientList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="brand"
                        size="mini"
                        filterable
                        placeholder="Select Brand"
                        style="width:150px;margin-right:5px"
                        @change="get_clients_list">
                        <el-option label="All Brands"
                            value="">
                        </el-option>
                        <el-option v-for="(item,index) in brandList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-input size="mini"
                        style="width:250px"
                        placeholder="Please enter keywords"
                        @keyup.enter.native="get_clients_list"
                        v-model="keywords">
                        <template v-slot:append>
                            <el-button icon="el-icon-search"
                                @click="get_clients_list"></el-button>
                        </template>
                    </el-input>
                </span>
            </div>
            <div class="cards-wrap"
                v-if="cards && cards.length">
                <client-card-list :values="cards"
                    :is-read-only="isClientsReadable"
                    @edit="handle_card_list_edit"
                    @add="handle_card_list_add"
                    @delete="handle_card_list_delete"></client-card-list>
            </div>
            <div v-else
                class="blank_tips">
                {{blankTips}}
            </div>
        </div>

        <add-dialog v-if="dialog.isVisible"
            :is-edit="dialog.isEdit"
            :ids="dialog.ids"
            :industry-options="industryList"
            :type="dialog.type"
            @close="handle_dialog_close"
            @submit="handle_dialog_submit"> </add-dialog>

        <!-- 回到顶部 -->
        <el-backtop v-if="cards && cards.length"
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
import fetch from "@/services/fetch";
import breadCrumb from "@/components/common/bread-crumb";
import clientCardList from "@/views/settings/common/client-card-list";
import roleSelectTree from "@/components/common/select-tree";
import addDialog from "./add";

export default {
  name: "Clients",
  components: { breadCrumb, clientCardList, roleSelectTree, addDialog },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [{ path: "/settings/clients", name: "Settings" }, { path: "", name: "Clients" }],

      dialog: {
        isVisible: false,
        isEdit: false,
        ids: {
          currentId: "",
          parentId: ""
        },
        type: "client" //client brand product
      },

      cards: [],

      industry: "",
      client: "",
      brand: "",
      keywords: "",

      industryList: [],
      clientList: [],
      brandList: [],
      blankTips: ""
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    }),
    ...mapGetters("settings", ["isClientsReadable"])
  },

  methods: {
    ...mapActions("settings", ["fetch_barnd_list", "fetch_custom_list"]),

    async get_custom_filter_list() {
      try {
        this.clientList = await this.fetch_custom_list();
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    handle_change_industry() {
      this.get_brand_filter_list();
    },
    handle_change_client() {
      this.brand = "";
      this.get_brand_filter_list();
    },

    async get_brand_filter_list() {
      try {
        let res = await Promise.all([this.fetch_barnd_list({ client_id: this.client }), this.get_clients_list()]);
        this.brandList = res[0];
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async get_clients_list() {
      try {
        this.isLoading = true;

        let { data } = await fetch.post("/user/clientlist", {
          keywords: this.keywords,
          industry_id: this.industry,
          client_id: this.client,
          brand_id: this.brand
        });

        // data = [
        //   {
        //     id: "167",
        //     serial: "1",
        //     name: "test_1218_001",
        //     industry: "Communication Services",
        //     created_at: "2019-12-18 18:08:24",
        //     updated_at: "2019-12-18 18:08:24",
        //     children: [
        //       {
        //         id: "167_41",
        //         serial: "1-1",
        //         name: "test_1218_p_001",
        //         client_id: "167",
        //         created_at: "2019-12-18 18:09:07",
        //         updated_at: "2019-12-18 18:09:07",
        //         ids: "41",
        //         children: [
        //           {
        //             id: "167_41_219",
        //             serial: "1-1-1",
        //             product_id: "219",
        //             name: "test_1218_k_001",
        //             brand_id: "41",
        //             created_at: "2019-12-18 18:09:24",
        //             updated_at: "2019-12-18 18:09:24"
        //           }
        //         ]
        //       }
        //     ]
        //   }
        // ];

        this.cards = data;

        if (this.cards && this.cards.length > 0) {
          this.blankTips = "";
        } else {
          if (this.client == "" && this.brand == "" && this.keywords == "") {
            this.blankTips = "Please Create your first client's information, including brands and products.";
          } else {
            this.blankTips = "No data Found.";
          }
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    handle_add_client() {
      this.dialog.isVisible = true;
      this.dialog.isEdit = false;
    },
    handle_card_list_edit(data) {
      if (data.level == 1) {
        this.dialog.type = "client";
      } else if (data.level == 2) {
        this.dialog.type = "brand";
      } else if (data.level == 3) {
        this.dialog.type = "product";
      }
      this.dialog.ids.currentId = data.id;

      this.dialog.isEdit = true;
      this.dialog.isVisible = true;
    },
    handle_card_list_add(data) {
      if (data.level == 1) {
        this.dialog.type = "client";
      } else if (data.level == 2) {
        this.dialog.type = "brand";
        this.dialog.ids.parentId = data.id;
      } else if (data.level == 3) {
        this.dialog.type = "product";
        this.dialog.ids.parentId = data.id;
      }
      this.dialog.ids.parentId = data.id;

      this.dialog.isEdit = false;
      this.dialog.isVisible = true;
    },

    //删除
    async handle_card_list_delete(data) {
      let type = "";
      if (data.level == 1) {
        type = "client";
      } else if (data.level == 2) {
        type = "brand";
      } else if (data.level == 3) {
        type = "product";
      }

      await fetch.post("/user/delclient", { id: data.id, type }).catch(err => {
        this.$message.error(err.message);
      });

      this.$message.success("Deleted");

      //如果删除的是过滤的那个，则删除成功后，直接将过滤选中的清空。避免无法匹配出现数字
      if (type == "client") {
        this.client = "";
        this.get_custom_filter_list();
        this.get_clients_list();
      } else if (type == "brand") {
        this.brand = "";
        this.get_brand_filter_list();
      } else {
        this.get_brand_filter_list();
      }
    },
    handle_dialog_close() {
      this.dialog.isVisible = false;
    },
    handle_dialog_submit() {
      this.get_custom_filter_list();
      this.get_brand_filter_list();
      this.dialog.isVisible = false;
    },

    async fetch_industry_list() {
      let data = [{ id: 1, name: "Transportation" }, { id: 2, name: "Medical Services" }, { id: 3, name: "Consumer electronics" }];

      // let { data } = await fetch.get("/user/getindustry").catch(err=>{this.$message.error(err.message);});
      this.industryList = data;
    }
  },

  mounted() {
    this.fetch_industry_list();
    this.get_custom_filter_list();
    this.get_brand_filter_list();
  }
};
</script>
<style lang="scss" scoped>
.clients {
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
