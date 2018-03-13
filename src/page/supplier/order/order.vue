<template>
  <div id="wrapper">
    <v-menus></v-menus>
    <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
      <v-top></v-top>
      <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
          <div class="col-lg-12">
            <div class="ibox-content m-b-sm border-bottom">
              <div class="row">
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="date_added">订单时间</label>
                    <select class="form-control">
                      <option>全部</option>
                      <option>今日</option>
                      <option>本周</option>
                      <option>本月</option>
                      <option>其它时间</option>
                    </select>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="date_added">支付方式</label>
                    <select  v-model="rearch.payType" class="form-control">
                      <option value="">全部</option>
                      <option value="">暂未付款</option>
                      <option value="alipay">支付宝</option>
                      <option value="wepay">微信</option>
                    </select>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="date_added">状态</label>
                    <select v-model="rearch.status" class="form-control">
                      <option value="">全部</option>
                      <option value="WAIT">等待发货</option>
                      <option value="DELIVERY">已发货</option>
                      <option value="OVER">已签收</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="order_id">订单内容</label>
                    <input type="text" placeholder="搜索产品名称" class="form-control" v-model="rearch.content" maxlength="20">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="status">收货人</label>
                    <input type="text" placeholder="收货人姓名/电话" class="form-control" v-model="rearch.recipients" maxlength="20">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="customer">分销商</label>
                    <input type="text" placeholder="分销商姓名/电话" class="form-control" v-model="rearch.distributor" maxlength="20">
                  </div>
                </div>
                <button type="button" @click="rearchSubmit()" class="btn btn-primary">Rearch</button>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <div class="ibox">
                  <div class="ibox-title"> 订单列表 </div>
                  <div class="ibox-content">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>订单时间</th>
                          <th>订单内容 </th>
                          <th>收货人 </th>
                          <th>收货电话 </th>
                          <th>收货地址 </th>
                          <th>分销商 </th>
                          <th>支付金额 </th>
                          <th>支付方式</th>
                          <th>状态</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in list" :key="index">
                          <td>{{index + 1}}</td>
                          <td>{{item.timeStr}}</td>
                          <td>{{item.content}}</td>
                          <td>{{item.recipients}}</td>
                          <td>{{item.recipientsPhone}}</td>
                          <td>{{item.recipientsAddress}}</td>
                          <td>
                            <a href="#">王刚 13478659803</a>
                          </td>
                          <td>￥{{item.payment}}</td>
                          <td>{{item.payType}}</td>
                          <td>
                            <span class="label label-warning" v-if="item.status=='WAIT'">等待发货</span>
                            <span class="label label-primary" v-if="item.status=='DELIVERY'">已发货</span>
                          </td>
                          <td>
                            <div class="btn btn-sm btn-primary" @click="showSendModal(index)" v-if="item.status=='WAIT'">发货</div>
                            <div class="btn btn-sm btn-default" @click="showViewModal(index)" v-if="item.status=='DELIVERY'">查看物流单号</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="empty" v-if="parentTotalPage==0">
                      <div class="img"></div>
                      <div class="empty-info font-grey-salt">暂无数据</div>
                    </div>
                    <pagination  :totalPage="parentTotalPage" :currentPage="parentCurrentpage" :changeCallback="parentCallback"></pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 发货与更新物流信息 -->
          <div id="modal-send" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">×</span>
                    <span class="sr-only">Close</span>
                  </button>
                  <h4 class="modal-title">发货</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <label>快递公司</label>
                          <input v-model="send.company" type="text" placeholder="请输入快递公司" class="form-control" maxlength="50">
                        </div>
                        <div class="form-group">
                          <label>快递单号</label>
                          <input v-model="send.expressOrder" type="text" placeholder="请输入快递单号" class="form-control" maxlength="50">
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button v-bind:disabled="loading" v-bind:readonly="loading" type="button" @click="sendSubmit()" class="btn btn-primary">保存</button>
                  <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>

          <div id="modal-send-view" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">×</span>
                    <span class="sr-only">Close</span>
                  </button>
                  <h4 class="modal-title">发货</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <label>快递公司</label>
                          <input v-bind:readonly="!view.isEdit" v-model="view.company" type="text" placeholder="请输入快递公司" class="form-control" maxlength="50">
                        </div>
                        <div class="form-group">
                          <label>快递单号</label>
                          <input v-bind:readonly="!view.isEdit" v-model="view.expressOrder" type="text" placeholder="请输入快递单号" class="form-control" maxlength="50">
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button v-if="view.isEdit" v-bind:disabled="loading" v-bind:readonly="loading" type="button" @click="updateSubmit()" class="btn btn-primary">保存</button>
                  <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>
          <!-- 手动新增加订单 -->
          <div id="order-add" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">新增订单</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <label>收货人</label>
                          <input type="text" placeholder="请输入收货人" class="form-control">
                        </div>
                        <div class="form-group">
                          <label>收货电话</label>
                          <input type="text" placeholder="请输入收货电话" class="form-control">
                        </div>
                        <div class="form-group">
                          <label>收货地址</label>
                          <input type="text" placeholder="请输入收货地址" class="form-control">
                        </div>
                        <div class="form-group">
                          <label>订单内容</label>
                        <textarea class="form-control"></textarea>
                        </div>
                        <div class="form-group">
                          <label>供应商</label>
                      <select class="form-control">
                        <option>供应商1</option>
                        <option>供应商2</option>
                      </select>
                        </div>
                        <div class="form-group">
                          <label>支付方式</label>
                          <div class="col-sm-12 m-b-md ">
                              <label class="radio-inline">
                                <input type="radio" value="option1" id="inlineCheckbox1">
                                暂未付款 </label>
                              <label class="radio-inline">
                                <input type="radio" value="option1" id="inlineCheckbox1">
                                微信 </label>
                              <label class="radio-inline">
                                <input type="radio" value="option1" id="inlineCheckbox1">
                                支付宝 </label>
                            </div>
                        </div>
                        <div class="form-group">
                          <label>微信账号/支付宝账号</label>
                          <input type="text" value="123459791" class="form-control" disabled>
                        </div>
                        <div class="form-group">
                          <label>支付金额</label>
                          <input type="text" placeholder="请输入收货地址" class="form-control">
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
      curIndex: -1,
      rearch: {
        st: "",
        et: "",
        payType: "",
        status: "",
        content: "",
        recipients: "",
        distributor: "",
        isSupplier: 1
      },
      send: {
        company: "",
        expressOrder: ""
      },
      view: {
        company: "",
        expressOrder: "",
        id: ""
      },
      order:{
        recipients:"",
        recipientsPhone:"",
        recipientsAddress:"",
        content:"",
        payType:"",
        payment:""
      }
    };
  },
  mounted() {
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    rearchSubmit: function() {
      this.parentCurrentpage = 1;
      this.listData();
    },
    showOrderSave:function(){
       $("#order-add").madal("show");
    },
    showSendModal: function(index) {
      this.curIndex = index;
      this.send.company = "";
      this.send.expressOrder = "";
      $("#modal-send").modal("show");
    },
    sendSubmit: function() {
      let _this = this;
      let company = _this.send.company.trim();
      let expressOrder = _this.send.expressOrder.trim();
      if (company.trim() === "") {
        _this.$toast.warning("快递公司不可为空");
        return false;
      }
      if (expressOrder.trim() === "") {
        _this.$toast.warning("快递单号不可为空");
        return false;
      }
      let orderId = 0;
      let curOrder = _this.list[_this.curIndex];
      if (curOrder) {
        orderId = curOrder.id;
      }

      _this.loading = true;
      let params = [];
      params.push("company=" + company);
      params.push("expressOrder=" + expressOrder);
      params.push("orderId=" + orderId);
      _this.$axios
        .post("delivery?" + params.join("&"))
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                _this.listData();
                $("#modal-send").modal("hide");
              }
              break;
            default: {
              _this.$toast.error(res.msg);
            }
          }
          _this.loading = false;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.loading = false;
          _this.SHIFT_LOADING();
        });
    },
    showViewModal: function(index) {
      this.curIndex = index;
      this.getExpressOrder();
    },
    getExpressOrder: function() {
      let _this = this;
      let cur = _this.list[_this.curIndex];
      let orderId = cur.id;
      _this.$axios
        .get("delivery?orderId=" + orderId)
        .then(result => {
          $("#modal-send-view").modal("show");
          let data = result.data;
          data.isEdit = cur.status != "OVER";
          _this.view = data;
          // let res = result.data;
          // switch (res.code) {
          //   case 200:
          //     {
          //        cb&&cb(res.data);
          //     }
          //     break;
          //   default:
          //     {
          //       _this.$toast.error(res.msg);
          //     }
          // }
        })
        .catch(err => {});
    },
    updateSubmit: function() {
      let _this = this;
      let company = _this.view.company.trim();
      let expressOrder = _this.view.expressOrder.trim();
      if (company.trim() === "") {
        _this.$toast.warning("快递公司不可为空");
        return false;
      }
      if (expressOrder.trim() === "") {
        _this.$toast.warning("快递单号不可为空");
        return false;
      }
      _this.loading = true;
      let params = [];
      params.push("company=" + company);
      params.push("expressOrder=" + expressOrder);
      params.push("id=" + _this.view.id);
      params.push("orderId=" + _this.view.orderId);

      _this.$axios
        .put("delivery?" + params.join("&"))
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                _this.listData();
                $("#modal-send-view").modal("hide");
              }
              break;
            default: {
              _this.$toast.error(res.msg);
            }
          }
          _this.loading = false;
          _this.SHIFT_LOADING();
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
    listData() {
      let _this = this;
      let param = [];
      param.push("pageNum=" + _this.parentCurrentpage);
      param.push("pageSize=" + 15);
      param.push("isSupplier=1");
      if (_this.rearch.payType) {
        param.push("payType=" + _this.rearch.payType);
      }
      if (_this.rearch.status) {
        param.push("status=" + _this.rearch.status);
      }
      if (_this.rearch.content) {
        param.push("content=" + _this.rearch.content);
      }
      if (_this.rearch.recipients) {
        param.push("recipients=" + _this.rearch.recipients);
      }
      if (_this.rearch.distributor) {
        param.push("distributor=" + _this.rearch.distributor);
      }

      _this.PUSH_LOADING();
      _this.$axios
        .get("orders?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.parentTotalPage = res.pages;
          let tempList = res.list;
          _this.$lodash.forEach(tempList, function(item) {
            item.timeStr = _this
              .$moment(item.createDate)
              .format("YYYY/MM/DD HH:mm");
          });
          _this.list = tempList;
          _this.SHIFT_LOADING();
          console.log("sdfas");
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    }
  }
};
</script>

