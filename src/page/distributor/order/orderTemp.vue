<template>
  <div id="wrapper">
    <v-menus></v-menus>
    <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
      <v-top></v-top>
      <div class="wrapper wrapper-content ">
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
                    <select class="form-control">
                      <option>全部</option>
                      <option>暂未付款</option>
                      <option>支付宝</option>
                      <option>微信</option>
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
                    <input type="text" value="" placeholder="搜索产品名称" class="form-control" v-model="rearch.content" maxlength="20">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="status">收货人</label>
                    <input type="text" value="" placeholder="收货人姓名/电话" class="form-control" v-model="rearch.recipients" maxlength="20">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="customer">分销商</label>
                    <input type="text" value="" placeholder="分销商姓名/电话" class="form-control" v-model="rearch.distributor" maxlength="20">
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
                    <page v-if="parentTotalPage>0" :total="parentTotalPage" show-total :current="pageNo" @on-change="parentCallback"></page>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

import { Page } from "iview";


export default {
  components: {
    vMenus,
    vTop,
    Page
  },
  data() {
    return {
      loading: false,
      list: [],
      parentTotalPage: 0,
      pageNo: 1,
      curIndex: -1,
      rearch: {
        st: "",
        et: "",
        payType: "",
        status:"",
        content:"",
        recipients:"",
        distributor:"",
        isSupplier:0
      },
      send: {
        company: "",
        expressOrder: ""
      },
      view: {
        company: "",
        expressOrder: "",
        id: ""
      }
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    rearchSubmit:function(){
      this.pageNo = 1;
      this.listData();
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
      let cur = _this.list[_this.curIndex ];
      let orderId = cur.id
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
      this.pageNo = cPage;
      this.listData();
    },
    listData() {
      let _this = this;
      let param = [];
      param.push("pageNum=" + _this.pageNo);
      param.push("pageSize=" + 15);
      param.push("isSupplier=1");

      _this.PUSH_LOADING();
      _this.$axios
        .get("orders?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.parentTotalPage = res.page;
          let tempList = res.list;
          _this.$lodash.forEach(tempList, function(item) {
            item.timeStr = _this
              .$moment(item.createDate)
              .format("YYYY/MM/DD HH:mm");
          });
          _this.list = tempList;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    }
  }
};
</script>

