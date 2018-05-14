<template>
  <div id="wrapper">
    <v-menus></v-menus>
    <div id="page-wrapper" class="gray-bg" style="min-height: 394px;">
      <v-top></v-top>
      <div class="wrapper wrapper-content ">
        <div class="row">
          <div class="col-lg-12">
            <div class="ibox">
              <div class="ibox-title"> 订单列表 </div>
              <div class="ibox-content">
                <div class="row m-b-sm ">
                  <div class="col-lg-6">
                    <button class="btn btn-primary btn-sm" @click="showSaveModal()">新增订单</button>
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
                        <a href="javascript:;;" v-for="(supplier,index) in item.orderSupplierList" :key="index">{{supplier.realname}} {{supplier.phone||''}}</a>
                      </td>
                      <td v-if="item.payment==null">-</td>
                      <td v-if="item.payment!==null">￥{{item.payment}}</td>
                      <td>
                        {{item.payType=='none'||item.payType=='check'?'':item.payType}}
                        <span class="label label-danger" v-if="item.payType=='none'">暂未付款</span>
                        <span class="label label-danger" v-if="item.payType=='check'">付款待审核</span>
                      </td>
                      <td>
                        <span class="label label-warning" v-if="item.status=='WAIT'">等待发货</span>
                        <span class="label label-primary" v-if="item.status=='DELIVERY'">已发货</span>
                        <span v-if="item.status=='OVER'">已签收</span>
                      </td>
                      <td>
                        <div class="btn btn-sm btn-danger" @click="orderCheckShowModal(index)" v-if="item.payType=='check'">审核</div>
                        <div class="btn btn-sm btn-primary" @click="showPayModal(index)" v-if="item.payType=='none'">收款</div>
                        <div class="btn btn-sm btn-default" @click="showChangePriceodal(index)" v-if="item.status=='WAIT'">改价</div>
                        <div class="btn btn-sm btn-default" @click="showDetailModal(index)">详情</div>
                        <div class="btn btn-sm btn-primary" @click="showSendModal(index)" v-if="item.status=='WAIT'&&item.payType!='none'">发货</div>
                        <div class="btn btn-sm btn-default" @click="showViewModal(index)" v-if="item.status=='DELIVERY'">物流</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <v-empty :isShow="parentTotalPage==0"></v-empty>
                <page :pageSize="pageSize" v-if="parentTotalPage>0" :total="parentTotalPage" show-total :current="pageNo" @on-change="parentCallback"></page>
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
                          <input type="text" v-bind:value="changePrice.oldPayment" class="form-control" disabled="">
                        </div>
                        <div class="form-group">
                          <label>修改价格为</label>
                          <input type="text" placeholder="请输入价格" class="form-control" maxlength="8" v-model="changePrice.payment">
                        </div>
                        <div class="form-group">
                          <label>备注</label>
                          <textarea class="form-control" maxlength="500" v-model="changePrice.comment"></textarea>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" @click="changePriceSave()" v-bind:readonly="loading" v-bind:disabled="loading">保存</button>
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
                            <input type="text" v-bind:value="detail.recipients" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货电话</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.recipientsPhone" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货地址</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.recipientsAddress" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">订单内容</label>
                          <div class="col-sm-10">
                            <textarea class="form-control" disabled="" v-bind:value="detail.content"></textarea>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">分销商</label>
                          <div class="col-sm-10">
                            <select class="form-control" disabled="">
                                <option v-for="(item,index) in detail.orderSupplierList" :key="index" checked>
                                  {{item.realname||''}}
                                </option>
                              </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付方式</label>
                          <div class="col-sm-10">
                            <label class="radio-inline" v-if="detail.payType=='none'">
                                <input type="radio" checked >暂未付款 </label>
                            <label class="radio-inline" v-if="detail.payType=='wechat'">
                                <input type="radio" checked>微信 </label>
                            <label class="radio-inline" v-if="detail.payType=='alipay'">
                                <input type="radio" checked>支付宝 </label>
                            <label class="radio-inline" v-if="detail.payType=='check'">
                                <input type="radio" checked>付款待审核 </label>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">微信/支付宝账号</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.payAccount||''" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付金额</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.payment" class="form-control" disabled >
                          </div>
                        </div>
                        <div class="form-group" v-if="detail.payVoucher">
                          <label class="col-sm-2 control-label">付款截图</label>
                          <div class="col-sm-10">
                            <img v-bind:src="detail.payVoucher" class="img-lg" data-toggle="modal" href="#look-img">
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
                          <input type="text" placeholder="请输入收货电话" class="form-control" v-model="order.recipientsPhone" maxlength="11">
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
                          <select v-model="distributorId" class="form-control">
                                  <option v-for="(item,index) in distributorList " :key="index" v-bind:value="item.id">
                                    {{ item.username }}
                                  </option>
                              </select>
                        </div>
                        <div class="form-group">
                          <label>支付方式</label>
                          <div class="col-sm-12 m-b-md ">
                            <label class="radio-inline">
                                <input type="radio" @click="payTypeChange('none')"  name="inlineCheckbox1">暂未付款 </label>
                            <label class="radio-inline">
                                <input type="radio"  @click="payTypeChange('wechat')"  name="inlineCheckbox1">微信 </label>
                            <label class="radio-inline">
                                 <input type="radio"  @click="payTypeChange('alipay')" name="inlineCheckbox1">支付宝 </label>
                          </div>
                        </div>
                        <div class="form-group" v-if="order.payType!=='none'">
                          <label>{{order.payType==='wechat'?'微信账号':'支付宝账号'}}</label>
                          <input type="text" class="form-control" v-model="order.payAccount" maxlength="20">
                        </div>
                        <div class="form-group" v-if="order.payType!=='none'">
                          <label>支付金额</label>
                          <input type="text" placeholder="请输入支付金额" class="form-control" v-model="order.payment" maxlength="8">
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button @click="orderSave()" type="button" v-bind:disabled="loading" v-bind:readonly="loading" class="btn btn-primary">保存</button>
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
                            <date-picker :value="datePicker" format="yyyy-MM-dd" type="daterange" placement="bottom-end" @on-change="handleChange" placeholder="Select date" style="width: 200px"></date-picker>
                          </div>
                          <label class="col-lg-2 control-label">支付方式</label>
                          <div class="col-lg-4">
                            <select class="form-control" v-model="rearch.payType">
                                  <option value="">全部</option>
                                  <option value="none">暂未付款</option>
                                  <option value="wechat">微信</option>
                                  <option value="alipay">支付宝</option>
                                </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-lg-2 control-label">分销商</label>
                          <div class="col-sm-10">
                            <label class="checkbox-inline" v-for="(item,index) in rearch.distributorList" :key='index'>
                                  <input v-bind:checked="item.id==rearch.distributorId" type="checkbox" value="option1" name="rearchDistributorList">{{item.realname}}</label>
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
  
          <!-- 付款待审核 -->
          <div id="review" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">审核</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form" class="form-horizontal">
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货人</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.recipients" class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货电话</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.recipientsPhone"  class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收货地址</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.recipientsAddress"  class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">订单内容</label>
                          <div class="col-sm-10">
                            <textarea class="form-control" disabled v-html="detail.content"></textarea>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">分销商</label>
                          <div class="col-sm-10">
                            <select class="form-control" disabled="" v-for="(item,index) in detail.orderSupplierList" :key="index">
                                <option>{{item.realname}}</option>
                              </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付方式</label>
                          <div class="col-sm-10">
                           <label class="radio-inline" v-if="detail.payType=='none'">
                                <input type="radio" checked >暂未付款 </label>
                            <label class="radio-inline" v-if="detail.payType=='wechat'">
                                <input type="radio" checked>微信 </label>
                            <label class="radio-inline" v-if="detail.payType=='alipay'">
                                <input type="radio" checked>支付宝 </label>
                            <label class="radio-inline" v-if="detail.payType=='check'">
                                <input type="radio" checked>付款待审核 </label>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">微信账号/支付宝账号</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.payAccount||''"  class="form-control" disabled="">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">支付金额</label>
                          <div class="col-sm-10">
                            <input type="text" v-bind:value="detail.payment"  class="form-control">
                          </div>
                        </div>
                        <div class="form-group" v-if="detail.payVoucherUrl">
                          <label class="col-sm-2 control-label">付款截图</label>
                          <div class="col-sm-10">
                            <img v-bind:src="detail.payVoucherUrl" class="img-lg" @click="vieImage(detail.payVoucherUrl)">
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" @click="reviewSubmit" v-bind:disabled="loading"  v-bind:readonly="loading" class="btn btn-primary">审核通过</button>
                  <button type="button" class="btn btn-white" @click="showReviewFailSubmit">审核未通过</button>
                </div>
              </div>
            </div>
          </div>
          <!-- 付款待审核 end-->
  
          <!-- 收款操作 开始 -->
          <div id="pay" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">收款</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form" class="form-horizontal">
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收款方式</label>
                          <div class="col-sm-10">
                            <label class="radio-inline">
                              <input type="radio" value="wechat"   v-bind:checked="pay.payType=='wechat'"    v-model="pay.payType"    name="payForPayType">微信 </label>
                            <label class="radio-inline">
                               <input type="radio" value="alipay"  v-bind:checked="pay.payType=='alipay'"    v-model="pay.payType"   name="payForPayType">支付宝 </label>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">微信账号/支付宝账号</label>
                          <div class="col-sm-10">
                            <input type="text" maxlength="20" v-model="pay.payAccount" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收款金额</label>
                          <div class="col-sm-10">
                            <input type="text" v-model="pay.payment" class="form-control" maxlength="8">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-2 control-label">收款截图</label>
                          <div class="col-sm-10">
                            <div class="fileinput fileinput-new" data-provides="fileinput"  @click="uploadImage()">
                              <span class="btn btn-default btn-file"><span class="fileinput-new">上传附件</span></span>
                              {{pay.payVoucherUrl}}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" @click="savePaySubmit" v-bind:disabled="loading" v-bind:readonly="loading">保存</button>
                  <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>
          <!-- 收款操作 结束 -->

          <!-- 查看大图 Start-->
          <div id="look-img" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <img v-bind:src="viewImageUrl" style="width:100%" data-dismiss="modal">
              </div>
            </div>
          </div>
          <!-- 查看大图 End-->

         <!-- 订单取消原因  开始 -->
         <div id="reason" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">未通过原因</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <textarea class="form-control" rows="5" v-model="orderCancelReason"></textarea>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" @click="reviewFailSubmit">保存</button>
                  <button type="button" class="btn btn-white" data-dismiss="modal">关闭</button>
                </div>
              </div>
            </div>
          </div>
         <!-- 订单取消原因  结束-->
  
        </div>
      </div>
    </div>
    <form action="" id="uploadImgForm" style="display:none;">
       <input type="file" name="uploadFile" id="uploadFile" multiple="multiple" style="display:none;" @change="imgUploadFileChange($event)">
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as types from "@/store/mutation-types.js";

