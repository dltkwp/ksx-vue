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
                    <select class="form-control">
                      <option>全部</option>
                      <option>等待发货</option>
                      <option>已发货</option>
                      <option>已签收</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="order_id">订单内容</label>
                    <input type="text" value="" placeholder="搜索产品名称" class="form-control">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="status">收货人</label>
                    <input type="text" value="" placeholder="收货人姓名/电话" class="form-control">
                  </div>
                </div>
                <div class="col-sm-4">
                  <div class="form-group">
                    <label class="control-label" for="customer">分销商</label>
                    <input type="text" value="" placeholder="分销商姓名/电话" class="form-control">
                  </div>
                </div>
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
                        <tr v-for="(item,index) in list">
                          <td>{{index + 1}}</td>
                          <td>{{item.timeStr}}</td>
                          <td>{{item.content}}</td>
                          <td>{{item.recipients}}</td>
                          <td>{{item.recipientsPhone}}</td>
                          <td>{{item.recipientsAddress}}</td>
                          <td><a href="#">王刚 13478659803</a></td>
                          <td>￥{{item.payment}}</td>
                          <td>{{item.payType}}</td>
                          <td>
                              <span class="label label-warning" v-if="item.status=='WAIT'">等待发货</span>
                              <span class="label label-primary" v-if="item.status=='DELIVERY'">已发货</span>
                          </td>
                          <td>
                              <div class="btn btn-sm btn-primary" @click="showSendModal(index)"  v-if="item.status=='WAIT'">发货</div>
                              <div class="btn btn-sm btn-default" @click="showViewModal(index)"   v-if="item.status=='DELIVERY'" >查看物流单号</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <pagination :totalPage="parentTotalPage" :currentPage="parentCurrentpage" :changeCallback="parentCallback"></pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="modal-send" class="modal fade" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                  <h4 class="modal-title">发货</h4>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-sm-12">
                      <form role="form">
                        <div class="form-group">
                          <label>快递公司</label>
                          <input type="text" placeholder="请输入快递公司" class="form-control">
                        </div>
                        <div class="form-group">
                          <label>快递单号</label>
                          <input type="text" placeholder="请输入快递单号" class="form-control">
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

  import pagination from '@/components/pagination/pagination.vue';

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
        curIndex:-1,
        send:{
            
        }
      };
    },
    mounted() {
      this.listData();
    },
    methods: {
      ...mapActions([types.LOADING.PUSH_LOADING, types.LOADING.SHIFT_LOADING]),
      showSendModal:function(index){
        this.curIndex = index;
        $("#modal-send").modal("show");
      },
      sendSubmit:function(){

      },
      showViewModal:function(){},
      parentCallback(cPage)  {
        this.listData();
      },
      listData() {
        let _this = this;
        let param = []
        param.push('pageNum=' + _this.parentCurrentpage);
        param.push('pageSize=' + 15);
        param.push('isSupplier=1')

        _this.PUSH_LOADING();
        _this.$axios
          .get("orders?"+param.join('&'))
          .then(result => {
            let res = result.data;
            _this.parentTotalPage = res.total;
            let tempList = res.list;
            _this.$lodash.forEach(tempList,function(item){
                item.timeStr = _this.$moment(item.createDate).format('YYYY/MM/DD HH:mm');
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