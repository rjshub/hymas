<template>
    <div class="formatSetting-container">
      <breadCrumb :values="breadCrumbList"></breadCrumb>  
      <main>
        <div class="tools">
          <hy-box>
            <el-button :disabled="format_create"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="handle_add_format">Create data source format</el-button>
          </hy-box>

          <div class="filter">
            <hy-box>
              <el-select v-model="form.client"
                  size="mini"
                  filterable
                  placeholder="Select Client"
                  style="width:150px;"
                  @change="handle_change_client">
                  <el-option label="All Clients" value=""></el-option>
                  <el-option v-for="(item,index) in clientOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </hy-box>

            <hy-box>
              <el-date-picker size="mini"
                  style="width:220px"
                  v-model="form.date"
                  type="daterange"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="Start Date"
                  end-placeholder="End Date"
                  @change="handle_change_date">
              </el-date-picker>
            </hy-box>

            <hy-box>
              <el-input size="mini"
                  style="width:250px"
                  placeholder="Please enter keywords"
                  @keyup.enter.native="handle_change_keywords"
                  v-model="form.keywords">
                  <template v-slot:append>
                      <el-button icon="el-icon-search"
                          @click="handle_change_keywords"></el-button>
                  </template>
              </el-input>
            </hy-box>
          </div>
        </div>

        <div class="main">
          <router-view />
        </div>
      </main>
    </div>
</template>

<script type="text/javascript">
import { mapActions, mapState } from 'vuex'
import breadCrumb from "@/components/common/bread-crumb"
import createIndex from './createIndex'
import listIndex from './listIndex'

export default {
  name: "containerName",
  components: { breadCrumb, createIndex, listIndex },
  data() {
    return {
      breadCrumbList: [{ path: "/data-source", name: "Data Source" }, { path: "", name: "Format Setting" }],
      clientOptions: [],
      form: {
        client: '',
        date: [],
        keywords: ''
      }
    }
  },
  computed: {
    ...mapState("dataSource/formatSetting", [
      "format_create"
    ])
  },
  methods: {
    ...mapActions("home", ["fetch_filter_list"]),
    handle_add_format() {
      this.$router.push({path: 'create'})
    },
    get_format_list() {
      console.log('request list')
    },
    handle_change_client() {
      this.get_format_list()
    },
    handle_change_date() {
      this.$set(this.form, 'start', this.form.date[0])
      this.$set(this.form, 'end', this.form.date[1])
      this.get_format_list()
    },
    handle_change_keywords() {
      this.get_format_list()
    }
  },
  mounted() {
    this.fetch_filter_list({ type: "client", value: "" })
      .then(res => {
        this.clientOptions = res;
      })
      .catch(err => {});
  }
}
</script>

<style lang="scss" scoped>
  .formatSetting-container {
    margin: 10px 10px 0 10px;
    flex: 1;
    display: flex;
    flex-flow: column;
    main {
      flex: 1;
      display: flex;
      flex-flow: column;
      .tools {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }
      .main {
        flex: 1;
      }
    }
  }
</style>
