<template>
    <div id="wrapper">
    <v-menus></v-menus>
    <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
      <v-top></v-top>
      <div class="wrapper wrapper-content">
         <div class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title"> 顾客列表 </div>
                    <div class="ibox-content">
                        <div class="row m-b-sm ">
                            <div class="col-lg-6">
                            <button class="btn btn-primary btn-sm" @click="showAddModal()">新增顾客</button>
                            </div>
                            <div class="col-lg-6 text-right">
                            <div class="search-box">
                                <div class="input-group">
                                <input type="text" v-model="queryKey" maxlength="20" placeholder="搜索顾客姓名/电话" class="input-sm form-control">
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
                            <th>姓名 </th>
                            <th>电话 </th>
                            <th>收货地址 </th>
                            <th>备注 </th>
                            <th>订单数 </th>
                            <th>总支付金额 </th>
                            <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in list" :key="index">
                                <td>{{index + 1}}</td>
                                <td>{{item.realname}}</td>
                                <td>{{item.recipientsPhone}}</td>
                                <td>{{item.recipientsAddress}}</td>
                                <td>{{item.comment}}</td>
                                <td>{{item.sumOrder || 0}}</td>
                                <td>￥{{(item.sumPay || 0).toFixed(2)}}</td>
                                <td><div class="btn btn-sm btn-default" data-toggle="modal" href="#modal-send">历史订单</div></td>
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
    <div id="distroibutor-add" class="modal fade" aria-hidden="true" style="display: none;">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">新增顾客</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm-12">
                    <form role="form">
                    <div class="form-group">
                        <label>姓名*</label>
                        <input v-model="save.name" maxlength="12"  type="text" placeholder="请输入姓名" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>电话*</label>
                        <input  v-model="save.mobile" maxlength="11"  type="text" placeholder="请输入电话" class="form-control">
                    </div>
                        <div class="form-group">
                        <label>收货地址*</label>
                        <input  v-model="save.addr" maxlength="140"  type="text" placeholder="请输入收货地址" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>备注</label>
                        <textarea  v-model="save.remark" maxlength="140"   class="form-control"></textarea>
                    </div>
                    </form>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                <button type="button" @click="saveSubmit()"  class="btn btn-primary">保存</button>
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
import vTop from "@/components/top/top.vue";
import vEmpty from "@/components/empty/empty.vue";

import { Page } from "iview";


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
      list: [],
      parentTotalPage: 0,
      pageNo: 1,
      pageSize:15,
      queryKey: "",
      save: {
        name: "",
        mobile: "",
        addr: "",
        remark: ""
      }
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.pageNo = 1;
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    saveSubmit: function() {
      let _this = this;
      let name = _this.save.name.trim();
      let mobile = _this.save.mobile.trim();
      let addr = _this.save.addr.trim();
      let remark = _this.save.remark.trim(); 

      if (name == "") {
        _this.$toast.warning("名称不可为空");
        return false;
      }
      if (!mobileValidate(mobile)) {
        _this.$toast.warning("电话格式不正确");
        return false;
      }
      if (addr=='') {
        _this.$toast.warning("地址不可为空");
        return false;
      }

      _this.PUSH_LOADING();
      _this.loading = true;
      _this.$axios
        .post("user/normal", {
          realname:name,
          recipientsPhone: mobile,
          recipientsAddress: addr,
          comment:remark
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                _this.pageNo = 1;
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
      this.pageNo = cPage;
      this.listData();
    },
    showAddModal: function() {
      let _this = this;
      _this.save.name = "";
      _this.save.mobile = "";
      _this.save.addr = "";
      _this.save.remark = "";
      $("#distroibutor-add").modal("show");
    },
    rearchSubmit: function() {
      this.pageNo = 1;
      this.listData();
    },
    listData() {
      let _this = this;
      let param = [];
      param.push("pageNum=" + _this.pageNo);
      param.push("pageSize=" + _this.pageSize);
      let queryKey = _this.queryKey.trim();
      if (queryKey) {
        param.push("queryKey=" + queryKey);
      }
      _this.PUSH_LOADING();
      _this.$axios
        .get("user/normal?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.parentTotalPage = res.total;
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