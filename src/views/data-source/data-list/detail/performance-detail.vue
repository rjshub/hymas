<template>
    <div class="performance-detail">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <div class="info-area">
                <div class="title">
                    ELC Performance
                    <span style="width:30px;"></span>

                    <div v-hover
                        class="campaign">
                        <span>{{info.campaign}}</span>
                    </div>

                </div>
                <div class="info">
                    Cycle: {{info.cycle}}
                    <span class="divide">|</span>
                    Name: {{info.name}}
                    <span class="divide">|</span>
                    Updated on: {{info.updateTime}}
                </div>
                <div class="download">
                    <el-button size="mini"
                        @click="handle_download"
                        title="Download"
                        class="iconfont mas-download"></el-button>
                </div>
            </div>
            <div class="table-wrap">
                <el-table :data="tableData"
                    height="100px"
                    stripe
                    style="min-height:100%;width: 100%"
                    header-row-class-name="blue">
                    <el-table-column min-width="80"
                        align="center"
                        prop="id">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>条目编号</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="group">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>品牌集团</span>
                                <span>Group</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="brand">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>客户</span>
                                <span>Brand</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="category">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>产品大类别</span>
                                <span>Category</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="sub_category">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>产品小类别</span>
                                <span>Sub-Category</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="product_line">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>产品线</span>
                                <span>Product Line</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="product">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>具体产品</span>
                                <span>Product</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign名称</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_type">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign类型</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="trade_no">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>交易汇总单号</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_begin_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign开始自然年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_begin_month">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign开始月</span>
                                <span>(英文缩写)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_begin_date">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign开始日</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_end_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign结束自然年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_end_month">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign结束月</span>
                                <span>(英文缩写)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_end_date">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>campaign结束日</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="advertising_time">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>时间</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>自然年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="civil_month">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>月</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="80"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="fiscal_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>财年</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>媒体</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="250"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="channel">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>频道</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="250"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="ad_pos">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>广告位置</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        :show-overflow-tooltip="true"
                        prop="buy_type">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>购买形式</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="200"
                        align="center"
                        :show-overflow-tooltip="true"
                        prop="data_no">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>广告位置编码</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_start">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>开始时间</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="campaign_end">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>结束时间</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="total_cost">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Total Cost</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.total_cost_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.total_cost_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.total_cost }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.total_cost}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="net_price">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>净价</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.net_price_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.net_price_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.net_price }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.net_price}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="third_monitor_show">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>曝光是否第三方检测</span>
                                <span>(Y/N)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="predict_show">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>预估曝光</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.predict_show_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.predict_show_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.predict_show }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.predict_show}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="show">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>媒体实际曝光</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.show_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.show_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.show }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.show}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="third_predict_show">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>第三方实际曝光</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.third_predict_show_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.third_predict_show_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.third_predict_show }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.third_predict_show}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="show_uv">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>曝光UV</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.show_uv_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.show_uv_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.show_uv }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.show_uv}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="third_monitor_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>点击是否第三方检测</span>
                                <span>(Y/N)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="predict_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>预估点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.predict_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.predict_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.predict_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.predict_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>媒体实际点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="third_predict_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>第三方实际点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.third_predict_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.third_predict_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.third_predict_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.third_predict_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="unique_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>unique click</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.unique_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.unique_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.unique_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.unique_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="arrival_visit">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>到达页访问数</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.arrival_visit_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.arrival_visit_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.arrival_visit }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.arrival_visit}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="other_visit">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>官网其他页面访问数</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.other_visit_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.other_visit_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.other_visit }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.other_visit}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_group">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-媒体集团</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_name_en">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-媒体</span>
                                <span>(英)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_name_zh">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-媒体</span>
                                <span>(中)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="maintenance_channel">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-频道</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="ad_pos_name">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-广告位置名称</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="buy_unit">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-购买单位</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="platform">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-Platform</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="city_zh">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-City</span>
                                <span>(中)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_type_big">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-Media Type</span>
                                <span>(大类别)</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="media_type_small">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-Media Type</span>
                                <span>(小类别)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="form_label_1">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-Format</span>
                                <span>(Label 1)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="form_label_2">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-Format</span>
                                <span>(Label 2)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="form_label_3">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>编码表-Format</span>
                                <span>(Label 3)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="cost_year">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>费用发生财年</span>
                                <span>(财务归属)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="procedure_type">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>程序化程度</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="ta_definition">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>TA definition</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.ta_definition_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.ta_definition_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.ta_definition }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.ta_definition}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="material_1">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>物料类型</span>
                                <span>(分类1)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="material_2">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>物料类型</span>
                                <span>(分类2)</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="landingpage_type">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>landingpage类型</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="300"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="landingpage_url">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>landingpage URL</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="160"
                        align="center"
                        prop="others_engagement">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Others Engagement</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.others_engagement_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.others_engagement_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.others_engagement }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.others_engagement}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="engagement_rate">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Engagement rate</span>
                                <span>(%)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.engagement_rate_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.engagement_rate_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.engagement_rate }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.engagement_rate}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="cpe">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>CPE</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.cpe_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.cpe_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.cpe }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.cpe}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="180"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="wechat_engagement">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>WeChat Engagement</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.wechat_engagement_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.wechat_engagement_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.wechat_engagement }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.wechat_engagement}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="210"
                        :show-overflow-tooltip="true"
                        align="center"
                        prop="wechat_engagement_rate">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat Engagement rate</span>
                                <span>(%)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.wechat_engagement_rate_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.wechat_engagement_rate_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.wechat_engagement_rate }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.wechat_engagement_rate}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="wechat_cpe">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat CPE</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.wechat_cpe_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.wechat_cpe_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.wechat_cpe }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.wechat_cpe}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="wechat_follower">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat Follower</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.wechat_follower_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.wechat_follower_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.wechat_follower }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.wechat_follower}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="wechat_cpf">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat CPF</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.wechat_cpf_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.wechat_cpf_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.wechat_cpf }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.wechat_cpf}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="video_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat视频点击</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.video_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.video_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.video_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.video_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180"
                        align="center"
                        prop="out_video">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat外层小视频播放</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.out_video_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.out_video_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.out_video }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.out_video}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="zan">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat点赞</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.zan_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.zan_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.zan }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.zan}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="comment">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat评论</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.comment_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.comment_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.comment }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.comment}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="comment_person">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat评论</span>
                                <span>(人)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.comment_person_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.comment_person_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.comment_person }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.comment_person}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="avatar_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat头像点击</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.avatar_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.avatar_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.avatar_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.avatar_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="nickname_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat昵称点击</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.nickname_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.nickname_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.nickname_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.nickname_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="not_interest">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat不感兴趣</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.not_interest_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.not_interest_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.not_interest }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.not_interest}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="share_friend">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat分享好友</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.share_friend_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.share_friend_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.share_friend }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.share_friend}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="share_pyq">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat分享朋友圈</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.share_pyq_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.share_pyq_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.share_pyq }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.share_pyq}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="collect">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Wechat收藏</span>
                                <span>(次)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.collect_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.collect_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.collect }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.collect}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="160"
                        align="center"
                        prop="weibo_engagement">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo Engagement</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.weibo_engagement_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.weibo_engagement_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.weibo_engagement }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.weibo_engagement}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        align="center"
                        prop="weibo_engagement_rate">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo Engagement rate</span>
                                <span>(%)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.weibo_engagement_rate_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.weibo_engagement_rate_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.weibo_engagement_rate }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.weibo_engagement_rate}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="weibo_cpe">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo CPE</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.weibo_cpe_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.weibo_cpe_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.weibo_cpe }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.weibo_cpe}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="reads">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo阅读数</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.reads_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.reads_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.reads }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.reads}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="cpmr">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo千人阅读成本</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.cpmr_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.cpmr_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.cpmr }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.cpmr}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="forward">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo转发</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.forward_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.forward_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.forward }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.forward}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="comments">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo评论</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.comments_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.comments_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.comments }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.comments}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="like">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo点赞</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.like_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.like_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.like }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.like}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="weibo_collect">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo收藏</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.weibo_collect_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.weibo_collect_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.weibo_collect }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.weibo_collect}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="url_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo短链点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.url_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.url_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.url_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.url_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="image_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo图片点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.image_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.image_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.image_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.image_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="topic_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo话题点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.topic_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.topic_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.topic_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.topic_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="at_click">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo @点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.at_click_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.at_click_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.at_click }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.at_click}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="click_to_home">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo点击进去正文页</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.click_to_home_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.click_to_home_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.click_to_home }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.click_to_home}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="avator_clicks">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo头像点击</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.avator_clicks_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.avator_clicks_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.avator_clicks }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.avator_clicks}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="diversion">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo导流数</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.diversion_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.diversion_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.diversion }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.diversion}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="broadcast">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo总播放数</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.broadcast_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.broadcast_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.broadcast }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.broadcast}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="weibo_follower">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo Follower</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.weibo_follower_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.weibo_follower_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.weibo_follower }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.weibo_follower}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="weibo_cpf">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>Weibo CPF</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.weibo_cpf_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.weibo_cpf_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.weibo_cpf }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.weibo_cpf}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="pv">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ PV</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.pv_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.pv_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.pv }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.pv}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        align="center"
                        prop="uv">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ UV</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.uv_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.uv_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.uv }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.uv}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="visit">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ Visit</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.visit_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.visit_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.visit }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.visit}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="bounce">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ bounce</span>
                                <span>(数值)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.bounce_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.bounce_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.bounce }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.bounce}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="avg_duration">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ AVG.Duration</span>
                                <span>(s)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.avg_duration_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.avg_duration_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.avg_duration }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.avg_duration}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        align="center"
                        prop="login">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ登录</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.login_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.login_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.login }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.login}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="150"
                        align="center"
                        prop="homepage">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ官网首页</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.homepage_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.homepage_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.homepage }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.homepage}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="activity_detail">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ活动详情</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.activity_detail_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.activity_detail_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.activity_detail }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.activity_detail}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="submit">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ提交按钮</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.submit_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.submit_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.submit }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.submit}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="register">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ注册</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.register_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.register_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.register }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.register}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150"
                        align="center"
                        prop="leads">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ Leads</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.leads_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.leads_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.leads }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.leads}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="200"
                        align="center"
                        prop="remark">
                        <template v-slot:header>
                            <div class="header-title">
                                <span>MZ Remark</span>
                                <span>(热话/热搜 etc细节KPI)</span>
                            </div>
                        </template>
                        <template v-slot="scope">
                            <div class="column-text">
                                <el-tooltip v-if="scope.row.remark_display"
                                    effect="dark"
                                    :content="getShowDisplayText(scope.row.remark_display)"
                                    placement="top-start">
                                    <div>{{ scope.row.remark }}</div>
                                </el-tooltip>
                                <div v-else>
                                    {{scope.row.remark}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-area">
                <el-pagination background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pageSizesArr"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";

export default {
  name: "Performance-Detail",
  components: { breadCrumb },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [
        { path: "/data-source/data-list", name: "Data Source" },
        { path: "/data-source/data-list", name: "Data List" },
        { path: "", name: "ELC Performance" }
      ],

      info: {
        campaign: "",
        name: "",
        cycle: "",
        updateTime: ""
      },

      currentPage: 1,
      pageSizesArr: [20, 50, 100],
      pageSize: 20,
      total: 0,

      tableData: []
    };
  },
  computed: {},

  methods: {
    ...mapActions("dataSource/dataList", ["fetch_performance_detail", "fetch_elc_download"]),

    get_table_list() {
      let param = {
        id: this.$route.query.id,
        perpage: this.pageSize,
        page: this.currentPage
      };

      this.isLoading = true;
      this.fetch_performance_detail(param)
        .then(res => {
          this.isLoading = false;
          let data = res.data;

          this.info.campaign = data.campaign;
          this.info.name = data.name;
          this.info.cycle = data.cycle;
          this.info.updateTime = data.updated_at;

          this.total = Number(data.total);

          this.tableData = data.list;
        })
        .catch(err => {
          this.isLoading = false;
          this.$message.error(err.message);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;

      this.get_table_list();
    },

    handleCurrentChange(val) {
      this.currentPage = val;

      this.get_table_list();
    },

    handle_download() {
      this.fetch_elc_download({ type: "1", id: [this.$route.query.id] })
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    getShowDisplayText(value) {
      return String(value);
    }
  },

  mounted() {
    this.get_table_list();
  }
};
</script>
<style lang="scss" scoped>
.performance-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    .info-area {
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      height: 150px;
      background-color: white;

      .title {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        color: #333333;

        .campaign {
          width: 400px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .info {
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: #909399;
      }

      .divide {
        display: inline-block;
        width: 20px;
        text-align: center;
      }
    }
    .table-wrap {
      display: flex;
      flex: 1;
      contain: strict;

      //滚动条大小
      ::v-deep ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::v-deep .el-table {
        td,
        th {
          padding: 5px 0 5px 0;
        }
      }

      .header-title {
        text-align: center;
        vertical-align: middle;
        padding-left: 0 !important;
        padding-right: 0 !important;
        span {
          display: block;
          line-height: 1;
        }
      }
    }

    .pagination-area {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 40px;
      background-color: white;
    }
  }
}
</style>