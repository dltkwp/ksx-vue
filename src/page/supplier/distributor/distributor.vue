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
                    <tr v-for="(item,index) in list" :key="index">
                      <td>{{index + 1}}</td>
                      <td>{{item.levelName}}</td>
                      <td>{{item.username}}</td>
                      <td>{{item.phone}}</td>
                      <td>{{item.alipay}}</td>
                      <td>{{item.wechart}}</td>
                      <td>{{item.sumOrder||0}}</td>
                      <td>￥{{item.sumPay||0}}</td>
                      <td><div class="btn btn-sm btn-default" data-toggle="modal" href="#modal-send">历史订单</div></td>
                    </tr>
                  </tbody>
                </table>
                <v-empty :isShow="parentTotalPage==0"></v-empty>
                <pagination  :totalPage="parentTotalPage" :currentPage="parentCurrentpage" :changeCallback="parentCallback"></pagination>
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
                                    <input v-model="save.name" type="text" placeholder="请输入姓名" class="form-control" maxlength="15" >
                                </div>
                                <div class="form-group">
                                    <label>电话*</label>
                                    <input v-model="save.mobile" type="text" placeholder="请输入电话" class="form-control" maxlength="11">
                                </div>
                                <div class="form-group">
                                    <label>等级*</label>
                                    <select v-model="save.levelId" class="form-control">
                                        <option v-for="(item,index) in save.levelList " :key="index" v-bind:value="item.id">
                                          {{ item.levelName }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>初始登录密码</label>
                                    <input v-model="save.password" type="text"  maxlength="20" placeholder="可后续自行进行修改" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>支付宝</label>
                                    <input  v-model="save.alipay" type="text"  maxlength="20" placeholder="输入支付宝后方便转账时进行查询（非必填）" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label>微信</label>
                                    <input  v-model="save.wechart" type="text"  maxlength="20"  placeholder="输入微信号后方便转账时进行查询（非必填）" class="form-control">
                                </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button  v-bind:disabled="loading" v-bind:readonly="loading" @click="saveSubmit()" type="button" class="btn btn-primary">保存</button>
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
import vEmpty from "@/components/empty/empty.vue";

import pagination from "@/components/pagination/pagination.vue";

export default {
  components: {
    vMenus,
    vTop,
    vFoot,
    vEmpty,
    pagination
  },
  data() {
    return {
      loading: false,
      list: [],
      parentTotalPage: 0,
      parentCurrentpage: 1,
      levelList: [],
      curLevel: {
        discount: 0,
        id: 0,
        initialFee: 0,
        levelName: "全部"
      },
      queryKey: "",
      save: {
        levelList: [],
        levelId: "",
        name: "",
        mobile: "",
        password: "12345678",
        wechart: "",
        alipay: ""
      }
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.getLevelList();
    this.parentCurrentpage = 1;
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    saveSubmit: function() {
      let _this = this;
      let name = _this.save.name.trim();
      let mobile = _this.save.mobile.trim();
      let password = _this.save.password.trim();
      let wechart = _this.save.wechart.trim();
      let alipay = _this.save.alipay.trim(); ///user/dealer

      if (name == "") {
        _this.$toast.warning("名称不可为空");
        return false;
      }
      if (!mobileValidate(mobile)) {
        _this.$toast.warning("电话格式不正确");
        return false;
      }
      if (!pwdValidate(password)) {
        _this.$toast.warning("密码格式不正确");
        return false;
      }

      _this.PUSH_LOADING();
      _this.loading = true;
      _this.$axios
        .post("user/dealer", {
          phone: mobile,
          realname: name,
          username: name,
          wechart: wechart,
          alipay: alipay,
          password: password,
          levelId: _this.save.levelId
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                  _this.$toast.success("操作成功");
                  _this.parentCurrentpage = 1;
                  _this.loading = false;
                  _this.listData();
                  _this.SHIFT_LOADING();
                  $("#distroibutor-add").modal("hide");
              }
              break;
            default: {
              _this.loading = false;
              _this.$toast.error(res.msg);
            }
          }
        })
        .catch(err => {
          _this.loading = false;
          _this.SHIFT_LOADING();
        });
    },
    parentCallback(cPage) {
      this.parentCurrentpage = cPage;
      this.listData();
    },
    showAddModal: function() {
      let _this = this;
      _this.save.name = "";
      _this.save.mobile = "";
      _this.save.password = "";
      _this.save.wechart = "";
      _this.save.alipay = "";
      if(_this.save.levelList.length>0){
        _this.save.levelId = _this.save.levelList[0].id;
      }
      $("#distroibutor-add").modal("show");
    },
    rearchSubmit: function() {
      this.parentCurrentpage = 1;
      this.listData();
    },
    levelChange: function(index) {
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
          _this.save.levelList = res;
          if (_this.save.levelList.length > 0) {
            _this.save.levelId = _this.save.levelList[0].id;
          }
          let arr = [];
          arr.push({
            discount: 0,
            id: 0,
            initialFee: 0,
            levelName: "全部"
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
      if (queryKey) {
        param.push("queryKey=" + queryKey);
      }
      if (_this.curLevel && parseInt(_this.curLevel.id) > 0) {
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