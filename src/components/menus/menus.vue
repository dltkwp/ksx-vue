<template>
  <nav class="navbar-default navbar-static-side" role="navigation">
    <div class="sidebar-collapse">
      <ul class="nav metismenu" id="side-menu">
        <li class="nav-header">
          <div class="dropdown profile-element">
            <a data-toggle="dropdown" class="dropdown-toggle" href="javascript:;;"> 
              <span class="clear"> 
                <span class="block m-t-xs"> 
                  <strong class="font-bold">{{userInfo.userName}}</strong>
                </span> 
                <span class="text-muted text-xs block">{{userInfo.userType===1?'供应商':'分销商'}} <b class="caret"></b></span> </span> </a>
            <ul class="dropdown-menu animated fadeInRight m-t-xs">
              <li><a href="javascript:;;">退出</a></li>
            </ul>
          </div>
          <div class="logo-element"> KSX </div>
        </li>
        <li  v-bind:class="{active:parentKey==='Supplier'}"> 
          <a href="javascript:;;">
            <i class="fa fa-sitemap"></i> 
            <span class="nav-label">我是供应商</span> 
            <span class="fa arrow"></span>
          </a>
          <ul class="nav nav-second-level collapse in" style="">
            <li v-bind:class="{active:childrenKey==='SupplierOrder'}"><router-link to="/v_supplier_order">订单管理</router-link></li>
            <li><a href="distributor.html">分销商管理</a></li>
            <li v-bind:class="{active:childrenKey==='DistributorGoods'}"><router-link to="/v_supplier_goods">商品管理</router-link></li>
            <li v-bind:class="{active:childrenKey==='DistributorLevel'}"><router-link to="/v_level">分销等级设置</router-link></li>
            <li v-bind:class="{active:childrenKey==='GoodsCategory'}"><router-link to="/v_category">商品分类设置</router-link></li>
          </ul>
        </li>
        <li> 
          <a href="javascript:;;">
          <i class="fa fa-sitemap"></i>
         <span class="nav-label">我是分销商</span> 
         <span class="fa arrow"></span></a>
          <ul class="nav nav-second-level collapse" style="height: 0px;">
            <li><a href="order-distributor.html">订单管理</a></li>
            <li class="active"><a href="member.html">顾客管理</a></li>
            <li><a href="product-distributor.html">商品管理</a></li>
          </ul>
        </li>
        <li v-bind:class="{active:parentKey==='Setting'}"> <a href="javascript:;;">
          <i class="fa fa-gears"></i> 
          <span class="nav-label">设置</span> 
          <span class="fa arrow"></span></a>
          <ul class="nav nav-second-level collapse">
            <li v-bind:class="{active:childrenKey==='User'}"><router-link to="/v_user">个人信息</router-link></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import Vue from 'vue';
  export default {
    data(){
      return {
        parentKey:'Index',
        childrenKey:'Index',
        userInfo:{
          userName:'',
          userType:''
        }
      }
    },
    mounted (){
      let _this = this;
      let userInfo = localStorage.getItem('ksx-user-c');
      if(!_this.$lodash.isEmpty(userInfo)){
        let u =  JSON.parse(userInfo);
        _this.userInfo.userName = u.realname;
        _this.userInfo.userType = u.userType;
      } else {
        _this.$axios.get('user').then((result)=> {
            let res = result.data;
            localStorage.setItem('ksx-user-c', JSON.stringify(result.data));
            _this.userInfo.userName = res.realname;
            _this.userInfo.userType = res.userType;
        }).catch((err) => {});
      }
      let meta = _this.$route.meta;
      _this.parentKey   = meta.parentKey;
      _this.childrenKey = meta.childrenKey; 
    }
  };
</script>