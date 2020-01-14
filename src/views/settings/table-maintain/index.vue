<template>
    <div class="table-maintain">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="main">
            <div class="tools">
                <el-select v-model="filter.client"
                    size="mini"
                    filterable
                    placeholder="Select Client"
                    style="width:150px;margin-right:10px"
                    @change="handle_change_client">
                    <el-option v-for="(item,index) in clientOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-input v-model="filter.keywords"
                    size="mini"
                    placeholder="Please enter keywords"
                    style="width:250px"
                    @keyup.enter.native="fetch_maintenance_list">
                    <template v-slot:append>
                        <el-button icon="el-icon-search"
                            @click="fetch_maintenance_list"></el-button>
                    </template>
                </el-input>
            </div>

            <div class="cards">
                <div class="cards-verified">
                    <VerifiedCard :value="cards.verified"></VerifiedCard>
                </div>
                <div class="cards-mapping">
                    <MappingCard :values="cards.mapping"
                        @refresh="fetch_maintenance_list"></MappingCard>
                </div>

                <!--
                    <
                    <maintain-card
                    v-for="(item,index) in cards"
                    :value="item"
                    :key="index">
                    </maintain-card> -->
            </div>

        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";
import VerifiedCard from "./verified-card/index";
import MappingCard from "./mapping-card/index";

export default {
  name: "TableMaintain",
  components: { breadCrumb, VerifiedCard, MappingCard },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [{ path: "/settings", name: "Settings" }, { path: "", name: "Table Maintenance" }],
      clientOptions: [],
      filter: {
        client: "",
        keywords: ""
      },

      cards: {
        verified: {},
        mapping: []
      }
    };
  },

  methods: {
    ...mapActions("common", ["fetch_client_by_role"]),
    async init() {
      this.isLoading = true;

      try {
        this.clientOptions = await this.fetch_client_by_role();
        this.filter.client = this.clientOptions[0].id;

        await this.fetch_maintenance_list();

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    async fetch_maintenance_list() {
      let data = {
        verified: {
          id: 6,
          serial: "faljlfaj-faljfa-fajlfa",
          name: "Verified Fields",
          update_time: "09-08 15:38:07",
          download_url: "https://1233",
          isEdit: 1
        },
        mapping: [
          {
            id: 6,
            serial: "faljlfaj-faljfa-fajlfa",
            name: "Mapping Table",
            update_time: "09-08 15:38:07",
            upload_url: "/321321",
            download_url: "https://1233",
            isEdit: 1
          },
          {
            id: 7,
            serial: "faljlfaj-faljfa-fajlfa",
            name: "Mapping Table",
            update_time: "09-08 15:38:07",
            upload_url: "/321321",
            download_url: "https://1233",
            isEdit: 1
          }
        ]
      };

      try {
        // let { data } = await fetch.post("/maintenance/list", { client_id: this.filter.client, keywords: this.filter.keywords });
        this.cards.verified = data.verified || {};
        this.cards.mapping = data.mapping || [];
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    //

    handle_change_client() {}
  },

  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.table-maintain {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;

    .tools {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .cards {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;

      .cards-verified {
        margin-bottom: 20px;
      }

      .cards-mapping {
        flex: 1;
        display: flex;
      }
    }
  }
}
</style>
