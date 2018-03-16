<template>
  <div id="wrapper">
    <v-menus></v-menus>
    <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
      <v-top></v-top>
      <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
          <div class="col-lg-12">
           <div class="ibox">
              <div class="ibox-title"> 订单列表 </div>
              <div class="ibox-content">
                <div class="row m-b-sm ">
                  <div class="col-lg-6">
                      <button class="btn btn-primary btn-sm" data-toggle="modal" href="#order-add">新增订单</button>
                  </div>
                  <div class="col-lg-6 text-right">
                    <div class="btn-group btn-group-sm">
                      <button data-toggle="dropdown" class="btn btn-default dropdown-toggle" aria-expanded="false">{{rearch.showStatusText||"全部订单"}} <span class="caret"></span></button>
                      <ul class="dropdown-menu">
                        <li @click="orderStatusChange('')"><a href="javascript:;;">全部订单</a></li>
                        <li @click="orderStatusChange('WAIT')"><a href="javascript:;;">等待发货</a></li>
                        <li @click="orderStatusChange('DELIVERY')"><a href="javascript:;;">已发货</a></li>
                        <li @click="orderStatusChange('RECEIVED')"><a href="javascript:;;">已签收</a></li>
                      </ul>
                    </div>
                    <div class="search-box">
                      <div class="input-group">
                        <input v-model="rearch.content" type="text" placeholder="搜索订单内容/收货人姓名/电话" class="input-sm form-control" maxlength="20">
                        <span class="input-group-btn">
                        <button @click="rearchSubmit()" type="button" class="btn btn-sm btn-primary"> 搜索</button>
                        </span></div>
                    </div>
                    <button @click="showAdvRearch()" type="button" class="btn btn-sm btn-default ">高级搜索</button>
                  </div>
                </div>
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
                          <td v-show="item.payType=='none'">-</td>
                          <td v-show="item.payType!='none'"> ￥{{item.payment}}</td>                          
                          <td>
                            {{item.payType=='none'?'':item.payType}}
                            <span class="label label-danger" v-if="item.payType=='none'">暂未付款</span>
                            <span class="label label-danger" v-if="item.payType=='check'">付款待审核</span>
                          </td>
                          <td>
                            <span class="label label-warning" v-if="item.status=='WAIT'">等待发货</span>
                            <span class="label label-primary" v-if="item.status=='DELIVERY'">已发货</span>
                          </td>
                          <td>
                            <div class="btn btn-sm btn-primary" @click="showPayModal(index)">收款</div>
						                <div class="btn btn-sm btn-default" @click="showChangePriceodal(index)">改价</div>
                            <div class="btn btn-sm btn-default" @click="showDetailModal(index)">详情</div>
                            <div class="btn btn-sm btn-primary" @click="showSendModal(index)" v-if="item.status=='WAIT'">发货</div>
                            <div class="btn btn-sm btn-default" @click="showViewModal(index)" v-if="item.status=='DELIVERY'">物流</div>
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

          <!-- 改动价格 开始-->
          <div id="edit-price" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">订单改价</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <label>订单原价</label>
                          <input type="text" value="500.00" class="form-control" disabled="">
                        </div>
                        <div class="form-group">
                          <label>修改价格为</label>
                          <input type="text" placeholder="请输入价格" class="form-control">
                        </div>
                        <div class="form-group">
                          <label>备注</label>
                          <textarea class="form-control"></textarea>
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
          <!-- 改动价格 结束-->
          <!-- 订单详情  开始-->
          <div id="order-detail" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">订单详情</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form" class="form-horizontal">
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货人</label>
                          <div class="col-sm-10">
                            <input type="text" value="张三" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货电话</label>
                          <div class="col-sm-10">
                            <input type="text" value="15242612898" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货地址</label>
                          <div class="col-sm-10">
                            <input type="text" value="高新园区招商兰溪谷" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">订单内容</label>
                          <div class="col-sm-10">
                            <textarea class="form-control" disabled="">麦顿金典1袋</textarea>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">分销商</label>
                          <div class="col-sm-10">
                            <select class="form-control" disabled="">
                              <option>分销商1</option>
                            
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付方式</label>
                          <div class="col-sm-10">
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
                          <label class="col-sm-2 control-label">微信账号/支付宝账号</label>
                          <div class="col-sm-10">
                            <input type="text" value="123459791" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付金额</label>
                          <div class="col-sm-10">
                            <input type="text" value="100" class="form-control">
                          </div>
                        </div>
                  <div class="form-group">
                          <label class="col-sm-2 control-label">付款截图</label>
                          <div class="col-sm-10">
                              <img src="img/gallery/2s.jpg" class="img-lg" data-toggle="modal" href="#look-img">
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                
                  <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>
          <!-- 订单详情  结束-->

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
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">新增订单</h4>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-sm-12">
                        <form role="form">
                          <div class="form-group">
                            <label>收货人</label>
                            <input type="text" placeholder="请输入收货人" class="form-control" v-model="order.recipients" maxlength="20">
                          </div>
                          <div class="form-group">
                            <label>收货电话</label>
                            <input type="text" placeholder="请输入收货电话" class="form-control"  v-model="order.recipientsPhone" maxlength="20">
                          </div>
                          <div class="form-group">
                            <label>收货地址</label>
                            <input type="text" placeholder="请输入收货地址" class="form-control" v-model="order.recipientsAddress" maxlength="255">
                          </div>
                          <div class="form-group">
                            <label>订单内容</label>
                            <textarea class="form-control" v-model="order.content" maxlength="255"> </textarea>
                          </div>
                          <div class="form-group">
                            <label>分销商</label>
                        <select class="form-control">
                          <option></option>
                          <option>分销商1</option>
                          <option>分销商2</option>
                        </select>
                          </div>
                          <div class="form-group">
                            <label>支付方式</label>
                            <div class="col-sm-12 m-b-md ">
                                <label class="radio-inline">
                                  <input type="radio" @click="payTypeChange('none')"  name="inlineCheckbox1">
                                  暂未付款 </label>
                                <label class="radio-inline">
                                  <input type="radio"  @click="payTypeChange('wechart')"  name="inlineCheckbox1">
                                  微信 </label>
                                <label class="radio-inline">
                                  <input type="radio"  @click="payTypeChange('alipay')" name="inlineCheckbox1">
                                  支付宝 </label>
                              </div>
                          </div>
                          <div class="form-group" v-if="order.payType!=='none'">
                            <label>{{order.payType==='wechart'?'微信账号':'支付宝账号'}}</label>
                            <input type="text"  class="form-control" v-model="order.account" maxlength="20">
                          </div>
                          <div class="form-group" v-if="order.payType!=='none'">
                            <label>支付金额</label>
                            <input type="text" placeholder="请输入支付金额" class="form-control"  v-model="order.payment" maxlength="10">
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button  @click="orderSave()" type="button" v-bind:disabled="loading" v-bind:readonly="loading" class="btn btn-primary">保存</button>
                    <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                  </div>
                </div>
              </div>
            </div>
          <!--高级搜索-->
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
                            <label class="col-lg-2 control-label">下单时间</label>
                            <div class="col-lg-4">
                              <input type="email" placeholder="2018/02/10～2018/02/28" class="form-control">
                            </div>
                            <label class="col-lg-2 control-label">支付方式</label>
                            <div class="col-lg-4">
                              <select class="form-control" v-model="rearch.payType">
                                <option value="">全部</option>
                                <option value="none">暂未付款</option>
                                <option value="wechart">微信</option>
                                <option value="alipay">支付宝</option>
                              </select>
                            </div>
                          </div>
                          <div class="form-group">
                            <label class="col-lg-2 control-label">分销商</label>
                            <div class="col-sm-10">
                              <label class="checkbox-inline">
                                <input type="checkbox" value="option1" id="inlineCheckbox1">
                                分销商1 </label>
                              <label class="checkbox-inline">
                                <input type="checkbox" value="option2" id="inlineCheckbox2">
                                分销商2 </label>
                              <label class="checkbox-inline">
                                <input type="checkbox" value="option3" id="inlineCheckbox3">
                                分销商3 </label>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button @click="advRearchSubmit()" type="button" class="btn btn-primary">查询</button>
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
        showStatusText:"",
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
      order: {
        recipients: "",
        recipientsPhone: "",
        recipientsAddress: "",
        content: "",
        payType: "",
        account: "",
        payment: ""
      },
      detai:{}
    };
  },
  mounted() {
    this.listData();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    showPayModal:function(index){
      $("#").modal("show");
    },
    showChangePriceodal:function(index){
      $("#edit-price").modal("show");
    },
    showDetailModal:function(index){
      $("#order-detail").modal("show");
      this.getDetail(this.list[index].id);
    },
    advRearchSubmit:function(){
      this.parentCurrentpage = 1;
      this.listData();
      $("#search-more").modal("hide");
    },
    showAdvRearch:function(){
      //清理下界面元素 并弹出对话框
      $("#search-more").modal("show");
    },
    orderStatusChange:function(key){
        this.rearch.status = key;
        switch (key) {
         case "":{this.rearch.showStatusText = '全部订单';} break;
         case "WAIT":{this.rearch.showStatusText = '等待发货';} break;
         case "DELIVERY":{this.rearch.showStatusText = '已发货';} break;
         case "RECEIVED":{this.rearch.showStatusText = '已签收';} break;
         
       }
        this.parentCurrentpage = 1;
        this.listData();
    },
    payTypeChange:function(key){
       this.order.payType = key;
       switch (key) {
         case "none":{} break;
         case "alipay":{} break;
         case "wechart":{} break;
       }
    },
    orderSave:function(){
      let _this = this;
      let   recipients = _this.order.recipients.trim();
      let   recipientsPhone  = _this.order.recipientsPhone.trim();
      let   recipientsAddress = _this.order.recipientsAddress.trim();
      let   content = _this.order.content.trim();
      let   payType = _this.order.payType;
      let   account = _this.order.account.trim();
      let   payment = _this.order.payment.trim();
      

      if (recipients === "") {
          _this.$toast.warning("收货人不可为空");
          return false;
      }
      if (!mobileValidate(recipientsPhone)) {
          _this.$toast.warning("收货电话格式不正确");
          return false;
      }
      if (recipientsAddress === "") {
          _this.$toast.warning("收货地址不可为空");
          return false;
      }
      if (payType!='none') {
          if (account === "") {
              _this.$toast.warning("账号不可为空");
              return false;
          }
          if (!priceValidate(payment)) {
              _this.$toast.warning("支付金额格式不正确");
              return false;
          }
      }

      _this.$axios
        .post("orders",{
          recipients: recipients,
          recipientsPhone: recipientsPhone,
          recipientsAddress: recipientsAddress,
          content: content,
          payType: payType,
          account: account,
          payment: payment
        })
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                _this.parentCurrentpage = 1;
                _this.listData();
                $("#order-add").modal("hide");
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
    rearchSubmit: function() {
      this.parentCurrentpage = 1;
      this.listData();
    },
    showOrderSave: function() {
      this.order= {
        recipients: "",
        recipientsPhone: "",
        recipientsAddress: "",
        content: "",
        payType: "",
        account: "",
        payment: ""
      };
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
    getDetail:function(orderId){
      let _this = this;
      _this.PUSH_LOADING();
      _this.$axios
        .get("orders/" + orderId)
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
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    }
  }
};
</script>

