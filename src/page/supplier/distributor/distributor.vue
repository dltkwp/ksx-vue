<template>
    <div id="wrapper">
    <v-menus></v-menus>
    <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
      <v-top></v-top>
      <div class="wrapper wrapper-content animated fadeInRight">
         <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
           <div class="ibox-title">
           	分销商列表
           </div>
            <div class="ibox-content">
				 <div class="row m-b-sm ">
                    <div class="col-lg-6">
                      <button class="btn btn-primary btn-sm" data-toggle="modal" href="#distroibutor-add">新增分销商</button>
                    </div>
                    <div class="col-lg-6 text-right">
                      <div class="btn-group btn-group-sm">
                        <button data-toggle="dropdown" class="btn btn-default dropdown-toggle" aria-expanded="false">{{curLevel.levelName}} <span class="caret"></span></button>
                        <ul class="dropdown-menu">
                          <li @click="levelChange(index)" v-for="(item,index) in levelList" :key="index"><a href="javascript:;;">{{item.levelName}}</a></li>
                        </ul>
                      </div>
                      <div class="search-box">
                        <div class="input-group">
                          <input v-model="queryKey" type="text" placeholder="搜索分销商姓名/电话" class="input-sm form-control" maxlength="20">
                          <span class="input-group-btn">
                          <button @click="rearchSubmit()" type="button" class="btn btn-sm btn-primary"> 搜索</button>
                          </span></div>
                      </div>
                      
                 
                  </div>
				</div>
             
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>等级</th>
                      <th>姓名 </th>
                      <th>电话 </th>
                      <th>支付宝 </th>
                      <th>微信 </th>
                      <th>订单数 </th>
                      <th>总支付金额 </th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>一级分销商</td>
                      <td>王杰</td>
                      <td>15242612898</td>
                      <td>15242612898</td>
                      <td>wj2252621</td>
                      <td>20</td>
                      <td>￥3200</td>
                      <td><div class="btn btn-sm btn-default" data-toggle="modal" href="#modal-send">历史订单</div></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>二级分销商</td>
                      <td>张雨濛</td>
                      <td>13238078321</td>
                      <td>13238078321</td>
                      <td>zhangyumeng</td>
                      <td>10</td>
                      <td>￥1000</td>
                      <td><div class="btn btn-sm btn-default" data-toggle="modal" href="#modal-send">历史订单</div></td>
                    </tr>
                  </tbody>
                </table>
               
            <div id="distroibutor-add" class="modal fade" aria-hidden="true" style="display: none;">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">新增分销商</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                        <div class="col-sm-12">
                            <form role="form">
                            <div class="form-group">
                                <label>姓名*</label>
                                <input type="text" placeholder="请输入姓名" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>电话*</label>
                                <input type="text" placeholder="请输入电话" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>等级*</label>
                                <select class="form-control">
                                <option></option>
                                
                                <option>一级分销商</option>
                                <option>二级分销商</option>
                                <option>三级分销商</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>初始登录密码</label>
                                <input type="text" value="12345678" placeholder="可后续自行进行修改" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>支付宝</label>
                                <input type="text" placeholder="输入支付宝后方便转账时进行查询（非必填）" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>微信</label>
                                <input type="text" placeholder="输入微信号后方便转账时进行查询（非必填）" class="form-control">
                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary">保存</button>
                        <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                    </div>
                    </div>
                </div>
            </div>

            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <v-foot></v-foot>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as types from "@/store/mutation-types.js";

import vMenus from "@/components/menus/menus.vue";
import vTop from "@/components/top/top.vue";
import vFoot from "@/components/foot/foot.vue";

import pagination from "@/components/pagination/pagination.vue";

export default {
  components: {
    vMenus,
    vTop,
    vFoot,
    pagination
  },
  data() {
    return {
      loading: false,
      list: [],
      parentTotalPage: 0,
      parentCurrentpage: 1,
      levelList: [],
      curLevel:{
        "discount": 0,
        "id": 0,
        "initialFee": 0,
        "levelName": "全部"
      },
      queryKey:""
    };
  },
  mounted() {
    this.getLevelList();
    this.parentCurrentpage = 1;
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    parentCallback(cPage) {
      this.parentCurrentpage = cPage;
      this.listData();
    },
    showAddModal:function(){
        
    },
    rearchSubmit:function(){
        this.parentCurrentpage = 1;
        this.listData();
    },
    levelChange:function(index){
        let cur = this.levelList[index];
        this.curLevel = cur;
        this.parentCurrentpage = 1;
        this.listData();
    },
    getLevelList: function() {
      let _this = this;
      _this.PUSH_LOADING();
      _this.$axios
        .get("distributorLevels")
        .then(result => {
          let res = result.data;
          let arr = [];
          arr.push({
                "discount": 0,
                "id": 0,
                "initialFee": 0,
                "levelName": "全部"
            });
            arr = arr.concat(res);
          _this.levelList = arr;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    },
    listData() {
      let _this = this;
      let param = [];
      param.push("pageNum=" + _this.parentCurrentpage);
      param.push("pageSize=" + 15);
      let queryKey = _this.queryKey.trim();
      if(queryKey){
         param.push("queryKey=" + queryKey);
      }
      if(_this.curLevel &&  parseInt(_this.curLevel.id)>0){
         param.push("levelId=" + _this.curLevel.id);
      }

      _this.PUSH_LOADING();
      _this.$axios
        .get("user/dealer?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.parentTotalPage = res.pages;
          _this.list = res.list;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    }
  }
};
</script>