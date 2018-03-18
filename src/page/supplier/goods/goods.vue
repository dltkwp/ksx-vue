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
                      <label class="control-label" for="product_name">名称</label>
                      <input type="text" v-model="resarch.productName"  placeholder="名称" class="form-control" maxlength="20">
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="control-label" for="price">分类</label>
                      <select v-model="resarch.categoriesId" class="form-control">
                          <option v-for="(item,index) in categoryList" :key="index" v-bind:value="item.id">
                            {{ item.categoriesName }}
                          </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label class="control-label" for="status">状态</label>
                      <select v-model="resarch.status" class="form-control">
                        <option value="">全部</option>
                        <option value="1">在售</option>
                        <option value="0">停售</option>
                      </select>
                    </div>
                  </div>
                <button type="button" @click="rearchSubmit()" class="btn btn-primary">Rearch</button>                  
                </div>
              </div>
              <div class="ibox float-e-margins">
                <div class="ibox-title"> 商品列表 </div>
                <div class="ibox-content">
                  <div class="row">
                    <div class="col-sm-9 m-b-xs"> 
                      <router-link class="btn btn-primary btn-sm" to="/v_supplier_goods_save">新增商品</router-link>
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
                          <td> {{index + 1}}</td>
                          <td><img src="img/gallery/2s.jpg" class="img-lg"> {{item.productName}} </td>
                          <td> {{item.categoriesName}} </td>
                          <td> ￥{{item.minRetailPrice}} </td>
                          <td> ￥{{item.recommendedRetailPrice}} </td>
                          <td> ￥{{item.minRetailPrice}} </td>
                          <td> ￥30.00 </td>
                          <td> ￥35.00 </td>
                          <td> ￥40.00 </td>
                          <td> {{item.stock}} </td>
                          <td><span class="label label-primary">在售</span></td>
                          <td><button class="btn-white btn btn-sm">查看</button></td>
                        </tr>
                      </tbody>
                    </table>
                    <pagination :totalPage="parentTotalPage" :currentPage="parentCurrentpage" :changeCallback="parentCallback"></pagination>
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
          index:-1,
          list: [],
          resarch:{
            categoriesId:"",
            status:"",
            productName:''
          },
          categoriesIdMap:[],
          categoryList:[],
          parentTotalPage: 0,
          parentCurrentpage: 1
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
        rearchSubmit:function(){
          this.parentCurrentpage = 1;
          this.listData();
        },
        parentCallback(cPage)  {
          this.parentCurrentpage = cPage;
          this.listData();
        },
        listData() {
          let _this = this;
          _this.PUSH_LOADING();
          let param = []
          param.push('pageNum=' + _this.parentCurrentpage);
          param.push('pageSize=' + 15);
          if(!_this.$lodash.isEmpty(_this.resarch.productName)){
            param.push('productName=' + _this.resarch.productName);
          }
          if(parseInt(_this.resarch.categoriesId) >-1){
            param.push('categoriesId=' + _this.resarch.categoriesId);
          }
          if(parseInt(_this.resarch.status) >-1){
            param.push('status=' + _this.resarch.status);
          }
          _this.$axios
            .get("products?"+param.join('&'))
            .then(result => {
              let res = result.data;
              _this.parentTotalPage = res.pages;
              _this.$lodash.forEach(res.list,function(item){
                  let _category = _this.categoriesIdMap[item.categoriesId];
                  item.categoriesName = _category?_category.categoriesName:'';
              });
              _this.list = res.list;
              _this.SHIFT_LOADING();
            })
            .catch(err => {
              _this.SHIFT_LOADING();
            });
        },
        categoryListData(){
          let _this = this;
            _this.$axios.get('categories').then((result)=> {
              let tempArr = [];
              tempArr.push({categoriesName:'全部',id:""});
              tempArr = tempArr.concat(result.data);
              _this.$lodash.forEach(result.data,function(item){
                 _this.categoriesIdMap[item.id] = item;
              });

              _this.categoryList = tempArr;
              _this.resarch.categoriesId = "";
            }).catch(err => {});
        },
      }
    };
</script>