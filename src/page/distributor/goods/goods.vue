<template>
  <div id="wrapper">
      <v-menus></v-menus>
      <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
        <v-top></v-top>
        <div class="wrapper wrapper-content ">
          <div class="row">
            <div class="col-lg-12">
              <div class="ibox float-e-margins">
                <div class="ibox-title"> 商品列表 </div>
                <div class="ibox-content">
                  <div class="row m-b-sm ">
                  <div class="col-lg-6">
                    <router-link class="btn btn-primary btn-sm" to="/v_distributor_goods_save">新增商品</router-link>
                  </div>
                  <div class="col-lg-6 text-right">
                          <div class="btn-group btn-group-sm">
                          <button data-toggle="dropdown" class="btn btn-default dropdown-toggle" aria-expanded="false">{{resarch.curCategory.categoriesName}} <span class="caret"></span></button>
                            <ul class="dropdown-menu">
                              <li @click="categroyChange(index)" v-for="(item,index) in categoryList" :key="index" ><a href="javascript:;;">{{ item.categoriesName }}</a></li>
                            </ul>
                          </div>
                          <div class="search-box">
                          <div class="input-group">
                            <input type="text" placeholder="搜索商品名称或编号" class="input-sm form-control"  v-model="resarch.productName" maxlength="20">
                            <span class="input-group-btn">
                            <button type="button" class="btn btn-sm btn-primary" @click="rearchSubmit()" > 搜索</button>
                            </span></div>
                          </div>
                          <button type="button" class="btn btn-sm btn-default " data-toggle="modal" href="#search-more">高级搜索</button>
                          </div>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>编号</th>
                          <th>名称</th>
                          <th>分类</th>
                          <th>进货价 </th>
                          <th>建议售价 </th>
                          <th>最低售价 </th>
                          <th>一级分销价 </th>
                          <th>二级分销价 </th>
                          <th>三级分销价 </th>
                          <th>库存 </th>
                          <th>状态 </th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in list" :key="index">
                          <td> {{item.productNo}}</td>
                          <td><img v-bind:src="img.realUrl" v-if="imgIndex==0" class="img-lg" v-for="(img,imgIndex) in item.images" :key="imgIndex"> {{item.productName}} </td>
                          <td> {{item.categoriesName}} </td>
                          <td> ￥{{item.minRetailPrice}} </td>
                          <td> ￥{{item.recommendedRetailPrice}} </td>
                          <td> ￥{{item.minRetailPrice}} </td>
                          <td> ￥30.00 </td>
                          <td> ￥35.00 </td>
                          <td> ￥40.00 </td>
                          <td> {{item.stock}} </td>
                          <td><span class="label label-primary">在售</span></td>
                          <td>
                              <router-link :to="{ name: 'DistributorGoodsDetail', params: { id: item.id }}" class="btn-white btn btn-sm">查看</router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <v-empty :isShow="parentTotalPage==0"></v-empty>
                    <page :pageSize="pageSize" v-if="parentTotalPage>0" :total="parentTotalPage" show-total :current="pageNo" @on-change="parentCallback"></page>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="search-more" class="modal fade" aria-hidden="true" style="display: none;">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
              <h4 class="modal-title">高级搜索</h4>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-sm-12">
                  <form class="form-horizontal">
                    <div class="form-group">
                      <label class="col-lg-2 control-label">状态</label>
                      <div class="col-lg-4">
                        <select v-model="resarch.status" class="form-control">
                          <option value="">全部</option>
                          <option value="1">在售</option>
                          <option value="0">停售</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="advRearchSubmit()" type="button" class="btn btn-primary">保存</button>
              <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
            </div>
          </div>
        </div>
      </div>
   </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import * as types from "@/store/mutation-types.js";

import vMenus from "@/components/menus/menus.vue";
import vTop from "@/components/top/top.vue"
import { Page } from "iview";

import vEmpty from "@/components/empty/empty.vue";

export default {
  components: {
    vMenus,
    vTop,
    vEmpty,
    Page
  },
  data() {
    return {
      loading: false,
      index: -1,
      list: [],
      resarch: {
        categoriesId: "",
        curCategory:{},
        status: "",
        productName: ""
      },
      categoriesIdMap: [],
      categoryList: [],
      parentTotalPage: 0,
      pageNo: 1,
      pageSize:15,
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.resarch.status = "";
    this.categoryListData();
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    advRearchSubmit:function(){
      this.pageNo = 1;
      this.listData();
      $("#search-more").modal("hide");
    },
    showAdv:function(){
      $("#search-more").modal("show");
    },
    rearchSubmit: function() {
      this.pageNo = 1;
      this.listData();
    },
    parentCallback(cPage) {
      this.pageNo = cPage;
      this.listData();
    },
    listData() {
      let _this = this;
      _this.PUSH_LOADING();
      let param = ['isOwner=false'];
      param.push("pageNum=" + _this.pageNo);
      param.push("pageSize=" + _this.pageSize);
      if (!_this.$lodash.isEmpty(_this.resarch.productName)) {
        param.push("queryKey=" + _this.resarch.productName);
      }
      if (this.resarch.curCategory.id) {
        param.push("categoriesId=" + this.resarch.curCategory.id);
      }
      if (parseInt(_this.resarch.status) > -1) {
        param.push("status=" + _this.resarch.status);
      }
      _this.$axios
        .get("products?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.parentTotalPage = res.total;
          _this.$lodash.forEach(res.list, function(item) {
              let _category = _this.categoriesIdMap[item.categoriesId];
              item.categoriesName = _category ? _category.categoriesName : "";
               _this.$lodash.forEach(item.images,function(img,imgIndex){
                    let code = img.imageCode.replace('product/','');
                    img.realUrl = imgCdn + code;
                })
          });
          _this.list = res.list;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    },
    categroyChange:function(index){
      let cur = this.categoryList[index];
      this.resarch.curCategory = cur;
       this.pageNo = 1;
      this.listData();
    },
    categoryListData() {
      let _this = this;
      _this.$axios
        .get("categories")
        .then(result => {
          let tempArr = [];
          tempArr.push({ categoriesName: "全部", id: "" });
          tempArr = tempArr.concat(result.data);
          _this.$lodash.forEach(result.data, function(item) {
            _this.categoriesIdMap[item.id] = item;
          });

          _this.categoryList = tempArr;
          this.resarch.curCategory = tempArr[0];
        })
        .catch(err => {});
    }
  }
};
</script>