import vMenus from "@/components/menus/menus.vue";
import vTop from "@/components/top/top.vue";
import vEmpty from "@/components/empty/empty.vue";

import { DatePicker,Page } from "iview";

export default {
  components: {
    vMenus,
    vTop,
    vEmpty,
    Page,
    DatePicker
  },
  data() {
    return {
      loading: false,
      list: [],
      parentTotalPage: 0,
      pageNo: 1,
      pageSize:15,
      curIndex: -1,
      datePicker: ["", ""],
      rearch: {
        payType: "",
        status: "",
        content: "",
        recipients: "",
        distributor: "",
        showStatusText: "",
        isSupplier: 0,
        distributorList: [],
        distributorId: ""
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
        payAccount: "",
        payment: ""
      },
      detail: {},
      changePrice: {
        orderId: 0,
        oldPayment: "",
        payment: "0",
        comment: ""
      },
      distributorList: [], //新增订单时分销商的列表
      distributorId: "", //新增订单时所选择的
      pay: {
        // 收款模型
        payType: "wechat", //  支付类型
        payAccount: "", //  账号体系
        payVoucher: "", //  支付凭证
        payment: "", // 支付金额
        payIndex: -1,
        payVoucherUrl: ""
      },
      viewImageUrl:"",
      orderCancelReason:"",
    };
  },
  mounted() {
    this.SHIFT_LOADING();
    this.listData();
    this.getDistributorList();
  },
  methods: {
    ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
    showReviewFailSubmit: function (){
      let _this = this;
      _this.orderCancelReason = '';
      $("#order-detail").modal('hide');
      $("#reason").modal("show");
    },
    reviewFailSubmit: function (){
      let _this = this;
      let reason = _this.orderCancelReason.trim();
      if(reason==""){
        _this.$toast.warning("原因不可为空");
        return false;
      }
      _this.loading = true;
      let cur = _this.list[_this.curIndex];
      _this.PUSH_LOADING();
      console.error('审核失败需要接口的支持。。。。。。。。。。。。。。。。。。。。');
      _this.$axios
        .get("/orders/" + cur.id + "/review")
        .then(result => {
          _this.loading = false;
          _this.$toast.success("操作成功");          
          $("#reason").modal("hide");
          $("#review").modal("hide");
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.loading = false;
          _this.SHIFT_LOADING();
        });
    },
    vieImage:function(url){
      let _this = this;
      _this.viewImageUrl = url;
      $("#look-img").modal('show');
    },
    showSaveModal: function() {
      this.order = {
        recipients: "",
        recipientsPhone: "",
        recipientsAddress: "",
        content: "",
        payType: "",
        payAccount: "",
        payment: ""
      };
      $("#order-add").modal("show");
    },
    handleChange(date) {
      this.datePicker = date;
    },
    savePaySubmit: function() {
      let _this = this;
      let payAccount = _this.pay.payAccount.trim();
      let payVoucher = _this.pay.payVoucher;
      let payment = _this.pay.payment;

      if (payAccount == "") {
        _this.$toast.warning("账号不可为空");
        return false;
      }
      if (!priceValidate(payment)) {
        _this.$toast.warning("金额格式不正确");
        return false;
      }

      if (payVoucher == "") {
        _this.$toast.warning("请上传支付凭证");
        return false;
      }

      let cur = _this.list[_this.pay.payIndex];
      let param = [
        "payment=" + payment,
        "payType=" + _this.pay.payType,
        "payAccount=" + payAccount,
        "payVoucher=" + payVoucher
      ];

      _this.loading = true;
      _this.$axios
        .get("/orders/" + cur.id + "/pay?" + param.join("&"))
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                $("#pay").modal("hide");
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
    showPayModal: function(index) {
      this.pay = {
        // 收款模型
        payType: "wechat", //  支付类型
        payAccount: "", //  账号体系
        payVoucher: "", //  支付凭证
        payment: "", // 支付金额
        payIndex: index,
        payVoucherUrl: ""
      };
      $("#pay").modal("show");
    },
    orderCheckShowModal: function(index) {
      let _this = this;
      _this.curIndex = index;
      let cur = _this.list[index];
      _this.PUSH_LOADING();
      _this.$axios
        .get("/orders/" + cur.id + "/review")
        .then(result => {
          let detail = result.data;
          if (detail.payVoucher) {
            detail.payVoucherUrl = imgCdn + detail.payVoucher;
          }
          
          // 测试代码
          detail.payVoucherUrl = "http://easy-time.oss-cn-beijing.aliyuncs.com/product/CE0655146C634D01AE493CD50E70C07F.jpg";

          _this.detail = detail;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
      $("#review").modal("show");
    },
    reviewSubmit: function(){
      let _this = this;
      let cur = _this.list[_this.curIndex];
      _this.loading = true;
      _this.PUSH_LOADING();
      _this.$axios
        .get("orders/" + cur.id + "/review/success?payment=" + cur.payment)
        .then(result => {
          _this.loading = false;
          _this.$toast.success("操作成功");
          $("#review").modal("hide");
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.loading = false;
          _this.SHIFT_LOADING();
        });
    },
    showChangePriceodal: function(index) {
      let _this = this;
      let cur = _this.list[index];
      _this.changePrice.orderId = cur.id;
      _this.changePrice.oldPayment = cur.payment;
      _this.changePrice.payment = "0";
      _this.changePrice.comment = "";
      $("#edit-price").modal("show");
    },
    changePriceSave: function() {
      let _this = this;
      let payment = _this.changePrice.payment.trim();
      if (!priceValidate(payment)) {
        _this.$toast.warning("金额格式不正确");
        return false;
      }
      let param = [];
      param.push("orderId=" + _this.changePrice.orderId);
      param.push("payment=" + _this.changePrice.payment);
      param.push("comment=" + _this.changePrice.comment);

      _this.loading = true;
      _this.$axios
        .post("orders/pay?" + param.join("&"))
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                _this.listData();
                $("#edit-price").modal("hide");
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
    showDetailModal: function(index) {
      $("#order-detail").modal("show");
      this.getDetail(this.list[index].id);
    },
    advRearchSubmit: function() {
      this.pageNo = 1;
      this.listData();
      $("#search-more").modal("hide");
    },
    showAdvRearch: function() {
      //清理下界面元素 并弹出对话框
      $("#search-more").modal("show");
    },
    orderStatusChange: function(key) {
      this.rearch.status = key;
      switch (key) {
        case "":
          {
            this.rearch.showStatusText = "全部订单";
          }
          break;
        case "WAIT":
          {
            this.rearch.showStatusText = "等待发货";
          }
          break;
        case "DELIVERY":
          {
            this.rearch.showStatusText = "已发货";
          }
          break;
        case "RECEIVED":
          {
            this.rearch.showStatusText = "已签收";
          }
          break;
      }
      this.pageNo = 1;
      this.listData();
    },
    payTypeChange: function(key) {
      this.order.payType = key;
      switch (key) {
        case "none":
          {
          }
          break;
        case "alipay":
          {
          }
          break;
        case "wechat":
          {
          }
          break;
      }
    },
    orderSave: function() {
      let _this = this;
      let recipients = _this.order.recipients.trim();
      let recipientsPhone = _this.order.recipientsPhone.trim();
      let recipientsAddress = _this.order.recipientsAddress.trim();
      let content = _this.order.content.trim();
      let payType = _this.order.payType;
      let payAccount = _this.order.payAccount.trim();
      let payment = _this.order.payment.trim();
      let distributorId = _this.distributorId;

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
      if (payType != "none") {
        if (payAccount === "") {
          _this.$toast.warning("账号不可为空");
          return false;
        }
        if (!priceValidate(payment)) {
          _this.$toast.warning("支付金额格式不正确");
          return false;
        }
      }

      let param = {
        recipients: recipients,
        recipientsPhone: recipientsPhone,
        recipientsAddress: recipientsAddress,
        content: content,
        payType: payType,
        payAccount: payAccount,
        payment: payment,
        isAgent: false
      };
      if (distributorId) {
        param.agentId = distributorId;
      }

      _this.$axios
        .post("orders", param)
        .then(result => {
          let res = result.data;
          switch (res.code) {
            case 200:
              {
                _this.$toast.success("操作成功");
                _this.pageNo = 1;
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
      this.pageNo = 1;
      this.listData();
    },
    showOrderSave: function() {
      this.order = {
        recipients: "",
        recipientsPhone: "",
        recipientsAddress: "",
        content: "",
        payType: "",
        payAccount: "",
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
      this.pageNo = cPage;
      this.listData();
    },
    getDetail: function(orderId) {
      let _this = this;
      _this.PUSH_LOADING();
      _this.$axios
        .get("/orders/" + orderId)
        .then(result => {
          let detail = result.data;
          if (detail.payVoucher) {
            detail.payVoucher = imgCdn + detail.payVoucher;
          }
          _this.detail = detail;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    },
    listData() {
      let _this = this;
      let param = [];
      param.push("pageNum=" + _this.pageNo);
      param.push("pageSize=" + _this.pageSize);
      param.push("isSupplier=0");
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
      let st = _this.datePicker[0];
      let et = _this.datePicker[1];
      if (st && et) {
        param.push("st=" + st + " 00:00:00");
        param.push("et=" + et + " 23:59:59");
      }

      _this.PUSH_LOADING();
      _this.$axios
        .get("/orders?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.parentTotalPage = res.total;
          let tempList = res.list;
          _this.$lodash.forEach(tempList, function(item) {
            item.timeStr = _this
              .$moment(item.createDate)
              .format("YYYY/MM/DD HH:mm");
          });
          // 测试代码
          tempList[6].payType = "check";
          _this.list = tempList;
          _this.SHIFT_LOADING();
        })
        .catch(err => {
          _this.SHIFT_LOADING();
        });
    },
    getDistributorList: function() {
      let _this = this;
      let param = [];
      param.push("pageNum=1");
      param.push("pageSize=1000");
      _this.$axios
        .get("user/dealer?" + param.join("&"))
        .then(result => {
          let res = result.data;
          _this.distributorList = res.list;
          _this.rearch.distributorList = _.$lodash.deepClone(res.list);

          if (res.list.length > 0) {
            _this.distributorId = res.list[0].id;
            _this.rearch.distributorId = res.list[0].id;
          }
        })
        .catch(err => {});
    },
    uploadImage: function() {
      $("#uploadFile").val(null);
      if ($("#uploadFile").val()) {
        document.getElementById("uploadImgForm").reset();
      }
      document.getElementById("uploadFile").click();
    },
    imgUploadFileChange: function(event) {
      let _this = this;
      if (event) {
        var filePath = "";
        var size = 0;
        var updatingCount = 0;

        if (event && event.target && event.target.files) {
          var file = event.target.files[0];
          size = file.size || 0;
          filePath = file.name;
          var index = filePath.lastIndexOf(".");
          var suffix = filePath.substring(index, filePath.length);

          if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(suffix)) {
            _this.$toast.warning("图片类型必须是.gif,jpeg,jpg,png中的一种");
            return false;
          }

          var imgSize = size / 1024 / 1024;
          if (imgSize > 3) {
            _this.$toast.warning("图片大小超过3M,请上传小于3M的图片.");
            return false;
          }
          var formData = new FormData();
          formData.append("file", file);

          let _this = this;
          _this.$axios
            .post("upload", formData, {
              headers: { "Content-Type": "multipart/form-data" }
            })
            .then(result => {
              let res = result.data;
              _this.pay.payVoucherUrl = imgCdn + res.fileCode;
              _this.pay.payVoucher = res.fileCode;
              _this.$toast.success("操作成功");
            })
            .catch(err => {});
        }
      }
    }
  }
};
</script>

